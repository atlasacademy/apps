import { AxiosError } from "axios";
import React from "react";
import { Col, Row, Tab, Tabs } from "react-bootstrap";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { CraftEssence, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import SkillBreakdown from "../Breakdown/SkillBreakdown";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import Manager from "../Setting/Manager";
import CraftEssenceAssets from "./CraftEssence/CraftEssenceAssets";
import CraftEssenceMainData from "./CraftEssence/CraftEssenceMainData";
import CraftEssencePicker from "./CraftEssence/CraftEssencePicker";
import CraftEssencePortrait from "./CraftEssence/CraftEssencePortrait";
import CraftEssenceProfileComments from "./CraftEssence/CraftEssenceProfileComments";
import CraftEssenceStatGrowth from "./CraftEssence/CraftEssenceStatGrowth";
import ServantVoiceLines from "./Servant/ServantVoiceLines";

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    tab?: string;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    id: number;
    craftEssences: CraftEssence.CraftEssenceBasic[];
    craftEssence?: CraftEssence.CraftEssence;
}

class CraftEssencePage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            id: this.props.id,
            craftEssences: [],
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadCraftEssence();
    }

    loadCraftEssence() {
        Promise.all([Api.craftEssenceList(), Api.craftEssence(this.state.id), Api.traitList()])
            .then(([craftEssences, craftEssence]) => {
                document.title = `[${this.props.region}] Craft Essence - ${craftEssence.name} - Atlas Academy DB`;
                this.setState({ craftEssences, craftEssence, loading: false });
            })
            .catch((error) => this.setState({ error }));
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.craftEssence) return <Loading />;

        const craftEssence = this.state.craftEssence;

        return (
            <div>
                <CraftEssencePicker
                    region={this.props.region}
                    craftEssences={this.state.craftEssences}
                    id={this.state.craftEssence.collectionNo}
                />
                <hr />

                <Row
                    style={{
                        marginBottom: "3%",
                    }}
                >
                    <Col xs={{ span: 12, order: 2 }} lg={{ span: 6, order: 1 }}>
                        <CraftEssenceMainData region={this.props.region} craftEssence={this.state.craftEssence} />
                    </Col>
                    <Col xs={{ span: 12, order: 1 }} lg={{ span: 6, order: 2 }}>
                        <CraftEssencePortrait craftEssence={this.state.craftEssence} />
                    </Col>
                </Row>

                <Tabs
                    id={"ce-tabs"}
                    defaultActiveKey={this.props.tab ?? "effects"}
                    mountOnEnter={false}
                    onSelect={(key: string | null) => {
                        this.props.history.replace(`/${this.props.region}/craft-essence/${this.props.id}/${key}`);
                    }}
                >
                    <Tab eventKey={"effects"} title={"Effects"}>
                        <br />
                        <Row>
                            {this.state.craftEssence.skills
                                .sort((a, b) => (a.num || 0) - (b.num || 0) || (a.priority || 0) - (b.priority || 0))
                                .map((skill) => {
                                    return (
                                        <Col key={skill.id} xs={12} lg={craftEssence.skills.length > 1 ? 6 : 12}>
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
                    <Tab eventKey={"stat-growth"} title={"Stat Growth"}>
                        <br />
                        <CraftEssenceStatGrowth region={this.props.region} craftEssence={craftEssence} />
                    </Tab>
                    <Tab eventKey={"profile"} title={"Profile"}>
                        <br />
                        <CraftEssenceProfileComments
                            region={this.props.region}
                            comments={craftEssence.profile?.comments ?? []}
                        />
                    </Tab>
                    <Tab eventKey={"assets"} title={"Assets"}>
                        <br />
                        <CraftEssenceAssets region={this.props.region} craftEssence={craftEssence} />
                    </Tab>
                    {(craftEssence.profile?.voices.length ?? 0) > 0 && (
                        <Tab eventKey={"voices"} title={"Voices"}>
                            <br />
                            <ServantVoiceLines
                                region={this.props.region}
                                servants={new Map()}
                                servant={craftEssence}
                                servantName={craftEssence.name}
                            />
                        </Tab>
                    )}
                </Tabs>
            </div>
        );
    }
}

export default withRouter(CraftEssencePage);
