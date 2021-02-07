import { Ai, Region } from "@atlasacademy/api-connector";
import { AxiosError } from "axios";
import React from "react";
import { Col, Row } from "react-bootstrap";
import Api from "../Api";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import AiDescriptor from "../Descriptor/AiDescriptor";
import Manager from "../Setting/Manager";
import AiGraph from "./Ai/AiGraph";
import AiTable from "./Ai/AiTable";

interface IProps {
    region: Region;
    aiType: Ai.AiType;
    id: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    aiCollection?: Ai.AiCollection;
    refs: Map<number, React.Ref<any>>;
}

class AiPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            refs: new Map(),
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadAi();
    }

    async loadAi() {
        try {
            const ai = await Api.ai(this.props.aiType, this.props.id);
            this.setState({
                loading: false,
                aiCollection: ai,
                refs: new Map(
                    [...ai.mainAis, ...ai.relatedAis].map((ai) => [
                        ai.id,
                        React.createRef(),
                    ])
                ),
            });
            document.title = `[${this.props.region}] AI - ${this.props.id} - Atlas Academy DB`;
        } catch (e) {
            this.setState({
                error: e,
            });
        }
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.aiCollection) return <Loading />;

        const aiCollection = this.state.aiCollection;
        const mainAi = aiCollection.mainAis[0];

        const rawUrl = `https://api.atlasacademy.io/raw/${this.props.region}/ai/${this.props.aiType}/${this.props.id}`;

        return (
            <div>
                <h1>AI {this.props.id}</h1>

                <br />

                <DataTable
                    data={{
                        "Parent AIs": AiDescriptor.renderParentAiLinks(
                            this.props.region,
                            mainAi.parentAis
                        ),
                        Raw: (
                            <Row>
                                <Col>
                                    <RawDataViewer
                                        text="Nice"
                                        data={this.state.aiCollection}
                                    />
                                </Col>
                                <Col>
                                    <RawDataViewer text="Raw" data={rawUrl} />
                                </Col>
                            </Row>
                        ),
                    }}
                />

                <AiGraph
                    aiCol={this.state.aiCollection}
                    handleNavigateAiId={(id) => {
                        let elementRef = this.state.refs.get(id);
                        (elementRef as React.RefObject<HTMLDivElement>)?.current?.scrollIntoView(
                            { behavior: "smooth" }
                        );
                    }}
                />
                <div ref={this.state.refs.get(aiCollection.mainAis[0].id)}>
                    <AiTable
                        region={this.props.region}
                        aiType={this.props.aiType}
                        ais={aiCollection.mainAis}
                    />
                </div>
                {Array.from(
                    new Set(aiCollection.relatedAis.map((ai) => ai.id))
                ).map((aiId) => (
                    <div ref={this.state.refs.get(aiId)}>
                        <AiTable
                            region={this.props.region}
                            aiType={this.props.aiType}
                            ais={aiCollection.relatedAis.filter(
                                (ai) => ai.id === aiId
                            )}
                        />
                    </div>
                ))}
            </div>
        );
    }
}

export default AiPage;
