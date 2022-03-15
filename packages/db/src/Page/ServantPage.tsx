import { AxiosError } from "axios";
import React from "react";
import { Alert, Col, Row, Tab, Tabs } from "react-bootstrap";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { Region, Entity, Servant } from "@atlasacademy/api-connector";

import Api, { Host } from "../Api";
import NoblePhantasmBreakdown from "../Breakdown/NoblePhantasmBreakdown";
import SkillBreakdown from "../Breakdown/SkillBreakdown";
import SkillReferenceBreakdown from "../Breakdown/SkillReferenceBreakdown";
import ClassIcon from "../Component/ClassIcon";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import IllustratorDescriptor from "../Descriptor/IllustratorDescriptor";
import VoiceActorDescriptor from "../Descriptor/VoiceActorDescriptor";
import Manager from "../Setting/Manager";
import ServantAssets from "./Servant/ServantAssets";
import ServantBondGrowth from "./Servant/ServantBondGrowth";
import ServantCostumeDetails from "./Servant/ServantCostumeDetails";
import ServantMainData from "./Servant/ServantMainData";
import ServantMaterialBreakdown from "./Servant/ServantMaterialBreakdown";
import ServantPassive from "./Servant/ServantPassive";
import ServantPicker from "./Servant/ServantPicker";
import ServantPortrait from "./Servant/ServantPortrait";
import ServantProfileComments from "./Servant/ServantProfileComments";
import ServantProfileStats from "./Servant/ServantProfileStats";
import ServantRelatedQuests from "./Servant/ServantRelatedQuests";
import ServantStatGrowth from "./Servant/ServantStatGrowth";
import ServantTraits from "./Servant/ServantTraits";
import ServantValentine from "./Servant/ServantValentine";
import ServantVoiceLines from "./Servant/ServantVoiceLines";

import "./ServantPage.css";

type AssetType = "ascension" | "costume";

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    tab?: string;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    servants: Servant.ServantBasic[];
    servant?: Servant.Servant;
    assetType?: AssetType;
    assetId?: number;
    assetExpand?: boolean;
}

class ServantPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            servants: [],
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadServant();
    }

    loadServant() {
        Promise.all([Api.servantList(), Api.servant(this.props.id)])
            .then(([servants, servant]) => {
                let assetType: AssetType | undefined, assetId, assetExpand;

                if (servant.extraAssets.charaGraph.ascension) {
                    assetType = "ascension";
                    assetId = Object.keys(servant.extraAssets.charaGraph.ascension).shift();
                    assetExpand = false;
                    if (assetId !== undefined) assetId = parseInt(assetId);
                }

                if (assetId === undefined && servant.extraAssets.charaGraph.costume) {
                    assetType = "costume";
                    assetId = Object.keys(servant.extraAssets.charaGraph.costume).shift();
                    assetExpand = false;
                    if (assetId !== undefined) assetId = parseInt(assetId);
                }

                if (assetId === undefined && servant.extraAssets.charaGraphEx.ascension) {
                    assetType = "ascension";
                    assetId = Object.keys(servant.extraAssets.charaGraphEx.ascension).shift();
                    assetExpand = true;
                    if (assetId !== undefined) assetId = parseInt(assetId);
                }

                if (assetId === undefined && servant.extraAssets.charaGraphEx.costume) {
                    assetType = "costume";
                    assetId = Object.keys(servant.extraAssets.charaGraphEx.costume).shift();
                    assetExpand = true;
                    if (assetId !== undefined) assetId = parseInt(assetId);
                }

                this.setState({
                    servants,
                    servant,
                    assetType,
                    assetId,
                    assetExpand,
                    loading: false,
                });
            })
            .catch((error) => this.setState({ error }));
    }

    private skillRankUps(skillId: number): number[] {
        const rankUps = this.state.servant?.script.SkillRankUp;
        if (!rankUps) return [];

        const ids = rankUps[skillId] ?? [];

        return Array.from(new Set(ids));
    }

    private updatePortrait(assetType?: AssetType, assetId?: number, assetExpand?: boolean) {
        this.setState({ assetType, assetId, assetExpand });
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
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.servant) return <Loading />;

        const servant = this.state.servant;
        document.title = `[${this.props.region}] Servant - ${this.getOverwriteName()} - Atlas Academy DB`;

        let remappedCostumeMaterials: Entity.EntityLevelUpMaterialProgression = {};
        if (servant.profile) {
            for (const [costumeId, costume] of Object.entries(servant.costumeMaterials)) {
                if (servant.profile?.costume[costumeId] !== undefined) {
                    remappedCostumeMaterials[servant.profile?.costume[costumeId].name] = costume;
                }
            }
        }

        const rawUrl = `${Host}/raw/${this.props.region}/servant/${servant.id}?expand=true&lore=true`;
        return (
            <div id={"servant"}>
                <ServantPicker region={this.props.region} servants={this.state.servants} id={servant.collectionNo} />
                <hr style={{ marginBottom: "1rem" }} />

                <div style={{ display: "flex", flexDirection: "row", marginBottom: 3 }}>
                    <h1 style={{ marginBottom: "1rem" }}>
                        <ClassIcon className={servant.className} rarity={servant.rarity} height={50} />
                        &nbsp;
                        {this.getOverwriteName()}
                    </h1>
                    <span style={{ flexGrow: 1 }} />
                </div>
                <Row
                    style={{
                        marginBottom: "3%",
                    }}
                >
                    <Col xs={{ span: 12, order: 2 }} lg={{ span: 6, order: 1 }}>
                        <ServantMainData
                            region={this.props.region}
                            servant={this.state.servant}
                            assetType={this.state.assetType}
                            assetId={this.state.assetId}
                        />
                        <Row>
                            <Col>
                                <RawDataViewer text="Nice" data={servant} />
                            </Col>
                            <Col>
                                <RawDataViewer text="Raw" data={rawUrl} />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={{ span: 12, order: 1 }} lg={{ span: 6, order: 2 }}>
                        <ServantPortrait
                            servant={this.state.servant}
                            assetType={this.state.assetType}
                            assetId={this.state.assetId}
                            assetExpand={this.state.assetExpand}
                            updatePortraitCallback={(assetType, assetId, assetExpand) => {
                                this.updatePortrait(assetType, assetId, assetExpand);
                            }}
                        />
                    </Col>
                </Row>

                <Tabs
                    id={"servant-tabs"}
                    defaultActiveKey={this.props.tab ?? "skill-1"}
                    mountOnEnter={true}
                    onSelect={(key: string | null) => {
                        this.props.history.replace(`/${this.props.region}/servant/${this.props.id}/${key}`);
                    }}
                >
                    {[1, 2, 3].map((i) => (
                        <Tab key={`skill-${i}`} eventKey={`skill-${i}`} title={`Skill ${i}`}>
                            {servant.skills
                                .filter((skill) => skill.num === i)
                                .sort((a, b) => b.id - a.id)
                                .map((skill, i2) => {
                                    return (
                                        <div key={i2}>
                                            <SkillBreakdown
                                                region={this.props.region}
                                                key={skill.id}
                                                skill={skill}
                                                cooldowns={true}
                                                levels={10}
                                            />
                                            {this.skillRankUps(skill.id).map((rankUpSkill, rankUp) => {
                                                return (
                                                    <SkillReferenceBreakdown
                                                        key={rankUpSkill}
                                                        region={this.props.region}
                                                        id={rankUpSkill}
                                                        cooldowns={true}
                                                        levels={10}
                                                        rankUp={rankUp + 1}
                                                    />
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                        </Tab>
                    ))}
                    <Tab eventKey={"noble-phantasms"} title={"NPs"}>
                        {servant.noblePhantasms
                            .filter((noblePhantasm) => noblePhantasm.functions.length > 0)
                            // Card change NPs have 0 priority.
                            // Card change NPs are sorted by ascending ID number so the main NP is on top.
                            .sort(
                                (a, b) =>
                                    b.strengthStatus - a.strengthStatus ||
                                    (a.priority === 0 || b.priority === 0 ? a.id - b.id : b.id - a.id)
                            )
                            .map((noblePhantasm) => {
                                return (
                                    <NoblePhantasmBreakdown
                                        key={noblePhantasm.id}
                                        region={this.props.region}
                                        servant={servant}
                                        noblePhantasm={noblePhantasm}
                                        assetType={this.state.assetType}
                                        assetId={this.state.assetId}
                                    />
                                );
                            })}
                    </Tab>
                    <Tab eventKey={"passives"} title={"Passives"}>
                        <ServantPassive region={this.props.region} servant={servant} />
                    </Tab>
                    <Tab eventKey={"traits"} title={"Traits"}>
                        <ServantTraits region={this.props.region} servant={this.state.servant} />
                    </Tab>
                    <Tab eventKey={"materials"} title={"Materials"}>
                        <Row>
                            <Col xs={12} lg={6}>
                                <ServantMaterialBreakdown
                                    region={this.props.region}
                                    materials={servant.ascensionMaterials}
                                    title={"Ascension Materials"}
                                    showNextLevelInDescription={true}
                                />
                            </Col>
                            <Col xs={12} lg={6}>
                                <ServantMaterialBreakdown
                                    region={this.props.region}
                                    materials={servant.skillMaterials}
                                    title={"Skill Materials"}
                                    showNextLevelInDescription={true}
                                />
                            </Col>
                        </Row>
                        {servant.appendPassive.length > 0 && servant.coin !== undefined ? (
                            <Row>
                                <Col xs={12} lg={6}>
                                    <ServantMaterialBreakdown
                                        region={this.props.region}
                                        materials={{
                                            "Summon Get": {
                                                items: [
                                                    {
                                                        item: servant.coin.item,
                                                        amount: servant.coin.summonNum,
                                                    },
                                                ],
                                                qp: 0,
                                            },
                                            "Append Skill Unlock Cost": {
                                                items: servant.appendPassive[0].unlockMaterials,
                                                qp: 0,
                                            },
                                        }}
                                        title="Servant Coin"
                                    />
                                </Col>
                                <Col xs={12} lg={6}>
                                    <ServantMaterialBreakdown
                                        region={this.props.region}
                                        materials={servant.appendSkillMaterials}
                                        title="Append Skill Level Up Materials"
                                        showNextLevelInDescription={true}
                                    />
                                </Col>
                            </Row>
                        ) : null}
                        {Object.keys(servant.costumeMaterials).length ? (
                            <ServantMaterialBreakdown
                                region={this.props.region}
                                materials={remappedCostumeMaterials}
                                title={"Costume Materials"}
                                idMinWidth="10em"
                            />
                        ) : null}
                    </Tab>
                    <Tab eventKey={"stat-growth"} title={"Growth"}>
                        <ServantStatGrowth region={this.props.region} servant={servant} />
                    </Tab>
                    <Tab eventKey={"lore"} title={"Profile"}>
                        <Alert variant="success" style={{ lineHeight: "2em" }}>
                            <IllustratorDescriptor
                                region={this.props.region}
                                illustrator={servant.profile?.illustrator}
                            />
                            <br />
                            <VoiceActorDescriptor region={this.props.region} cv={servant.profile?.cv} />
                        </Alert>
                        <ServantBondGrowth bondGrowth={servant.bondGrowth} />
                        <ServantProfileStats region={this.props.region} profile={servant.profile} />
                        <ServantRelatedQuests region={this.props.region} questIds={servant.relateQuestIds} />
                        <ServantValentine region={this.props.region} servant={servant} />
                        <ServantCostumeDetails costumes={servant.profile?.costume} />
                        <ServantProfileComments region={this.props.region} comments={servant.profile?.comments ?? []} />
                    </Tab>
                    <Tab eventKey={"assets"} title={"Assets"}>
                        <ServantAssets region={this.props.region} servant={servant} />
                    </Tab>
                    <Tab eventKey={"voices"} title={"Voices"}>
                        <ServantVoiceLines
                            region={this.props.region}
                            servants={new Map(this.state.servants.map((servant) => [servant.id, servant]))}
                            servant={servant}
                            servantName={this.getOverwriteName()}
                        />
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(ServantPage);
