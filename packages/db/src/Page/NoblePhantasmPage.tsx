import {Entity, NoblePhantasm, Region, Servant} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";
import React from "react";
import {Col, Form, Row} from "react-bootstrap";
import Api from "../Api";
import EffectBreakdown from "../Breakdown/EffectBreakdown";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import ServantDescriptor from "../Descriptor/ServantDescriptor";
import Manager from "../Setting/Manager";
import NoblePhantasmVersion from "./NoblePhantasm/NoblePhantasmVersion";

interface Event extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps {
    region: Region;
    id: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    noblePhantasm?: NoblePhantasm.NoblePhantasm;
    level: number;
    overcharge: number;
}

class NoblePhantasmPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            level: 1,
            overcharge: 1,
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadNp();
    }

    async loadNp() {
        try {
            const noblePhantasm = await Api.noblePhantasm(this.props.id);

            this.setState({
                loading: false,
                noblePhantasm: noblePhantasm,
            });
            document.title = `[${this.props.region}] Noble Phantasm - ${noblePhantasm.name} - Atlas Academy DB`
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    private changeLevel(level: number) {
        this.setState({
            level: level
        });
    }

    private changeOvercharge(level: number) {
        this.setState({
            overcharge: level
        });
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading || !this.state.noblePhantasm)
            return <Loading/>;

        const noblePhantasm = this.state.noblePhantasm;

        return (
            <div>
                <h1>{noblePhantasm.name}</h1>
                <br/>

                <DataTable data={{
                    "ID": noblePhantasm.id,
                    "Name": noblePhantasm.name,
                    "Type": noblePhantasm.type,
                    "Rank": noblePhantasm.rank,
                    "Detail": noblePhantasm.detail,
                    "Card Type": noblePhantasm.card,
                    "Owner": (
                        <div>
                            {(noblePhantasm.reverse?.nice?.servant ?? [])
                                .filter(servant => {
                                    return servant.type === Entity.EntityType.NORMAL
                                        || servant.type === Entity.EntityType.HEROINE
                                })
                                .map((servant, index) => {
                                    return (
                                        <div key={index}>
                                            <ServantDescriptor region={this.props.region}
                                                               servant={servant as Servant.Servant}
                                                               iconHeight={24}/>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    )
                }}/>
                <span>
                    <RawDataViewer text="Nice" data={noblePhantasm}/>
                    <RawDataViewer
                        text="Raw"
                        data={`https://api.atlasacademy.io/raw/${this.props.region}/NP/${noblePhantasm.id}?expand=true`}/>
                </span>

                <br/>
                <h3>Breakdown</h3>
                <EffectBreakdown region={this.props.region}
                                 funcs={noblePhantasm.functions}
                                 gain={noblePhantasm.npGain}
                                 levels={noblePhantasm.functions[0]?.svals.length ?? 1}/>

                <br/>
                <br/>
                <h3>Detailed Effects</h3>
                <Row>
                    <Col>
                        <Form inline style={{justifyContent: 'flex-end'}}>
                            <Form.Control as={'select'} value={this.state.level}
                                          onChange={(ev: Event) => this.changeLevel(parseInt(ev.target.value))}>
                                {[1, 2, 3, 4, 5].map(level => (
                                    <option key={level} value={level}>NP LEVEL {level}</option>
                                ))}
                            </Form.Control>
                        </Form>
                    </Col>
                    <Col>
                        <Form inline>
                            <Form.Control as={'select'} value={this.state.overcharge}
                                          onChange={(ev: Event) => this.changeOvercharge(parseInt(ev.target.value))}>
                                {[1, 2, 3, 4, 5].map(level => (
                                    <option key={level} value={level}>OVERCHARGE {level}</option>
                                ))}
                            </Form.Control>
                        </Form>
                    </Col>
                </Row>

                <br/>
                <NoblePhantasmVersion region={this.props.region}
                                      noblePhantasm={noblePhantasm}
                                      level={this.state.level}
                                      overcharge={this.state.overcharge}/>
            </div>
        );
    }
}

export default NoblePhantasmPage;
