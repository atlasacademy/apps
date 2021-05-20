import {Region, Entity, Servant} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";
import React from "react";
import {Alert, Col, Row, Tab, Tabs} from "react-bootstrap";
import {withRouter} from "react-router";
import {RouteComponentProps} from "react-router-dom";
import Api, {Host} from "../Api";
import NoblePhantasmBreakdown from "../Breakdown/NoblePhantasmBreakdown";
import SkillBreakdown from "../Breakdown/SkillBreakdown";
import SkillReferenceBreakdown from "../Breakdown/SkillReferenceBreakdown";
import ClassIcon from "../Component/ClassIcon";
import ErrorStatus from "../Component/ErrorStatus";
import RawDataViewer from "../Component/RawDataViewer";
import Loading from "../Component/Loading";
import Manager from "../Setting/Manager";
import ServantAssets from "./Servant/ServantAssets";
import ServantBondGrowth from "./Servant/ServantBondGrowth";
import ServantMainData from "./Servant/ServantMainData";
import ServantMaterialBreakdown from "./Servant/ServantMaterialBreakdown";
import ServantPicker from "./Servant/ServantPicker";
import ServantPortrait from "./Servant/ServantPortrait";
import ServantProfileComments from "./Servant/ServantProfileComments";
import ServantProfileStats from "./Servant/ServantProfileStats";
import ServantRelatedQuests from "./Servant/ServantRelatedQuests";
import ServantCostumeDetails from "./Servant/ServantCostumeDetails";
import ServantStatGrowth from "./Servant/ServantStatGrowth";
import ServantTraits from "./Servant/ServantTraits";
import ServantVoiceLines from "./Servant/ServantVoiceLines";
import VoiceActorDescriptor from "../Descriptor/VoiceActorDescriptor";
import IllustratorDescriptor from "../Descriptor/IllustratorDescriptor";

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
    servants: Servant.ServantBasic[];
    servant?: Servant.Servant;
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
            let [servants, servant] = await Promise.all<Servant.ServantBasic[], Servant.Servant>([
                Api.servantList(),
                Api.servant(this.state.id),
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
                assetId,
            });
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    private skillRankUps(skillId: number): number[] {
        const rankUps = this.state.servant?.script.SkillRankUp;
        if (!rankUps)
            return [];

        const ids = rankUps[skillId] ?? [];

        return Array.from(new Set(ids));
    }

    private updatePortrait(assetType: AssetType, assetId: number) {
        this.setState({assetType, assetId});
    }

    private getOverwriteName() {
        const overWriteServantName = this.state.servant?.ascensionAdd.overWriteServantName;
        if (this.state.assetId && overWriteServantName) {
            const limit = this.state.assetId === 1 ? 0 : this.state.assetId;
            if (limit in overWriteServantName.ascension) {
                return overWriteServantName.ascension[limit];
            } else if (limit in overWriteServantName.costume) {
                return overWriteServantName.costume[limit];
            }
        }
        return this.state.servant?.name;
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading || !this.state.servant)
            return <Loading/>;

        const servant = this.state.servant;
        document.title = `[${this.props.region}] Servant - ${servant.name} - Atlas Academy DB`;

        let remappedCostumeMaterials: Entity.EntityLevelUpMaterialProgression = {};
        if (servant.profile) {
            for (const [costumeId, costume] of Object.entries(servant.costumeMaterials)) {
                remappedCostumeMaterials[servant.profile?.costume[costumeId].name] = costume;
            }
        }

        const rawUrl = `${Host}/raw/${this.props.region}/servant/${servant.id}?expand=true&lore=true`;
        return (
            <div id={'servant'}>
                <ServantPicker region={this.props.region}
                               servants={this.state.servants}
                               id={this.state.servant.collectionNo}/>
                <hr style={{ marginBottom: "1rem" }}/>

                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 3 }}>
                    <h1 style={{ marginBottom: "1rem" }}>
                        <ClassIcon className={servant.className} rarity={servant.rarity} height={50}/>
                        &nbsp;
                        {this.getOverwriteName()}
                    </h1>
                    <span style={{ flexGrow: 1 }} />
                </div>
                <Row style={{
                    marginBottom: '3%'
                }}>
                    <Col xs={{span: 12, order: 2}} lg={{span: 6, order: 1}}>
                        <ServantMainData region={this.props.region}
                                         servant={this.state.servant}
                                         assetType={this.state.assetType}
                                         assetId={this.state.assetId}/>
                        <Row>
                            <Col><RawDataViewer text="Nice" data={servant}/></Col>
                            <Col><RawDataViewer text="Raw" data={rawUrl}/></Col>
                        </Row>
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

                <Tabs id={'servant-tabs'} defaultActiveKey={this.props.tab ?? 'skill-1'} mountOnEnter={true}
                      onSelect={(key: string | null) => {
                          this.props.history.replace(`/${this.props.region}/servant/${this.props.id}/${key}`);
                      }}>
                    {[1, 2, 3].map(i => (
                        <Tab key={`skill-${i}`} eventKey={`skill-${i}`} title={`Skill ${i}`}>
                            <br/>
                            {servant.skills
                                .filter(skill => skill.num === i)
                                .sort((a, b) => b.id - a.id)
                                .map((skill, i2) => {
                                    return (
                                        <div key={i2}>
                                            <SkillBreakdown region={this.props.region}
                                                            key={skill.id}
                                                            skill={skill}
                                                            cooldowns={true}
                                                            levels={10}/>
                                            {this.skillRankUps(skill.id).map((rankUpSkill, rankUp) => {
                                                return <SkillReferenceBreakdown key={rankUpSkill}
                                                                                region={this.props.region}
                                                                                id={rankUpSkill}
                                                                                cooldowns={true}
                                                                                levels={10}
                                                                                rankUp={rankUp + 1}/>;
                                            })}
                                        </div>
                                    );
                                })}
                        </Tab>
                    ))}
                    <Tab eventKey={'noble-phantasms'} title={'NPs'}>
                        <br/>
                        {this.state.servant.noblePhantasms
                            .filter(noblePhantasm => noblePhantasm.functions.length > 0)
                            // Card change NPs have 0 priority.
                            // Card change NPs are sorted by ascending ID number so the main NP is on top.
                            .sort((a, b) => (b.strengthStatus - a.strengthStatus) || ((a.priority === 0 || b.priority === 0) ? a.id - b.id : b.id - a.id))
                            .map((noblePhantasm) => {
                                return <NoblePhantasmBreakdown key={noblePhantasm.id}
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
                            {servant.classPassive.map((skill) => {
                                return (
                                    <Col xs={12}
                                         lg={(servant.classPassive.length ?? 1) > 1 ? 6 : 12}
                                         key={skill.id}>
                                        <SkillBreakdown region={this.props.region} skill={skill} cooldowns={false}/>
                                    </Col>
                                );
                            })}
                        </Row>
                        {servant.extraPassive.length > 0 ? <h3 style={{ margin: "1em 0 "}}>Event Bonus</h3> : null}
                        <Row>
                            {servant.extraPassive.map((skill) => {
                                return (
                                    <Col xs={12}
                                         lg={(servant.extraPassive.length ?? 1) > 1 ? 6 : 12}
                                         key={skill.id}>
                                        <SkillBreakdown region={this.props.region} skill={skill} cooldowns={false}/>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Tab>
                    <Tab eventKey={'traits'} title={'Traits'}>
                        <br/>
                        <ServantTraits region={this.props.region} servant={this.state.servant}/>
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
                        {
                            Object.keys(servant.costumeMaterials).length
                            ? <ServantMaterialBreakdown region={this.props.region}
                                                        materials={remappedCostumeMaterials}
                                                        title={'Costume Materials'}
                                                        idMinWidth='10em'/>
                            : null
                        }
                    </Tab>
                    <Tab eventKey={'stat-growth'} title={'Growth'}>
                        <br/>
                        <ServantStatGrowth region={this.props.region} servant={servant}/>
                    </Tab>
                    <Tab eventKey={'lore'} title={'Profile'}>
                        <br/>
                        <Alert variant="success" style={{ lineHeight: "2em" }}>
                            <IllustratorDescriptor
                                region={this.props.region}
                                illustrator={this.state.servant.profile?.illustrator}/>
                            <br/>
                            <VoiceActorDescriptor region={this.props.region} cv={this.state.servant.profile?.cv}/>
                        </Alert>
                        <ServantBondGrowth bondGrowth={servant.bondGrowth} />
                        <ServantProfileStats region={this.props.region} profile={servant.profile}/>
                        <ServantRelatedQuests region={this.props.region} questIds={servant.relateQuestIds}/>
                        <ServantCostumeDetails costumes={servant.profile?.costume}/>
                        <ServantProfileComments region={this.props.region} comments={servant.profile?.comments ?? []}/>
                    </Tab>
                    <Tab eventKey={'assets'} title={'Assets'}>
                        <br/>
                        <ServantAssets region={this.props.region} servant={servant}/>
                    </Tab>
                    <Tab eventKey={'voices'} title={'Voices'}>
                        <br/>
                        <ServantVoiceLines
                            region={this.props.region}
                            servants={new Map(this.state.servants.map((servant) => [servant.id, servant]))}
                            servant={servant}
                        />
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(ServantPage);
