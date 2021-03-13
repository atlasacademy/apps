import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import React from "react";
import { Col, Row, Tab, Table, Tabs } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";
import Api, { Host } from "../Api";
import renderCollapsibleContent from "../Component/CollapsibleContent";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import ItemIcon from "../Component/ItemIcon";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import MissionConditionDescriptor from "../Descriptor/MissionConditionDescriptor";
import ShopPurchaseDescriptor from "../Descriptor/ShopPurchaseDescriptor";
import WarDescriptor from "../Descriptor/WarDescriptor";
import { handleNewLine, mergeElements } from "../Helper/OutputHelper";
import { colorString, interpolateString } from "../Helper/StringHelper";
import Manager from "../Setting/Manager";
import "./EventPage.css";
import {
    Event,
    Item,
    Region,
    Shop,
    Mission,
    Quest,
    Servant,
    EnumList,
    War,
} from "@atlasacademy/api-connector";

interface TabInfo {
    type: "ladder" | "shop" | "mission" | "tower" | "lottery";
    id: number;
    title: string;
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
        };
    }

    async componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadServantMap();
        this.loadItemMap();
        this.loadEnums();
        this.loadEvent();
    }

    async loadEnums() {
        const enums = await Api.enumList();
        this.setState({
            enums: enums,
        });
    }

    async loadServantMap() {
        const servants = await Api.servantList();
        this.setState({
            servantCache: new Map(
                servants.map((servant) => [servant.id, servant])
            ),
        });
    }

    async loadItemMap() {
        const itemList = await Api.itemList();
        this.setState({
            itemCache: new Map(itemList.map((item) => [item.id, item])),
        });
    }

    async loadWars(warIds: number[], setQuestCache = false) {
        try {
            const wars = await Promise.all(
                warIds.map((warId) => Api.war(warId))
            );
            if (setQuestCache) {
                const quests: Quest.Quest[] = [];
                for (const war of wars) {
                    for (const spot of war.spots) {
                        for (const quest of spot.quests) {
                            quests.push(quest);
                        }
                    }
                }
                this.setState({
                    wars: wars,
                    questCache: new Map(
                        quests.map((quest) => [quest.id, quest])
                    ),
                });
            } else {
                this.setState({
                    wars: wars,
                });
            }
        } catch (e) {
            this.setState({
                error: e,
            });
        }
    }

    async loadEvent() {
        try {
            const event = await Api.event(this.props.eventId);
            this.setState({
                loading: false,
                event: event,
                missionRefs: new Map(
                    event.missions.map((mission) => [
                        mission.id,
                        React.createRef(),
                    ])
                ),
            });
            document.title = `[${this.props.region}] Event - ${event.name} - Atlas Academy DB`;
            await this.loadWars(event.warIds, event.missions.length > 0);
        } catch (e) {
            this.setState({
                error: e,
            });
        }
    }

    renderMissionConds(
        region: Region,
        mission: Mission.Mission,
        missionMap: Map<number, Mission.Mission>,
        servantCache: Map<number, Servant.ServantBasic>,
        itemCache: Map<number, Item.Item>,
        questCache: Map<number, Quest.Quest>,
        enums?: EnumList
    ) {
        const scrollToMissions = (id: number) => {
            let elementRef = this.state.missionRefs.get(id);
            (elementRef as React.RefObject<HTMLDivElement>)?.current?.scrollIntoView(
                { behavior: "smooth" }
            );
        };
        return [
            Mission.ProgressType.OPEN_CONDITION,
            Mission.ProgressType.START,
            Mission.ProgressType.CLEAR,
        ].map((progressType) => {
            const conds = mission.conds.filter(
                (cond) => cond.missionProgressType === progressType
            );
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
                        handleNavigateMissionId={scrollToMissions}
                    />
                );
            }
        });
    }

    renderMissionRow(
        region: Region,
        mission: Mission.Mission,
        itemMap: Map<number, Item.Item>,
        missionMap: Map<number, Mission.Mission>,
        servantCache: Map<number, Servant.ServantBasic>,
        itemCache: Map<number, Item.Item>,
        questCache: Map<number, Quest.Quest>,
        enums?: EnumList
    ) {
        return (
            <>
                <th
                    scope="row"
                    style={{ textAlign: "center" }}
                    ref={this.state.missionRefs.get(mission.id)}
                >
                    {mission.dispNo}
                </th>
                <td>
                    <b>{mission.name}</b>
                    <br />
                    {this.renderMissionConds(
                        region,
                        mission,
                        missionMap,
                        servantCache,
                        itemCache,
                        questCache,
                        enums
                    )}
                </td>
                <td>
                    {mission.gifts.map((gift) => (
                        <div key={`${gift.objectId}-${gift.priority}`}>
                            <GiftDescriptor
                                region={region}
                                gift={gift}
                                items={itemMap}
                            />
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
        itemMap: Map<number, Item.Item>,
        servantCache: Map<number, Servant.ServantBasic>,
        itemCache: Map<number, Item.Item>,
        questCache: Map<number, Quest.Quest>,
        enums?: EnumList
    ) {
        const missionMap = new Map(
            missions.map((mission) => [mission.id, mission])
        );
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
                                        itemMap,
                                        missionMap,
                                        servantCache,
                                        itemCache,
                                        questCache,
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
        const pointBuffMap = new Map(
            allPointBuffs.map((pointBuff) => [pointBuff.id, pointBuff])
        );
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
                        return (
                            <tr key={reward.point}>
                                <th scope="row">
                                    {reward.point.toLocaleString()}
                                </th>
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
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }

    renderRewardTower(
        region: Region,
        tower: Event.EventTower,
        itemMap: Map<number, Item.Item>
    ) {
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
                                <td>
                                    {colorString(
                                        interpolateString(reward.boardMessage, [
                                            reward.floor,
                                        ])
                                    )}
                                </td>
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

    renderShopTab(
        region: Region,
        shops: Shop.Shop[],
        itemMap: Map<number, Item.Item>
    ) {
        return (
            <Table hover responsive className="shopTable">
                <thead>
                    <tr>
                        <th style={{ textAlign: "left" }}>Detail</th>
                        <th>Currency</th>
                        <th>Cost</th>
                        <th>Item</th>
                        <th>Set</th>
                        <th>Limit</th>
                    </tr>
                </thead>
                <tbody>
                    {shops
                        .sort((a, b) => a.priority - b.priority)
                        .map((shop) => {
                            return (
                                <tr key={shop.id}>
                                    <td style={{ minWidth: "10em" }}>
                                        <b>{shop.name}</b>
                                        <div style={{ fontSize: "0.75rem" }}>
                                            {handleNewLine(
                                                colorString(shop.detail)
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <Link
                                            to={`/${region}/item/${shop.cost.item.id}`}
                                        >
                                            <ItemIcon
                                                region={region}
                                                item={shop.cost.item}
                                                height={40}
                                            />
                                        </Link>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        {shop.cost.amount.toLocaleString()}
                                    </td>
                                    <td>
                                        <ShopPurchaseDescriptor
                                            region={region}
                                            shop={shop}
                                            itemMap={itemMap}
                                        />
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        {shop.setNum.toLocaleString()}
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        {shop.limitNum === 0
                                            ? "Unlimited"
                                            : shop.limitNum.toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        );
    }

    renderLotteryBox(
        region: Region,
        boxes: Event.EventLotteryBox[],
        itemMap: Map<number, Item.Item>
    ) {
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
                                <td style={{ textAlign: "center" }}>
                                    {box.maxNum}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }

    renderLotteryTab(
        region: Region,
        lottery: Event.EventLottery,
        itemMap: Map<number, Item.Item>
    ) {
        const boxIndexes = Array.from(
            new Set(lottery.boxes.map((box) => box.boxIndex))
        ).sort((a, b) => a - b);

        return (
            <>
                <div style={{ margin: "1em 0" }}>
                    <b>Cost of 1 roll:</b>{" "}
                    <Link to={`/${region}/item/${lottery.cost.item.id}`}>
                        <ItemIcon
                            region={region}
                            item={lottery.cost.item}
                            height={40}
                        />{" "}
                        {lottery.cost.item.name}
                    </Link>{" "}
                    x{lottery.cost.amount}
                </div>
                {boxIndexes.map((boxIndex) => {
                    const boxes = lottery.boxes
                        .filter((box) => box.boxIndex === boxIndex)
                        .sort((a, b) => a.no - b.no);

                    const title = `Box ${boxIndex + 1}${
                        boxIndex === Math.max(...boxIndexes) && !lottery.limited
                            ? "+"
                            : ""
                    }`;

                    const boxTable = this.renderLotteryBox(
                        region,
                        boxes,
                        itemMap
                    );

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
        itemMap: Map<number, Item.Item>,
        servantCache: Map<number, Servant.ServantBasic>,
        itemCache: Map<number, Item.Item>,
        questCache: Map<number, Quest.Quest>,
        enums?: EnumList
    ) {
        switch (tab.type) {
            case "tower":
                return this.renderRewardTower(
                    region,
                    event.towers.filter((tower) => tower.towerId === tab.id)[0],
                    itemMap
                );
            case "ladder":
                return this.renderRewardTab(
                    region,
                    event.rewards.filter((reward) => reward.groupId === tab.id),
                    event.pointBuffs,
                    itemMap
                );
            case "shop":
                return this.renderShopTab(
                    region,
                    event.shop.filter((shop) => shop.slot === tab.id),
                    itemMap
                );
            case "mission":
                return this.renderMissionTab(
                    region,
                    event.missions,
                    itemMap,
                    servantCache,
                    itemCache,
                    questCache,
                    enums
                );
            case "lottery":
                const lottery = event.lotteries.filter(
                    (lottery) => lottery.id === tab.id
                )[0];
                return this.renderLotteryTab(region, lottery, itemMap);
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

        tabs = tabs.concat(
            event.lotteries.map((lottery) => {
                return {
                    type: "lottery",
                    id: lottery.id,
                    title: `Lottery ${lottery.id}`,
                    tabKey: `lottery-${lottery.id}`,
                };
            })
        );

        tabs = tabs.concat(
            event.towers.map((tower) => {
                return {
                    type: "tower",
                    id: tower.towerId,
                    title: tower.name,
                    tabKey: `tower-${tower.towerId}`,
                };
            })
        );

        tabs = tabs.concat(
            Array.from(
                new Set(event.rewards.map((reward) => reward.groupId))
            ).map((groupId) => {
                return {
                    type: "ladder",
                    id: groupId,
                    title: `Ladder ${groupId}`,
                    tabKey: `ladder-${groupId}`,
                };
            })
        );

        tabs = tabs.concat(
            Array.from(new Set(event.shop.map((shop) => shop.slot))).map(
                (shopSlot) => {
                    return {
                        type: "shop",
                        id: shopSlot,
                        title: `Shop ${shopSlot}`,
                        tabKey: `shop-${shopSlot}`,
                    };
                }
            )
        );

        const wars = mergeElements(
            this.state.wars.map((war) => (
                <WarDescriptor region={this.props.region} war={war} />
            )),
            ", "
        );

        return (
            <div>
                <h1>{event.name}</h1>

                <br />
                <div style={{ marginBottom: "3%" }}>
                    <DataTable
                        data={{
                            ID: event.id,
                            Name: event.name,
                            Wars: wars,
                            Start: new Date(
                                event.startedAt * 1000
                            ).toLocaleString(),
                            End: new Date(
                                event.endedAt * 1000
                            ).toLocaleString(),
                            Raw: (
                                <Row>
                                    <Col>
                                        <RawDataViewer
                                            text="Nice"
                                            data={event}
                                        />
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
                    id={"servant-tabs"}
                    defaultActiveKey={
                        this.props.tab ??
                        (tabs.length > 0 ? tabs[0].tabKey : undefined)
                    }
                    mountOnEnter={true}
                    onSelect={(key: string | null) => {
                        this.props.history.replace(
                            `/${this.props.region}/event/${this.props.eventId}/${key}`
                        );
                    }}
                >
                    {tabs.map((tab) => {
                        return (
                            <Tab
                                key={tab.tabKey}
                                eventKey={tab.tabKey}
                                title={tab.title}
                            >
                                {this.renderTab(
                                    this.props.region,
                                    event,
                                    tab,
                                    this.state.itemCache,
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
