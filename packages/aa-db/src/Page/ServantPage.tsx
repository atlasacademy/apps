import {Region, Servant, ServantBasic, Trait} from "@atlasacademy/api-connector";
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
import Manager from "../Setting/Manager";
import ServantAssets from "./Servant/ServantAssets";
import ServantMainData from "./Servant/ServantMainData";
import ServantMaterialBreakdown from "./Servant/ServantMaterialBreakdown";
import ServantMiscData from "./Servant/ServantMiscData";
import ServantPicker from "./Servant/ServantPicker";
import ServantPortrait from "./Servant/ServantPortrait";
import ServantProfileComments from "./Servant/ServantProfileComments";
import ServantProfileStats from "./Servant/ServantProfileStats";
import ServantStatGrowth from "./Servant/ServantStatGrowth";
import ServantTraits from "./Servant/ServantTraits";

type AssetType = "ascension" | "costume";

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    tab?: string;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    id: number;
    servants: ServantBasic[];
    servant?: Servant;
    assetType?: AssetType;
    assetId?: number;
}

class ServantPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            id: this.props.id,
            servants: [],
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadServant();
    }

    async loadServant() {
        try {
            let [servants, servant] = await Promise.all<ServantBasic[], Servant, Trait[]>([
                Api.servantList(),
                Api.servant(this.state.id),
                Api.traitList()
            ]);

            let assetType: AssetType | undefined,
                assetId;

            if (servant.extraAssets.charaGraph.ascension) {
                assetType = 'ascension';
                assetId = Object.keys(servant.extraAssets.charaGraph.ascension).shift();
                if (assetId !== undefined)
                    assetId = parseInt(assetId);
            }

            if (assetId === undefined && servant.extraAssets.charaGraph.costume) {
                assetType = 'costume';
                assetId = Object.keys(servant.extraAssets.charaGraph.costume).shift();
                if (assetId !== undefined)
                    assetId = parseInt(assetId);
            }

            this.setState({
                loading: false,
                servants,
                servant,
                assetType,
                assetId
            });
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    private updatePortrait(assetType: AssetType, assetId: number) {
        this.setState({assetType, assetId});
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading || !this.state.servant)
            return <Loading/>;

        const servant = this.state.servant;

        return (
            <div id={'servant'}>
                <ServantPicker region={this.props.region}
                               servants={this.state.servants}
                               id={this.state.servant.collectionNo}/>
                <hr/>

                <Row>
                    <Col xs={{span: 12, order: 2}} lg={{span: 6, order: 1}}>
                        <ServantMainData region={this.props.region}
                                         servant={this.state.servant}
                                         assetType={this.state.assetType}
                                         assetId={this.state.assetId}/>
                    </Col>
                    <Col xs={{span: 12, order: 1}} lg={{span: 6, order: 2}}>
                        <ServantPortrait servant={this.state.servant}
                                         assetType={this.state.assetType}
                                         assetId={this.state.assetId}
                                         updatePortraitCallback={
                                             (assetType: AssetType, assetId: number) => {
                                                 this.updatePortrait(assetType, assetId)
                                             }
                                         }/>
                    </Col>
                </Row>

                <Tabs id={'servant-tabs'} defaultActiveKey={this.props.tab ?? 'skill-1'} transition={false}
                      onSelect={(key?: string) => {
                          this.props.history.replace(`/${this.props.region}/servant/${this.props.id}/${key}`);
                      }}>
                    <Tab eventKey={'skill-1'} title={'Skill 1'}>
                        <br/>
                        {this.state.servant.skills
                            .filter(skill => skill.num === 1)
                            .map((skill, index) => {
                                return <SkillBreakdown region={this.props.region}
                                                       key={index}
                                                       skill={skill}
                                                       cooldowns={true}
                                                       levels={10}/>;
                            })}
                    </Tab>
                    <Tab eventKey={'skill-2'} title={'Skill 2'}>
                        <br/>
                        {this.state.servant.skills
                            .filter(skill => skill.num === 2)
                            .map((skill, index) => {
                                return <SkillBreakdown region={this.props.region}
                                                       key={index}
                                                       skill={skill}
                                                       cooldowns={true}
                                                       levels={10}/>;
                            })}
                    </Tab>
                    <Tab eventKey={'skill-3'} title={'Skill 3'}>
                        <br/>
                        {this.state.servant.skills
                            .filter(skill => skill.num === 3)
                            .map((skill, index) => {
                                return <SkillBreakdown region={this.props.region}
                                                       key={index}
                                                       skill={skill}
                                                       cooldowns={true}
                                                       levels={10}/>;
                            })}
                    </Tab>
                    <Tab eventKey={'noble-phantasms'} title={'Noble Phantasms'}>
                        <br/>
                        {this.state.servant.noblePhantasms
                            .filter(noblePhantasm => noblePhantasm.functions.length > 0)
                            .map((noblePhantasm, index) => {
                                return <NoblePhantasmBreakdown key={index}
                                                               region={this.props.region}
                                                               servant={servant}
                                                               noblePhantasm={noblePhantasm}
                                                               assetType={this.state.assetType}
                                                               assetId={this.state.assetId}/>;
                            })}
                    </Tab>
                    <Tab eventKey={'passives'} title={'Passives'}>
                        <br/>
                        <Row>
                            {servant.classPassive.map((skill, index) => {
                                return (
                                    <Col xs={12}
                                         lg={(servant.classPassive.length ?? 1) > 1 ? 6 : 12}
                                         key={index}>
                                        <SkillBreakdown region={this.props.region} skill={skill} cooldowns={false}/>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Tab>
                    <Tab eventKey={'traits'} title={'Traits'}>
                        <br/>
                        <ServantTraits region={this.props.region} traits={this.state.servant.traits}/>
                    </Tab>
                    <Tab eventKey={'materials'} title={'Materials'}>
                        <br/>
                        <Row>
                            <Col xs={12} lg={6}>
                                <ServantMaterialBreakdown region={this.props.region}
                                                          materials={servant.ascensionMaterials}
                                                          title={'Ascension Materials'}/>
                            </Col>
                            <Col xs={12} lg={6}>
                                <ServantMaterialBreakdown region={this.props.region}
                                                          materials={servant.skillMaterials}
                                                          title={'Skill Materials'}/>
                            </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey={'stat-growth'} title={'Stat Growth'}>
                        <br/>
                        <ServantStatGrowth region={this.props.region} servant={servant}/>
                    </Tab>
                    <Tab eventKey={'misc'} title={'Misc'}>
                        <br/>
                        <ServantMiscData servant={this.state.servant}/>
                    </Tab>
                    <Tab eventKey={'lore'} title={'Profile'}>
                        <br/>
                        <ServantProfileStats region={this.props.region} profile={servant.profile}/>
                        <hr/>
                        <ServantProfileComments region={this.props.region} comments={servant.profile?.comments ?? []}/>
                    </Tab>
                    <Tab eventKey={'assets'} title={'Assets'}>
                        <br/>
                        <ServantAssets region={this.props.region} servant={servant}/>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(ServantPage);
