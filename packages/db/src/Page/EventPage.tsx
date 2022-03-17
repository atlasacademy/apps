import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import React from "react";
import { Col, Row, Tab, Table, Tabs } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";

import { Event, Item, Region, Mission, Quest, Servant, EnumList, War, Gift } from "@atlasacademy/api-connector";

import Api, { Host } from "../Api";
import renderCollapsibleContent from "../Component/CollapsibleContent";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import ItemIcon from "../Component/ItemIcon";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import MissionConditionDescriptor from "../Descriptor/MissionConditionDescriptor";
import PointBuffDescriptor from "../Descriptor/PointBuffDescriptor";
import WarDescriptor from "../Descriptor/WarDescriptor";
import { mergeElements } from "../Helper/OutputHelper";
import { colorString, interpolateString, replacePUACodePoints } from "../Helper/StringHelper";
import { getEventStatus } from "../Helper/TimeHelper";
import Manager from "../Setting/Manager";
import ShopTab from "./Event/Shop";
import TreasureBoxes from "./Event/TreasureBoxes";

import "../Helper/StringHelper.css";
import "./EventPage.css";

interface TabInfo {
    type: "ladder" | "shop" | "mission" | "tower" | "lottery" | "treasureBox";
    id: number;
    title: string | React.ReactNode;
    tabKey: string;
}

interface IProps extends RouteComponentProps {
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
                    event.treasureBoxes.length > 0
                ) {
                    this.loadItemMap();
                }
                this.loadWars(event.warIds, event.missions.length > 0 || event.shop.length > 0);
                if (event.missions.length > 0) {
                    this.loadServantMap();
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
        return [Mission.ProgressType.OPEN_CONDITION, Mission.ProgressType.START, Mission.ProgressType.CLEAR].map(
            (progressType) => {
                const conds = mission.conds.filter((cond) => cond.missionProgressType === progressType);
                if (conds.length > 0) {
                    return (
                        <MissionConditionDescriptor
                            key={conds[0].id}
                            region={region}
                            cond={conds[0]}
                            quests={questCache}
                            servants={servantCache}
                            missions={missionMap}
                            items={itemCache}
                            enums={enums}
                            warIds={warIds}
                            handleNavigateMissionId={scrollToMissions}
                        />
                    );
                } else {
                    return null;
                }
            }
        );
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
                <th scope="row" style={{ textAlign: "center" }} ref={this.state.missionRefs.get(mission.id)}>
                    {mission.dispNo}
                </th>
                <td>
                    <b className="newline">{mission.name}</b>
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
        const missionMap = new Map(missions.map((mission) => [mission.id, mission]));
        return (
            <Table hover responsive>
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>#</th>
                        <th>Detail</th>
                        <th>Reward</th>
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

    renderRewardTab(
        region: Region,
        rewards: Event.EventReward[],
        allPointBuffs: Event.EventPointBuff[],
        itemMap: Map<number, Item.Item>
    ) {
        const pointBuffMap = new Map(allPointBuffs.map((pointBuff) => [pointBuff.id, pointBuff]));
        const pointBuffPointMap = new Map(allPointBuffs.map((pointBuff) => [pointBuff.eventPoint, pointBuff]));
        return (
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>Point</th>
                        <th>Reward</th>
                    </tr>
                </thead>
                <tbody>
                    {rewards.map((reward) => {
                        const pointBuff = pointBuffPointMap.get(reward.point);
                        let pointBuffDescription = null;
                        if (pointBuff !== undefined) {
                            const pointBuffGifts = reward.gifts
                                .filter((gift) => gift.type === Gift.GiftType.EVENT_POINT_BUFF)
                                .map((gift) => gift.objectId);
                            // In Oniland, point buffs are listed as rewards but in MIXA event, they aren't.
                            // If point buffs are rewards, Gift Descriptor can handle them.
                            // Otherwise, pointBuffDescription is used.
                            if (!pointBuffGifts.includes(pointBuff.id)) {
                                pointBuffDescription = (
                                    <>
                                        <br />
                                        <PointBuffDescriptor region={region} pointBuff={pointBuff} />
                                    </>
                                );
                            }
                        }
                        return (
                            <tr key={reward.point}>
                                <th scope="row">{reward.point.toLocaleString()}</th>
                                <td>
                                    {mergeElements(
                                        reward.gifts.map((gift) => (
                                            <GiftDescriptor
                                                key={`${gift.objectId}-${gift.priority}`}
                                                region={region}
                                                gift={gift}
                                                items={itemMap}
                                                pointBuffs={pointBuffMap}
                                            />
                                        )),
                                        ", "
                                    )}
                                    {pointBuffDescription}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }

    renderRewardTower(region: Region, tower: Event.EventTower, itemMap: Map<number, Item.Item>) {
        return (
            <Table hover responsive>
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>Floor</th>
                        <th>Message</th>
                        <th>Reward</th>
                    </tr>
                </thead>
                <tbody>
                    {tower.rewards.map((reward) => {
                        return (
                            <tr key={reward.floor}>
                                <th scope="row" style={{ textAlign: "center" }}>
                                    {reward.floor}
                                </th>
                                <td>{colorString(interpolateString(reward.boardMessage, [reward.floor]))}</td>
                                <td>
                                    {mergeElements(
                                        reward.gifts.map((gift) => (
                                            <GiftDescriptor
                                                key={`${gift.objectId}-${gift.priority}`}
                                                region={region}
                                                gift={gift}
                                                items={itemMap}
                                            />
                                        )),
                                        ", "
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }

    renderLotteryBox(region: Region, boxes: Event.EventLotteryBox[], itemMap: Map<number, Item.Item>) {
        return (
            <Table hover responsive>
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>#</th>
                        <th>Detail</th>
                        <th>Reward</th>
                        <th style={{ textAlign: "center" }}>Limit</th>
                    </tr>
                </thead>
                <tbody>
                    {boxes.map((box) => {
                        return (
                            <tr key={box.no}>
                                <th scope="row" style={{ textAlign: "center" }}>
                                    {box.no}
                                    {box.isRare ? (
                                        <>
                                            {" "}
                                            <FontAwesomeIcon icon={faStar} />
                                        </>
                                    ) : null}
                                </th>
                                <td>{box.detail}</td>
                                <td>
                                    {mergeElements(
                                        box.gifts.map((gift) => (
                                            <GiftDescriptor
                                                key={`${gift.objectId}-${gift.priority}`}
                                                region={region}
                                                gift={gift}
                                                items={itemMap}
                                            />
                                        )),
                                        ", "
                                    )}
                                </td>
                                <td style={{ textAlign: "center" }}>{box.maxNum}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }

    renderLotteryTab(region: Region, lottery: Event.EventLottery, itemMap: Map<number, Item.Item>) {
        const boxIndexes = Array.from(new Set(lottery.boxes.map((box) => box.boxIndex))).sort((a, b) => a - b);

        return (
            <>
                <div style={{ margin: "1em 0" }}>
                    <b>Cost of 1 roll:</b>{" "}
                    <Link to={`/${region}/item/${lottery.cost.item.id}`}>
                        <ItemIcon region={region} item={lottery.cost.item} height={40} /> {lottery.cost.item.name}
                    </Link>{" "}
                    x{lottery.cost.amount}
                </div>
                {boxIndexes.map((boxIndex) => {
                    const boxes = lottery.boxes.filter((box) => box.boxIndex === boxIndex).sort((a, b) => a.no - b.no);

                    const title = `Box ${boxIndex + 1}${
                        boxIndex === Math.max(...boxIndexes) && !lottery.limited ? "+" : ""
                    }`;

                    const boxTable = this.renderLotteryBox(region, boxes, itemMap);

                    return renderCollapsibleContent({
                        title: title,
                        content: boxTable,
                        subheader: true,
                        initialOpen: false,
                    });
                })}
            </>
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
                    return this.renderRewardTower(region, tower, itemCache);
                } else {
                    return null;
                }
            case "ladder":
                return this.renderRewardTab(
                    region,
                    event.rewards.filter((reward) => reward.groupId === tab.id),
                    event.pointBuffs,
                    itemCache
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
                    event.missions,
                    servantCache,
                    itemCache,
                    questCache,
                    event.warIds,
                    enums
                );
            case "lottery":
                const lottery = event.lotteries.filter((lottery) => lottery.id === tab.id)[0];
                return this.renderLotteryTab(region, lottery, itemCache);
            case "treasureBox":
                const treasureBoxes = event.treasureBoxes.filter((tb) => tb.slot === tab.id);
                return <TreasureBoxes region={region} treasureBoxes={treasureBoxes} itemCache={itemCache} />;
        }
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.event) return <Loading />;

        const event = this.state.event;

        let tabs: TabInfo[] = [];

        if (event.missions.length > 0) {
            tabs.push({
                type: "mission",
                id: 0,
                title: "Missions",
                tabKey: "missions",
            });
        }

        const lotteries = new Set(event.lotteries.map((lottery) => lottery.id));

        tabs = tabs.concat(
            event.lotteries
                .sort((a, b) => a.id - b.id)
                .map((lottery) => {
                    return {
                        type: "lottery",
                        id: lottery.id,
                        title: lotteries.size === 1 ? "Lottery" : `Lottery ${lottery.id}`,
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
                        title: towers.size === 1 ? "Tower" : tower.name,
                        tabKey: `tower-${tower.towerId}`,
                    };
                })
        );

        const pointGroupMap = new Map(event.pointGroups.map((pointGroup) => [pointGroup.groupId, pointGroup]));

        tabs = tabs.concat(
            Array.from(new Set(event.rewards.map((reward) => reward.groupId)))
                .sort((a, b) => a - b)
                .map((groupId) => {
                    let title: string | React.ReactNode = `Ladder ${groupId}`;
                    const pointGroupInfo = pointGroupMap.get(groupId);
                    if (groupId === 0) {
                        title = "Ladder";
                    } else if (pointGroupInfo !== undefined) {
                        title = (
                            <>
                                <img
                                    style={{ height: "1.75em" }}
                                    src={pointGroupInfo.icon}
                                    alt={`${pointGroupInfo.name} Icon`}
                                />
                                {pointGroupInfo.name}
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
                        title: treasureBoxSlots.length === 1 ? "Treasure Box" : `Treasure Box ${slot}`,
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
                        title: shopSlots.length === 1 ? "Shop" : `Shop ${shopSlot}`,
                        tabKey: `shop-${shopSlot}`,
                    };
                })
        );

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
                <h1>{replacePUACodePoints(event.name)}</h1>

                <br />
                <div style={{ marginBottom: "3%" }}>
                    <DataTable
                        data={{
                            ID: event.id,
                            Name: replacePUACodePoints(event.name),
                            Wars: wars,
                            Status: getEventStatus(event.startedAt, event.endedAt),
                            Start: new Date(event.startedAt * 1000).toLocaleString(),
                            End: new Date(event.endedAt * 1000).toLocaleString(),
                            Raw: (
                                <Row>
                                    <Col>
                                        <RawDataViewer text="Nice" data={event} />
                                    </Col>
                                    <Col>
                                        <RawDataViewer
                                            text="Raw"
                                            data={`${Host}/raw/${this.props.region}/event/${event.id}`}
                                        />
                                    </Col>
                                </Row>
                            ),
                        }}
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
                            <Tab key={tab.tabKey} eventKey={tab.tabKey} title={tab.title}>
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
                </Tabs>
            </div>
        );
    }
}

export default withRouter(EventPage);
