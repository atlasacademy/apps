import {Region, Ai} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";
import React from "react";
import {Col, Row} from "react-bootstrap";
import Api from "../Api";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import AiDescriptor from "../Descriptor/AiDescriptor";
import SkillDescriptor from "../Descriptor/SkillDescriptor";
import TraitDescription from "../Descriptor/TraitDescription";
import {Renderable, mergeElements} from "../Helper/OutputHelper";
import Manager from "../Setting/Manager";

interface IProps {
    region: Region;
    aiType: Ai.AiType;
    id: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    aiCollection?: Ai.AiCollection;
}

function renderAiTable(region: Region, aiType: Ai.AiType, ai: Ai.Ai) {
    let tableData: Record<string, Renderable> = {
        "ID": ai.id,
        "Sub ID": ai.idx,
        "Info Text": ai.infoText,
        "Act Num": `${ai.actNumInt} - ${ai.actNum}`,
        "Priority": ai.priority,
        "Probability Weight": ai.probability,
        "Condition": `${ai.condNegative ? "Not " : ""}${ai.cond}`,
        "Condition Values": ai.vals.toString(),
        "Act Type": ai.aiAct.type,
        "Act Target": ai.aiAct.target,
        "Act Target Trait": mergeElements(
            ai.aiAct.targetIndividuality.map(
                trait => <TraitDescription region={region} trait={trait}/>
            ), ' '
        ),
    };
    if (ai.aiAct.skill && ai.aiAct.skillLv)
        tableData["Act Skill"] = <SkillDescriptor region={region} skill={ai.aiAct.skill}/>
        tableData["Act Skill Level"] = ai.aiAct.skillLv
    if (ai.avals.length >= 2) {
        tableData["Change AI ID"] = <AiDescriptor region={region} aiType={aiType} id={ai.avals[0]}/>;
        tableData["Action Value"] = ai.avals[1];
    }
    return <DataTable data={tableData}/>
}

class AiPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true
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
            });
            document.title = `[${this.props.region}] AI - ${this.props.id} - Atlas Academy DB`;
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading || !this.state.aiCollection)
            return <Loading/>;

        const aiCollection = this.state.aiCollection;
        const mainAi = aiCollection.mainAis[0];

        const rawUrl = `https://api.atlasacademy.io/raw/${this.props.region}/ai/${this.props.aiType}/${this.props.id}`;

        return (
            <div>
                <h1>AI {this.props.id}</h1>

                <br/>

                <DataTable data={{
                    "ID": mainAi.id,
                    "Parent Ais": AiDescriptor.renderParentAiLinks(this.props.region, mainAi.parentAis),
                    "Raw": (
                        <Row>
                            <Col><RawDataViewer text="Nice" data={this.state.aiCollection}/></Col>
                            <Col><RawDataViewer text="Raw" data={rawUrl}/></Col>
                        </Row>
                    ),
                }}/>

                {renderAiTable(this.props.region, this.props.aiType, aiCollection.mainAis[0])}
            </div>
        );
    }
}

export default AiPage;
