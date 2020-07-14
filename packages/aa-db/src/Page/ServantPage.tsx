import {AxiosError} from "axios";
import React from "react";
import {Col, Row, Tab, Tabs} from "react-bootstrap";
import Connection from "../Api/Connection";
import BasicListEntity from "../Api/Data/BasicListEntity";
import Region from "../Api/Data/Region";
import Servant from "../Api/Data/Servant";
import TraitMap from "../Api/Data/TraitMap";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import ServantAssets from "./Servant/ServantAssets";
import ServantMainData from "./Servant/ServantMainData";
import ServantMaterialBreakdown from "./Servant/ServantMaterialBreakdown";
import ServantMiscData from "./Servant/ServantMiscData";
import ServantNoblePhantasm from "./Servant/ServantNoblePhantasm";
import ServantPassive from "./Servant/ServantPassive";
import ServantPicker from "./Servant/ServantPicker";
import ServantPortrait from "./Servant/ServantPortrait";
import ServantProfileComments from "./Servant/ServantProfileComments";
import ServantProfileStats from "./Servant/ServantProfileStats";
import ServantSkill from "./Servant/ServantSkill";
import ServantStatGrowth from "./Servant/ServantStatGrowth";
import ServantTraits from "./Servant/ServantTraits";

interface IProps {
    region: Region;
    id: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    id: number;
    servants: BasicListEntity[];
    servant?: Servant;
    assetType?: string;
    assetId?: string;
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
        this.loadServant();
    }

    async loadServant() {
        try {
            let [servants, servant] = await Promise.all<BasicListEntity[], Servant, TraitMap>([
                Connection.servantList(this.props.region),
                Connection.servant(this.props.region, this.state.id),
                Connection.traitMap(this.props.region)
            ]);

            const assetType = Object.keys(servant.extraAssets.charaGraph)[0],
                assetMap = assetType ? servant.extraAssets.charaGraph[assetType] : undefined,
                assetId = assetMap ? Object.keys(assetMap)[0] : undefined;

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

    private updatePortrait(assetType: string, assetId: string) {
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
                        <ServantMainData servant={this.state.servant}
                                         assetType={this.state.assetType}
                                         assetId={this.state.assetId}/>
                    </Col>
                    <Col xs={{span: 12, order: 1}} lg={{span: 6, order: 2}}>
                        <ServantPortrait servant={this.state.servant}
                                         assetType={this.state.assetType}
                                         assetId={this.state.assetId}
                                         updatePortraitCallback={
                                             (assetType: string, assetId: string) => {
                                                 this.updatePortrait(assetType, assetId)
                                             }
                                         }/>
                    </Col>
                </Row>

                <Tabs id={'servant-tabs'} defaultActiveKey={'skill-1'} transition={false}>
                    <Tab eventKey={'skill-1'} title={'Skill 1'}>
                        <br/>
                        {this.state.servant.skills
                            .filter(skill => skill.num === 1)
                            .map((skill, index) => {
                                return <ServantSkill region={this.props.region} key={index} skill={skill}/>;
                            })}
                    </Tab>
                    <Tab eventKey={'skill-2'} title={'Skill 2'}>
                        <br/>
                        {this.state.servant.skills
                            .filter(skill => skill.num === 2)
                            .map((skill, index) => {
                                return <ServantSkill region={this.props.region} key={index} skill={skill}/>;
                            })}
                    </Tab>
                    <Tab eventKey={'skill-3'} title={'Skill 3'}>
                        <br/>
                        {this.state.servant.skills
                            .filter(skill => skill.num === 3)
                            .map((skill, index) => {
                                return <ServantSkill region={this.props.region} key={index} skill={skill}/>;
                            })}
                    </Tab>
                    <Tab eventKey={'nps'} title={'Noble Phantasms'}>
                        <br/>
                        {this.state.servant.noblePhantasms
                            .filter(noblePhantasm => noblePhantasm.functions.length > 0)
                            .map((noblePhantasm, index) => {
                                return <ServantNoblePhantasm region={this.props.region} key={index}
                                                             noblePhantasm={noblePhantasm}/>;
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
                                        <ServantPassive region={this.props.region} skill={skill}/>
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
                        <ServantProfileStats region={this.props.region} stats={servant.profile.stats}/>
                        <hr/>
                        <ServantProfileComments region={this.props.region} comments={servant.profile.comments}/>
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

export default ServantPage;
