import { AxiosError } from "axios";
import React from "react";
import { Col, Row, Tab, Table, Tabs } from "react-bootstrap";
import { WithTranslation, withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { EnumList, Event, Item, Mission, Quest, Region, Servant, War } from "@atlasacademy/api-connector";

import Api from "../Api";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import MissionConditionDescriptor from "../Descriptor/MissionConditionDescriptor";
import WarDescriptor from "../Descriptor/WarDescriptor";
import { flatten } from "../Helper/PolyFill";
import { FGOText } from "../Helper/StringHelper";
import { getEventStatus } from "../Helper/TimeHelper";
import Manager, { lang } from "../Setting/Manager";
import EventBulletinBoard from "./Event/EventBulletinBoard";
import EventCommandAssist from "./Event/EventCommandAssist";
import EventFortification from "./Event/EventFortification";
import EventHeelPortrait from "./Event/EventHeelPortrait";
import EventLottery from "./Event/EventLottery";
import EventRecipe from "./Event/EventRecipe";
import EventReward from "./Event/EventReward";
import EventRewardTower from "./Event/EventRewardTower";
import EventTreasureBoxes from "./Event/EventTreasureBoxes";
import EventVoices from "./Event/EventVoices";
import ShopTab from "./Event/Shop";

import "./Event/EventTable.css";

interface TabInfo {
    type:
        | "ladder"
        | "shop"
        | "mission"
        | "randomMission"
        | "tower"
        | "lottery"
        | "treasureBox"
        | "recipes"
        | "fortification"
        | "commandAssist"
        | "heel";
    id: number;
    title: string | React.ReactNode;
    tabKey: string;
}

interface IProps extends RouteComponentProps, WithTranslation {
    region: Region;
    eventId: number;
    tab?: string;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    event?: Event.Event;
    wars: War.War[];
    servantCache: Map<number, Servant.ServantBasic>;
    itemCache: Map<number, Item.Item>;
    questCache: Map<number, Quest.Quest>;
    enums?: EnumList;
    missionRefs: Map<number, React.Ref<any>>;

    // shop slot => (item ID, set count)
    shopFilters: Map<number, Map<number, number>>;
}

class EventPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            wars: [] as War.War[],
            servantCache: new Map(),
            itemCache: new Map(),
            questCache: new Map(),
            missionRefs: new Map(),
            shopFilters: new Map(),
        };
    }

    async componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadEvent();
    }

    loadEnums() {
        Api.enumList().then((enums) => this.setState({ enums }));
    }

    loadServantMap() {
        Api.servantList().then((servantList) => {
            this.setState({
                servantCache: new Map(servantList.map((servant) => [servant.id, servant])),
            });
        });
    }

    loadItemMap() {
        Api.itemList().then((itemList) => {
            this.setState({
                itemCache: new Map(itemList.map((item) => [item.id, item])),
            });
        });
    }

    loadWars(warIds: number[], setQuestCache = false) {
        Promise.all(warIds.map((warId) => Api.war(warId))).then((wars) => {
            this.setState({ wars });
            if (setQuestCache) {
                const questCache = new Map<number, Quest.Quest>();
                for (const war of wars) {
                    for (const spot of war.spots) {
                        for (const quest of spot.quests) {
                            questCache.set(quest.id, quest);
                        }
                    }
                }
                this.setState({ questCache });
            }
        });
    }

    loadEvent() {
        Api.event(this.props.eventId)
            .then((event) => {
                document.title = `[${this.props.region}] Event - ${event.name} - Atlas Academy DB`;
                this.setState({
                    event: event,
                    loading: false,
                    missionRefs: new Map(event.missions.map((mission) => [mission.id, React.createRef()])),
                });
                if (
                    event.towers.length > 0 ||
                    event.rewards.length > 0 ||
                    event.shop.length > 0 ||
                    event.missions.length > 0 ||
                    event.lotteries.length > 0 ||
                    event.treasureBoxes.length > 0 ||
                    event.recipes.length > 0
                ) {
                    this.loadItemMap();
                }
                this.loadWars(event.warIds, event.missions.length > 0 || event.shop.length > 0);
                if (event.missions.length > 0 || event.voices.length > 0 || event.fortifications.length > 0) {
                    this.loadServantMap();
                }
                if (event.missions.length > 0) {
                    this.loadEnums();
                }
            })
            .catch((error) => this.setState({ error }));
    }

    renderMissionConds(
        region: Region,
        mission: Mission.Mission,
        missionMap: Map<number, Mission.Mission>,
        servantCache: Map<number, Servant.ServantBasic>,
        itemCache: Map<number, Item.Item>,
        questCache: Map<number, Quest.Quest>,
        warIds?: number[],
        enums?: EnumList
    ) {
        const scrollToMissions = (id: number) => {
            let elementRef = this.state.missionRefs.get(id) as React.RefObject<HTMLDivElement>;
            elementRef?.current?.scrollIntoView({ behavior: "smooth" });
        };

        const renderedConds = [
            Mission.ProgressType.OPEN_CONDITION,
            Mission.ProgressType.START,
            Mission.ProgressType.CLEAR,
        ].map((progressType) =>
            mission.conds
                .filter((cond) => cond.missionProgressType === progressType)
                .map((cond) => (
                    <MissionConditionDescriptor
                        key={cond.id}
                        region={region}
                        cond={cond}
                        quests={questCache}
                        servants={servantCache}
                        missions={missionMap}
                        items={itemCache}
                        enums={enums}
                        warIds={warIds}
                        handleNavigateMissionId={scrollToMissions}
                    />
                ))
        );

        return <>{flatten(renderedConds)}</>;
    }

    renderMissionRow(
        region: Region,
        mission: Mission.Mission,
        missionMap: Map<number, Mission.Mission>,
        servantCache: Map<number, Servant.ServantBasic>,
        itemCache: Map<number, Item.Item>,
        questCache: Map<number, Quest.Quest>,
        warIds?: number[],
        enums?: EnumList
    ) {
        return (
            <>
                <th scope="row" className="text-center" ref={this.state.missionRefs.get(mission.id)}>
                    {mission.type === Mission.MissionType.RANDOM ? mission.id : mission.dispNo}
                </th>
                <td>
                    <b className="text-prewrap" lang={lang(region)}>
                        {mission.name}
                    </b>
                    <br />
                    {this.renderMissionConds(
                        region,
                        mission,
                        missionMap,
                        servantCache,
                        itemCache,
                        questCache,
                        warIds,
                        enums
                    )}
                </td>
                <td>
                    {mission.gifts.map((gift) => (
                        <div key={`${gift.objectId}-${gift.priority}`}>
                            <GiftDescriptor region={region} gift={gift} servants={servantCache} items={itemCache} />
                            <br />
                        </div>
                    ))}
                </td>
            </>
        );
    }

    renderMissionTab(
        region: Region,
        missions: Mission.Mission[],
        servantCache: Map<number, Servant.ServantBasic>,
        itemCache: Map<number, Item.Item>,
        questCache: Map<number, Quest.Quest>,
        warIds?: number[],
        enums?: EnumList
    ) {
        const t = this.props.t;
        const missionMap = new Map(missions.map((mission) => [mission.id, mission]));
        return (
            <Table hover responsive className="event-table">
                <thead>
                    <tr>
                        <th className="text-center">#</th>
                        <th>{t("Detail")}</th>
                        <th>{t("Reward")}</th>
                    </tr>
                </thead>
                <tbody>
                    {missions
                        .sort((a, b) => a.dispNo - b.dispNo)
                        .map((mission) => {
                            return (
                                <tr key={mission.id}>
                                    {this.renderMissionRow(
                                        region,
                                        mission,
                                        missionMap,
                                        servantCache,
                                        itemCache,
                                        questCache,
                                        warIds,
                                        enums
                                    )}
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        );
    }

    renderTab(
        region: Region,
        event: Event.Event,
        tab: TabInfo,
        servantCache: Map<number, Servant.ServantBasic>,
        itemCache: Map<number, Item.Item>,
        questCache: Map<number, Quest.Quest>,
        enums?: EnumList
    ) {
        switch (tab.type) {
            case "tower":
                const tower = event.towers.find((tower) => tower.towerId === tab.id);
                if (tower !== undefined) {
                    return <EventRewardTower region={region} tower={tower} itemMap={itemCache} />;
                } else {
                    return null;
                }
            case "ladder":
                return (
                    <EventReward
                        region={region}
                        rewards={event.rewards.filter((reward) => reward.groupId === tab.id)}
                        allPointBuffs={event.pointBuffs}
                        itemMap={itemCache}
                    />
                );
            case "shop":
                let { shopFilters } = this.state;
                return (
                    <ShopTab
                        region={region}
                        shops={event.shop.filter((shop) => shop.slot === tab.id)}
                        itemCache={itemCache}
                        filters={shopFilters.get(tab.id) ?? new Map()}
                        onChange={(records) => {
                            shopFilters.set(tab.id, records);
                            this.setState({ shopFilters });
                        }}
                        questCache={questCache}
                    />
                );
            case "mission":
                return this.renderMissionTab(
                    region,
                    event.missions.filter((mission) => mission.type !== Mission.MissionType.RANDOM),
                    servantCache,
                    itemCache,
                    questCache,
                    event.warIds,
                    enums
                );
            case "randomMission":
                return this.renderMissionTab(
                    region,
                    event.missions.filter((mission) => mission.type === Mission.MissionType.RANDOM),
                    servantCache,
                    itemCache,
                    questCache,
                    event.warIds,
                    enums
                );
            case "lottery":
                const lottery = event.lotteries.find((lottery) => lottery.id === tab.id)!;
                return <EventLottery region={region} lottery={lottery} itemMap={itemCache} />;
            case "treasureBox":
                const treasureBoxes = event.treasureBoxes.filter((tb) => tb.slot === tab.id);
                return <EventTreasureBoxes region={region} treasureBoxes={treasureBoxes} itemCache={itemCache} />;
            case "recipes":
                return (
                    <EventRecipe region={this.props.region} recipes={event.recipes} itemMap={this.state.itemCache} />
                );
            case "fortification":
                return (
                    <EventFortification
                        region={this.props.region}
                        fortifications={event.fortifications}
                        itemMap={this.state.itemCache}
                        servantMap={this.state.servantCache}
                    />
                );
            case "commandAssist":
                return (
                    <EventCommandAssist
                        region={this.props.region}
                        commandAssists={event.commandAssists}
                        missions={new Map(event.missions.map((mission) => [mission.id, mission]))}
                        missionGroups={event.missionGroups}
                    />
                );
            case "heel":
                return <EventHeelPortrait region={this.props.region} heelPortraits={event.heelPortraits} />;
        }
    }

    render() {
        const t = this.props.t;
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.event) return <Loading />;

        const event = this.state.event;

        let tabs: TabInfo[] = [];

        if (event.fortifications.length > 0) {
            tabs.push({ type: "fortification", id: 0, title: t("Fortifications"), tabKey: "fortifications" });
        }

        if (event.recipes.length > 0) {
            tabs.push({ type: "recipes", id: 0, title: t("Recipes"), tabKey: "recipes" });
        }

        if (event.missions.length > 0) {
            if (event.missions.some((mission) => mission.type === Mission.MissionType.RANDOM)) {
                tabs.push({
                    type: "randomMission",
                    id: 0,
                    title: t("Random Missions"),
                    tabKey: "random-missions",
                });
            }
            tabs.push({
                type: "mission",
                id: 0,
                title: t("Missions"),
                tabKey: "missions",
            });
        }

        if (event.commandAssists.length > 0) {
            tabs.push({ type: "commandAssist", id: 0, title: t("Command Assists"), tabKey: "command-assists" });
        }

        const lotteries = new Set(event.lotteries.map((lottery) => lottery.id));

        tabs = tabs.concat(
            event.lotteries
                .sort((a, b) => a.id - b.id)
                .map((lottery) => {
                    return {
                        type: "lottery",
                        id: lottery.id,
                        title: lotteries.size === 1 ? t("EventLottery") : `${t("EventLottery")} ${lottery.id}`,
                        tabKey: `lottery-${lottery.id}`,
                    };
                })
        );

        const towers = new Set(event.towers.map((tower) => tower.towerId));

        tabs = tabs.concat(
            event.towers
                .sort((a, b) => a.towerId - b.towerId)
                .map((tower) => {
                    return {
                        type: "tower",
                        id: tower.towerId,
                        title: towers.size === 1 ? t("Tower") : tower.name,
                        tabKey: `tower-${tower.towerId}`,
                    };
                })
        );

        const pointGroupMap = new Map(event.pointGroups.map((pointGroup) => [pointGroup.groupId, pointGroup]));

        tabs = tabs.concat(
            Array.from(new Set(event.rewards.map((reward) => reward.groupId)))
                .sort((a, b) => a - b)
                .map((groupId) => {
                    let title: string | React.ReactNode = `${t("EventLadder")} ${groupId}`;
                    const pointGroupInfo = pointGroupMap.get(groupId);
                    if (groupId === 0) {
                        title = t("EventLadder");
                    } else if (pointGroupInfo !== undefined) {
                        title = (
                            <>
                                <img
                                    style={{ height: "1.75em" }}
                                    src={pointGroupInfo.icon}
                                    alt={`${pointGroupInfo.name} Icon`}
                                />
                                <span lang={lang(this.props.region)}>{pointGroupInfo.name}</span>
                            </>
                        );
                    }
                    return {
                        type: "ladder",
                        id: groupId,
                        title: title,
                        tabKey: `ladder-${groupId}`,
                    };
                })
        );

        const treasureBoxSlots = Array.from(new Set(event.treasureBoxes.map((tb) => tb.slot)));

        tabs = tabs.concat(
            treasureBoxSlots
                .sort((a, b) => a - b)
                .map((slot) => {
                    return {
                        type: "treasureBox",
                        id: slot,
                        title:
                            treasureBoxSlots.length === 1 ? t("EventTreasureBox") : `${t("EventTreasureBox")} ${slot}`,
                        tabKey: `treasure-box-${slot}`,
                    };
                })
        );

        const shopSlots = Array.from(new Set(event.shop.map((shop) => shop.slot)));

        tabs = tabs.concat(
            shopSlots
                .sort((a, b) => a - b)
                .map((shopSlot) => {
                    return {
                        type: "shop",
                        id: shopSlot,
                        title: shopSlots.length === 1 ? t("EventShop") : `${t("EventShop")} ${shopSlot}`,
                        tabKey: `shop-${shopSlot}`,
                    };
                })
        );

        if (event.heelPortraits.length > 0) {
            tabs.push({ type: "heel", id: 0, title: t("Heel Portraits"), tabKey: "heel-portraits" });
        }

        const wars =
            this.state.wars.length === 1 ? (
                <WarDescriptor region={this.props.region} war={this.state.wars[0]} />
            ) : (
                <ul className="mb-0">
                    {this.state.wars.map((war) => (
                        <li key={war.id}>
                            <WarDescriptor region={this.props.region} war={war} />
                        </li>
                    ))}
                </ul>
            );

        return (
            <div>
                <h1 lang={lang(this.props.region)}>
                    <FGOText text={event.name} />
                </h1>

                <br />
                <div className="mb-5">
                    <DataTable
                        data={[
                            { label: t("ID"), value: event.id },
                            {
                                label: t("Name"),
                                value: (
                                    <span lang={lang(this.props.region)}>
                                        <FGOText text={event.name} />
                                    </span>
                                ),
                            },
                            {
                                label: t("Original Name"),
                                value: <span lang={lang(this.props.region)}>{event.originalName}</span>,
                                hidden: event.name === event.originalName,
                            },
                            { label: t("Wars"), value: wars },
                            { label: t("Status"), value: getEventStatus(event.startedAt, event.endedAt) },
                            { label: t("Start"), value: new Date(event.startedAt * 1000).toLocaleString() },
                            { label: t("End"), value: new Date(event.endedAt * 1000).toLocaleString() },
                            {
                                label: "Raw",
                                value: (
                                    <Row>
                                        <Col>
                                            <RawDataViewer
                                                text="Nice"
                                                data={event}
                                                url={Api.getUrl("nice", "event", this.props.eventId)}
                                            />
                                        </Col>
                                        <Col>
                                            <RawDataViewer
                                                text="Raw"
                                                data={Api.getUrl("raw", "event", this.props.eventId)}
                                            />
                                        </Col>
                                    </Row>
                                ),
                            },
                        ]}
                    />
                </div>

                <Tabs
                    id={"event-reward-tabs"}
                    defaultActiveKey={this.props.tab ?? (tabs.length > 0 ? tabs[0].tabKey : undefined)}
                    mountOnEnter={true}
                    onSelect={(key: string | null) => {
                        this.props.history.replace(`/${this.props.region}/event/${this.props.eventId}/${key}`);
                    }}
                >
                    {tabs.map((tab) => {
                        return (
                            <Tab
                                key={tab.tabKey}
                                eventKey={tab.tabKey}
                                title={<span lang={lang(this.props.region)}>{tab.title}</span>}
                            >
                                {this.renderTab(
                                    this.props.region,
                                    event,
                                    tab,
                                    this.state.servantCache,
                                    this.state.itemCache,
                                    this.state.questCache,
                                    this.state.enums
                                )}
                            </Tab>
                        );
                    })}
                    {event.bulletinBoards.length > 0 ? (
                        <Tab eventKey="bulletin-boards" title={t("EventBulletinBoards")}>
                            <EventBulletinBoard
                                region={this.props.region}
                                bulletinBoards={event.bulletinBoards}
                                questCache={this.state.questCache}
                            />
                        </Tab>
                    ) : null}
                    {event.voices.length > 0 && (
                        <Tab eventKey="voices" title={t("Voices")}>
                            <EventVoices
                                region={this.props.region}
                                voiceGroups={event.voices}
                                servants={this.state.servantCache}
                                eventRewardScenes={this.state.event.rewardScenes}
                            />
                        </Tab>
                    )}
                </Tabs>
            </div>
        );
    }
}

export default withRouter(withTranslation()(EventPage));
