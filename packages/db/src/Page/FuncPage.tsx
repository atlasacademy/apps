import { AxiosError } from "axios";
import React from "react";
import { Col, Row, Table } from "react-bootstrap";

import { Func, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import BuffIcon from "../Component/BuffIcon";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import CommandCodeDescriptor from "../Descriptor/CommandCodeDescriptor";
import { entityDescriptorTable } from "../Descriptor/EntityDescriptor";
import { BasicMysticCodeDescriptor } from "../Descriptor/MysticCodeDescriptor";
import NoblePhantasmDescriptor from "../Descriptor/NoblePhantasmDescriptor";
import SkillDescriptor from "../Descriptor/SkillDescriptor";
import Manager from "../Setting/Manager";
import FuncMainData from "./Func/FuncMainData";

interface IProps {
    region: Region;
    id: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    func?: Func.Func;
}

class FuncPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadFunc();
    }

    loadFunc() {
        Api.func(this.props.id)
            .then((func) => {
                document.title = `[${this.props.region}] Function - ${func.funcId} - Atlas Academy DB`;
                this.setState({ func, loading: false });
            })
            .catch((error) => this.setState({ error }));
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.func) return <Loading />;

        const func = this.state.func;

        return (
            <div>
                <h1>
                    {func.funcPopupIcon ? (
                        <span>
                            <BuffIcon location={func.funcPopupIcon} height={48} />
                            &nbsp;
                        </span>
                    ) : null}
                    Function: {this.props.id}
                </h1>
                <br />

                <FuncMainData region={this.props.region} func={func} />

                <Row>
                    <Col xs={12} lg={6}>
                        <h3>Related Skills</h3>
                        <Table style={{ fontSize: "0.8em" }}>
                            <tbody>
                                {(func.reverse?.basic?.skill ?? []).map((skill, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                {(skill.reverse?.basic?.servant ?? []).map((entity, index) =>
                                                    entityDescriptorTable(this.props.region, entity, index)
                                                )}
                                                {(skill.reverse?.basic?.CC ?? []).map((commandCode) => (
                                                    <CommandCodeDescriptor
                                                        region={this.props.region}
                                                        commandCode={commandCode}
                                                    />
                                                ))}
                                                {(skill.reverse?.basic?.MC ?? []).map((mysticCode) => {
                                                    return (
                                                        <div key={mysticCode.id}>
                                                            <BasicMysticCodeDescriptor
                                                                region={this.props.region}
                                                                mysticCode={mysticCode}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </td>
                                            <td>
                                                <SkillDescriptor
                                                    region={this.props.region}
                                                    skill={skill}
                                                    iconHeight={25}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Col>
                    <Col xs={12} lg={6}>
                        <h3>Related Noble Phantasms</h3>
                        <Table style={{ fontSize: "0.8em" }}>
                            <tbody>
                                {(func.reverse?.basic?.NP ?? []).map((noblePhantasm, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                {(noblePhantasm.reverse?.basic?.servant ?? []).map((entity, index) =>
                                                    entityDescriptorTable(this.props.region, entity, index)
                                                )}
                                            </td>
                                            <td>
                                                <NoblePhantasmDescriptor
                                                    region={this.props.region}
                                                    noblePhantasm={noblePhantasm}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default FuncPage;
