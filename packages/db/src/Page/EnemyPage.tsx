import {Enemy, Region, Servant, Trait} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";
import React from "react";
import {Col, Row, Tab, Tabs} from "react-bootstrap";
import {withRouter} from "react-router";
import {RouteComponentProps} from "react-router-dom";
import Api from "../Api";
import NoblePhantasmBreakdown from "../Breakdown/NoblePhantasmBreakdown";
import SkillBreakdown from "../Breakdown/SkillBreakdown";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import ClassIcon from "../Component/ClassIcon";
import Manager from "../Setting/Manager";
import EnemyMainData from "./Enemy/EnemyMainData";
import EnemySubData from "./Enemy/EnemySubData";
import ServantProfileStat from "./Servant/ServantProfileStats";
import ServantStatGrowth from "./Servant/ServantStatGrowth";

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    tab?: string;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    id: number;
    enemy?: Enemy.Enemy;
}

class EnemyPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            id: this.props.id,
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadEnemy();
    }

    async loadEnemy() {
        try {
            let [enemy] = await Promise.all<Enemy.Enemy, Trait.Trait[]>([
                Api.enemy(this.state.id),
                Api.traitList()
            ]);

            this.setState({
                loading: false,
                enemy,
            });
            document.title = `[${this.props.region}] Enemy - ${enemy.name} - Atlas Academy DB`
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading || !this.state.enemy)
            return <Loading/>;

        const enemy = this.state.enemy;

        return (
            <div id={'enemy'}>
                <h1 style={{ marginBottom: "1rem" }}>
                    <ClassIcon className={enemy.className} rarity={enemy.rarity} height={50}/>
                    &nbsp;
                    {enemy.name}
                </h1>

                <Row style={{
                    marginBottom: '3%'
                }}>
                    <Col xs={{span: 12, order: 2}} lg={{span: 6, order: 1}}>
                        <EnemyMainData region={this.props.region}
                                       enemy={enemy}/>
                    </Col>
                    <Col xs={{span: 12, order: 1}} lg={{span: 6, order: 2}}>
                        <EnemySubData region={this.props.region}
                                      enemy={enemy}/>
                    </Col>
                </Row>

                <Tabs id={'enemy-tabs'} defaultActiveKey={this.props.tab ?? 'noble-phantasms'} mountOnEnter={false}
                      onSelect={(key: string | null) => {
                          this.props.history.replace(`/${this.props.region}/enemy/${this.props.id}/${key}`);
                      }}>
                    <Tab eventKey={'noble-phantasms'} title={'Noble Phantasms'}>
                        <br/>
                        {enemy.noblePhantasms
                            .map((noblePhantasm, index) => {
                                return <NoblePhantasmBreakdown key={index}
                                                               region={this.props.region}
                                                               servant={enemy as unknown as Servant.Servant}
                                                               noblePhantasm={noblePhantasm}
                                                               hideCard={true}/>;
                            })}
                    </Tab>
                    {enemy.skills.length > 0 ? (
                        <Tab eventKey={'skills'} title={'Skills'}>
                            <br/>
                            {enemy
                                .skills
                                .map((skill, index) => {
                                    return <SkillBreakdown region={this.props.region}
                                                           key={index}
                                                           skill={skill}
                                                           cooldowns={true}
                                                           levels={10}/>;
                                })}
                        </Tab>
                    ) : null}
                    {enemy.classPassive.length > 0 ? (
                        <Tab eventKey={'passives'} title={'Passives'}>
                            <br/>
                            <Row>
                                {enemy.classPassive.map((skill, index) => {
                                    return (
                                        <Col xs={12}
                                             lg={(enemy.classPassive.length ?? 1) > 1 ? 6 : 12}
                                             key={index}>
                                            <SkillBreakdown region={this.props.region} skill={skill} cooldowns={false}/>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Tab>
                    ) : null}
                    <Tab eventKey={'stat-growth'} title={'Stat Growth'}>
                        <br/>
                        <ServantStatGrowth region={this.props.region} servant={enemy as unknown as Servant.Servant}/>
                    </Tab>
                    <Tab eventKey={'profile'} title={'Profile'}>
                        <br/>
                        <ServantProfileStat region={this.props.region} profile={(enemy as unknown as Servant.Servant).profile}/>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(EnemyPage);
