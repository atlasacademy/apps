import {CraftEssence, Entity, Func, Region, Servant} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";
import React from "react";
import {Col, Row, Table} from "react-bootstrap";
import Api from "../Api";
import BuffIcon from "../Component/BuffIcon";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import CraftEssenceDescriptor from "../Descriptor/CraftEssenceDescriptor";
import MysticCodeDescriptor from "../Descriptor/MysticCodeDescriptor";
import NoblePhantasmDescriptor from "../Descriptor/NoblePhantasmDescriptor";
import ServantDescriptor from "../Descriptor/ServantDescriptor";
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
            loading: true
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadFunc();
    }

    async loadFunc() {
        try {
            const func = await Api.func(this.props.id);

            this.setState({
                loading: false,
                func: func,
            });
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading || !this.state.func)
            return <Loading/>;

        const func = this.state.func;

        return (
            <div>
                <h1>
                    {func.funcPopupIcon ? (
                        <span>
                            <BuffIcon location={func.funcPopupIcon} height={48}/>
                            &nbsp;
                        </span>
                    ) : null}
                    Function: {this.props.id}
                </h1>
                <br/>

                <FuncMainData region={this.props.region} func={func}/>

                <Row>
                    <Col xs={12} lg={6}>
                        <h3>Related Skills</h3>
                        <Table style={{fontSize: "0.8em"}}>
                            <tbody>
                            {(func.reverse?.nice?.skill ?? []).map((skill, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {(skill.reverse?.nice?.servant ?? []).map((entity, index) => {
                                                if (entity.type === Entity.EntityType.SERVANT_EQUIP) {
                                                    return <p key={index}>
                                                        <CraftEssenceDescriptor region={this.props.region}
                                                                                craftEssence={entity as CraftEssence.CraftEssence}/>
                                                    </p>;
                                                }

                                                if (entity.type === Entity.EntityType.NORMAL || entity.type === Entity.EntityType.HEROINE) {
                                                    return <p key={index}>
                                                        <ServantDescriptor region={this.props.region}
                                                                           servant={entity as Servant.Servant}/>
                                                    </p>;
                                                }

                                                return '';
                                            })}
                                            {/*TODO: Command Code Reverse Mapping*/}
                                            {(skill.reverse?.nice?.MC ?? []).map((mysticCode, index) => {
                                                return <p key={index}>
                                                    <MysticCodeDescriptor region={this.props.region}
                                                                          mysticCode={mysticCode}/>
                                                </p>
                                            })}
                                        </td>
                                        <td>
                                            <SkillDescriptor region={this.props.region} skill={skill}/>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    </Col>
                    <Col xs={12} lg={6}>
                        <h3>Related Noble Phantasms</h3>
                        <Table style={{fontSize: "0.8em"}}>
                            <tbody>
                            {(func.reverse?.nice?.NP ?? []).map((noblePhantasm, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {(noblePhantasm.reverse?.nice?.servant ?? []).map((entity, index) => {
                                                if (entity.type === Entity.EntityType.SERVANT_EQUIP) {
                                                    return <p key={index}>
                                                        <CraftEssenceDescriptor region={this.props.region}
                                                                                craftEssence={entity as CraftEssence.CraftEssence}/>
                                                    </p>;
                                                }

                                                if (entity.type === Entity.EntityType.NORMAL || entity.type === Entity.EntityType.HEROINE) {
                                                    return <p key={index}>
                                                        <ServantDescriptor region={this.props.region}
                                                                           servant={entity as Servant.Servant}/>
                                                    </p>;
                                                }

                                                return '';
                                            })}
                                        </td>
                                        <td>
                                            <NoblePhantasmDescriptor region={this.props.region}
                                                                     noblePhantasm={noblePhantasm}/>
                                        </td>
                                    </tr>
                                )
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
