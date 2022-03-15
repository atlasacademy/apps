import { AxiosError } from "axios";
import React from "react";
import { Col, Form, Row } from "react-bootstrap";

import { NoblePhantasm, Region } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import Api, { Host } from "../Api";
import EffectBreakdown from "../Breakdown/EffectBreakdown";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import EntityDescriptor from "../Descriptor/EntityDescriptor";
import TraitDescription from "../Descriptor/TraitDescription";
import { asPercent, mergeElements } from "../Helper/OutputHelper";
import getRubyText from "../Helper/StringHelper";
import Manager from "../Setting/Manager";
import NoblePhantasmVersion from "./NoblePhantasm/NoblePhantasmVersion";

interface Event extends React.ChangeEvent<HTMLInputElement> {}

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
        Api.noblePhantasm(this.props.id)
            .then((noblePhantasm) => {
                document.title = `[${this.props.region}] Noble Phantasm - ${noblePhantasm.name} - Atlas Academy DB`;
                this.setState({ noblePhantasm, loading: false });
            })
            .catch((error) => this.setState({ error }));
    }

    private changeLevel(level: number) {
        this.setState({
            level: level,
        });
    }

    private changeOvercharge(level: number) {
        this.setState({
            overcharge: level,
        });
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.noblePhantasm) return <Loading />;

        const noblePhantasm = this.state.noblePhantasm;

        return (
            <div>
                <h1>{getRubyText(this.props.region, noblePhantasm.name, noblePhantasm.ruby)}</h1>
                <br />

                <DataTable
                    data={{
                        ID: noblePhantasm.id,
                        Name: noblePhantasm.name,
                        Ruby: noblePhantasm.ruby,
                        Detail: noblePhantasm.detail,
                        Rank: noblePhantasm.rank,
                        Type: noblePhantasm.type,
                        "Card Type": toTitleCase(noblePhantasm.card),
                        Hits: mergeElements(
                            noblePhantasm.npDistribution.map((hit) => asPercent(hit, 0)),
                            ", "
                        ),
                        Traits: mergeElements(
                            noblePhantasm.individuality.map((trait) => (
                                <TraitDescription
                                    region={this.props.region}
                                    trait={trait}
                                    owner="noble-phantasms"
                                    ownerParameter="individuality"
                                />
                            )),
                            ", "
                        ),
                        Owner: (
                            <div>
                                {(noblePhantasm.reverse?.basic?.servant ?? []).map((servant) => {
                                    return (
                                        <div key={servant.id}>
                                            <EntityDescriptor
                                                region={this.props.region}
                                                entity={servant}
                                                iconHeight={25}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ),
                    }}
                />
                <span>
                    <RawDataViewer text="Nice" data={noblePhantasm} />
                    <RawDataViewer
                        text="Raw"
                        data={`${Host}/raw/${this.props.region}/NP/${noblePhantasm.id}?expand=true`}
                    />
                </span>

                <br />
                <h3>Breakdown</h3>
                <EffectBreakdown
                    region={this.props.region}
                    funcs={noblePhantasm.functions}
                    gain={noblePhantasm.npGain}
                    levels={noblePhantasm.functions[0]?.svals.length ?? 1}
                />

                <br />
                <br />
                <h3>Detailed Effects</h3>
                <Row>
                    <Col>
                        <Form inline style={{ justifyContent: "flex-end" }}>
                            <Form.Control
                                as={"select"}
                                value={this.state.level}
                                onChange={(ev: Event) => this.changeLevel(parseInt(ev.target.value))}
                            >
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <option key={level} value={level}>
                                        NP LEVEL {level}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form>
                    </Col>
                    <Col>
                        <Form inline>
                            <Form.Control
                                as={"select"}
                                value={this.state.overcharge}
                                onChange={(ev: Event) => this.changeOvercharge(parseInt(ev.target.value))}
                            >
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <option key={level} value={level}>
                                        OVERCHARGE {level}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form>
                    </Col>
                </Row>

                <br />
                <NoblePhantasmVersion
                    region={this.props.region}
                    noblePhantasm={noblePhantasm}
                    level={this.state.level}
                    overcharge={this.state.overcharge}
                />
            </div>
        );
    }
}

export default NoblePhantasmPage;
