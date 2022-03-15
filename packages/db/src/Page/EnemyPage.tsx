import { AxiosError } from "axios";
import React from "react";
import { Col, Row, Tab, Tabs } from "react-bootstrap";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { Enemy, Region, Servant } from "@atlasacademy/api-connector";

import Api from "../Api";
import NoblePhantasmBreakdown from "../Breakdown/NoblePhantasmBreakdown";
import SkillBreakdown from "../Breakdown/SkillBreakdown";
import ClassIcon from "../Component/ClassIcon";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import Manager from "../Setting/Manager";
import EnemyMainData from "./Enemy/EnemyMainData";
import EnemySubData from "./Enemy/EnemySubData";
import ServantAssets from "./Servant/ServantAssets";
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
    enemy?: Enemy.Enemy;
}

class EnemyPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadEnemy();
    }

    loadEnemy() {
        Promise.all([Api.enemy(this.props.id), Api.traitList()])
            .then(([enemy]) => {
                document.title = `[${this.props.region}] Enemy - ${enemy.name} - Atlas Academy DB`;
                this.setState({ enemy, loading: false });
            })
            .catch((error) => this.setState({ error }));
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.enemy) return <Loading />;

        const enemy = this.state.enemy;

        return (
            <div id={"enemy"}>
                <h1 style={{ marginBottom: "1rem" }}>
                    <ClassIcon className={enemy.className} rarity={enemy.rarity} height={50} />
                    &nbsp;
                    {enemy.name}
                </h1>

                <Row
                    style={{
                        marginBottom: "3%",
                    }}
                >
                    <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                        <EnemyMainData region={this.props.region} enemy={enemy} />
                    </Col>
                    <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                        <EnemySubData region={this.props.region} enemy={enemy} />
                    </Col>
                </Row>

                <Tabs
                    id={"enemy-tabs"}
                    defaultActiveKey={this.props.tab ?? "noble-phantasms"}
                    mountOnEnter={false}
                    onSelect={(key: string | null) => {
                        this.props.history.replace(`/${this.props.region}/enemy/${this.props.id}/${key}`);
                    }}
                >
                    {enemy.skills.length > 0 ? (
                        <Tab eventKey={"skills"} title={"Skills"}>
                            <br />
                            {enemy.skills.map((skill) => {
                                return (
                                    <SkillBreakdown
                                        region={this.props.region}
                                        key={skill.id}
                                        skill={skill}
                                        cooldowns={true}
                                        levels={10}
                                    />
                                );
                            })}
                        </Tab>
                    ) : null}
                    <Tab eventKey={"noble-phantasms"} title={"Noble Phantasms"}>
                        <br />
                        {enemy.noblePhantasms.map((noblePhantasm) => {
                            return (
                                <NoblePhantasmBreakdown
                                    key={noblePhantasm.id}
                                    region={this.props.region}
                                    servant={enemy as unknown as Servant.Servant}
                                    noblePhantasm={noblePhantasm}
                                    hideCard={true}
                                />
                            );
                        })}
                    </Tab>
                    {enemy.classPassive.length > 0 ? (
                        <Tab eventKey={"passives"} title={"Passives"}>
                            <br />
                            <Row>
                                {enemy.classPassive.map((skill) => {
                                    return (
                                        <Col xs={12} lg={(enemy.classPassive.length ?? 1) > 1 ? 6 : 12} key={skill.id}>
                                            <SkillBreakdown
                                                region={this.props.region}
                                                skill={skill}
                                                cooldowns={false}
                                            />
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Tab>
                    ) : null}
                    <Tab eventKey={"stat-growth"} title={"Stat Growth"}>
                        <br />
                        <ServantStatGrowth region={this.props.region} servant={enemy as unknown as Servant.Servant} />
                    </Tab>
                    <Tab eventKey={"profile"} title={"Profile"}>
                        <br />
                        <ServantProfileStat
                            region={this.props.region}
                            profile={(enemy as unknown as Servant.Servant).profile}
                        />
                    </Tab>
                    <Tab eventKey={"assets"} title={"Assets"}>
                        <br />
                        <ServantAssets region={this.props.region} servant={enemy as unknown as Servant.Servant} />
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(EnemyPage);
