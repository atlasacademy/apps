import {AxiosError} from "axios";
import React from "react";
import {Col, Row, Table} from "react-bootstrap";
import Connection from "../Api/Connection";
import CraftEssence from "../Api/Data/CraftEssence";
import EntityType from "../Api/Data/EntityType";
import Func from "../Api/Data/Func";
import Region from "../Api/Data/Region";
import Servant from "../Api/Data/Servant";
import BuffIcon from "../Component/BuffIcon";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import CraftEssenceDescriptor from "../Descriptor/CraftEssenceDescriptor";
import NoblePhantasmDescriptor from "../Descriptor/NoblePhantasmDescriptor";
import ServantDescriptor from "../Descriptor/ServantDescriptor";
import SkillDescriptor from "../Descriptor/SkillDescriptor";
import FuncMainData from "./Func/FuncMainData";

interface IProps {
    region: Region;
    id: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    func?: Func;
}

class FuncPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.loadFunc();
    }

    async loadFunc() {
        try {
            const func = await Connection.func(this.props.region, this.props.id);

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
                            {func.reverseSkills.map((skill, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {skill.reverseServants.map((entity, index) => {
                                                if (entity.type === EntityType.SERVANT_EQUIP) {
                                                    return <p key={index}>
                                                        <CraftEssenceDescriptor region={this.props.region}
                                                                                craftEssence={entity as CraftEssence}/>
                                                    </p>;
                                                }

                                                if (entity.type === EntityType.NORMAL || entity.type === EntityType.HEROINE) {
                                                    return <p key={index}>
                                                        <ServantDescriptor region={this.props.region}
                                                                           servant={entity as Servant}/>
                                                    </p>;
                                                }

                                                return '';
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
                            {func.reverseTds.map((noblePhantasm, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {noblePhantasm.reverseServants.map((entity, index) => {
                                                if (entity.type === EntityType.SERVANT_EQUIP) {
                                                    return <p key={index}>
                                                        <CraftEssenceDescriptor region={this.props.region}
                                                                                craftEssence={entity as CraftEssence}/>
                                                    </p>;
                                                }

                                                if (entity.type === EntityType.NORMAL || entity.type === EntityType.HEROINE) {
                                                    return <p key={index}>
                                                        <ServantDescriptor region={this.props.region}
                                                                           servant={entity as Servant}/>
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
