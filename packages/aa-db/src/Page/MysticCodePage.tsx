import {AxiosError} from "axios";
import React from "react";
import {Col, Row, Tab, Tabs} from "react-bootstrap";
import {withRouter} from "react-router";
import {RouteComponentProps} from "react-router-dom";
import Connection from "../Api/Connection";
import MysticCode from "../Api/Data/MysticCode";
import Region from "../Api/Data/Region";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import MysticCodeMainData from "./MysticCode/MysticCodeMainData";
import MysticCodePicker from "./MysticCode/MysticCodePicker";
import MysticCodePortrait from "./MysticCode/MysticCodePortrait";
import MysticCodeSkill from "./MysticCode/MysticCodeSkill";

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    tab?: string;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    id: number;
    mysticCodes: MysticCode[];
    mysticCode?: MysticCode;
}

class MysticCodePage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            id: this.props.id,
            mysticCodes: [],
        };
    }

    async componentDidMount() {
        try {
            let [mysticCodes, mysticCode] = await Promise.all<MysticCode[], MysticCode>([
                Connection.mysticCodeList(this.props.region),
                Connection.mysticCode(this.props.region, this.state.id),
            ]);

            this.setState({
                loading: false,
                mysticCodes,
                mysticCode
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

        if (this.state.loading || !this.state.mysticCode)
            return <Loading/>;

        return (
            <div>
                <MysticCodePicker region={this.props.region}
                                  mysticCodes={this.state.mysticCodes}
                                  id={this.state.mysticCode.id}/>

                <hr/>

                <Row>
                    <Col xs={{span: 12, order: 2}} lg={{span: 6, order: 1}}>
                        <MysticCodeMainData mysticCode={this.state.mysticCode}/>
                    </Col>
                    <Col xs={{span: 12, order: 1}} lg={{span: 6, order: 2}}>
                        <MysticCodePortrait mysticCode={this.state.mysticCode}/>
                    </Col>
                </Row>

                <Tabs id={'mystic-code-tabs'} defaultActiveKey={this.props.tab ?? 'skill-1'} transition={false}
                      onSelect={(key: string) => {
                          this.props.history.replace(`/${this.props.region}/mystic-code/${this.props.id}/${key}`);
                      }}>
                    <Tab eventKey={'skill-1'} title={'Skill 1'}>
                        <br/>
                        {this.state.mysticCode.skills[0] ? (
                            <MysticCodeSkill region={this.props.region} skill={this.state.mysticCode.skills[0]}/>
                        ) : null}
                    </Tab>

                    <Tab eventKey={'skill-2'} title={'Skill 2'}>
                        <br/>
                        {this.state.mysticCode.skills[1] ? (
                            <MysticCodeSkill region={this.props.region} skill={this.state.mysticCode.skills[1]}/>
                        ) : null}
                    </Tab>

                    <Tab eventKey={'skill-3'} title={'Skill 3'}>
                        <br/>
                        {this.state.mysticCode.skills[2] ? (
                            <MysticCodeSkill region={this.props.region} skill={this.state.mysticCode.skills[2]}/>
                        ) : null}
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(MysticCodePage);
