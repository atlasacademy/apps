import {AxiosError} from "axios";
import React from "react";
import {Col, Row, Tab, Tabs} from "react-bootstrap";
import {withRouter} from "react-router";
import {RouteComponentProps} from "react-router-dom";
import Connection from "../Api/Connection";
import BasicListEntity from "../Api/Data/BasicListEntity";
import CraftEssence from "../Api/Data/CraftEssence";
import Region from "../Api/Data/Region";
import TraitMap from "../Api/Data/TraitMap";
import SkillBreakdown from "../Breakdown/SkillBreakdown";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import CraftEssenceMainData from "./CraftEssence/CraftEssenceMainData";
import CraftEssencePicker from "./CraftEssence/CraftEssencePicker";
import CraftEssencePortrait from "./CraftEssence/CraftEssencePortrait";
import CraftEssenceProfileComments from "./CraftEssence/CraftEssenceProfileComments";
import CraftEssenceStatGrowth from "./CraftEssence/CraftEssenceStatGrowth";

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    tab?: string;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    id: number;
    craftEssences: BasicListEntity[];
    craftEssence?: CraftEssence;
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
        this.loadCraftEssence();
    }

    async loadCraftEssence() {
        try {
            let [craftEssences, craftEssence] = await Promise.all<BasicListEntity[], CraftEssence, TraitMap>([
                Connection.craftEssenceList(this.props.region),
                Connection.craftEssence(this.props.region, this.state.id),
                Connection.traitMap(this.props.region)
            ]);

            this.setState({
                loading: false,
                craftEssences,
                craftEssence
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

        if (this.state.loading || !this.state.craftEssence)
            return <Loading/>;

        const craftEssence = this.state.craftEssence;

        return (
            <div>
                <CraftEssencePicker region={this.props.region}
                                    craftEssences={this.state.craftEssences}
                                    id={this.state.craftEssence.collectionNo}/>
                <hr/>

                <Row>
                    <Col xs={{span: 12, order: 2}} lg={{span: 6, order: 1}}>
                        <CraftEssenceMainData region={this.props.region} craftEssence={this.state.craftEssence}/>
                    </Col>
                    <Col xs={{span: 12, order: 1}} lg={{span: 6, order: 2}}>
                        <CraftEssencePortrait craftEssence={this.state.craftEssence}/>
                    </Col>
                </Row>

                <Tabs id={'ce-tabs'} defaultActiveKey={this.props.tab ?? 'effects'} transition={false}
                      onSelect={(key: string) => {
                          this.props.history.replace(`/${this.props.region}/craft-essence/${this.props.id}/${key}`);
                      }}>
                    <Tab eventKey={'effects'} title={'Effects'}>
                        <br/>
                        <Row>
                            {this.state.craftEssence.skills
                                .map((skill, index) => {
                                    return (
                                        <Col key={index} xs={12} lg={craftEssence.skills.length > 1 ? 6 : 12}>
                                            <SkillBreakdown region={this.props.region}
                                                            skill={skill}
                                                            cooldowns={false}/>
                                        </Col>
                                    );
                                })}
                        </Row>
                    </Tab>
                    <Tab eventKey={'stat-growth'} title={'Stat Growth'}>
                        <br/>
                        <CraftEssenceStatGrowth region={this.props.region} craftEssence={craftEssence}/>
                    </Tab>
                    <Tab eventKey={'profile'} title={'Profile'}>
                        <br/>
                        <CraftEssenceProfileComments region={this.props.region}
                                                     comments={craftEssence.profile.comments}/>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(CraftEssencePage);
