import {
    Event,
    Item,
    Region,
    Shop,
    Mission,
    Quest,
    Servant,
    EnumList,
} from "@atlasacademy/api-connector";
import { AxiosError } from "axios";
import React from "react";
import { Col, Row, Tab, Table, Tabs } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";
import Api, { Host } from "../Api";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import ItemIcon from "../Component/ItemIcon";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import ShopPurchaseDescriptor from "../Descriptor/ShopPurchaseDescriptor";
import MissionCondDescriptor from "../Descriptor/MissionCondDescriptor";
import { handleNewLine, mergeElements } from "../Helper/OutputHelper";

import Manager from "../Setting/Manager";
import "./EventPage.css";

interface TabInfo {
    type: "ladder" | "shop" | "mission";
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

    async loadQuestMap(warIds: number[]) {
        try {
            const wars = await Promise.all(
                warIds.map((warId) => Api.war(warId))
            );
            const quests: Quest.Quest[] = [];
            for (const war of wars) {
                for (const spot of war.spots) {
                    for (const quest of spot.quests) {
                        quests.push(quest);
                    }
                }
            }
            this.setState({
                questCache: new Map(quests.map((quest) => [quest.id, quest])),
            });
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
            if (event.missions.length > 0) {
                await this.loadQuestMap(event.warIds);
            }
        } catch (e) {
            this.setState({
                error: e,
            });
        }
    }

    renderMissionConds(
        region: Region,
        mission: Mission.Mission,
        missionMap: Map<number, Mission.Mission>
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
                    <MissionCondDescriptor
                        key={conds[0].id}
                        region={region}
                        cond={conds[0]}
                        quests={this.state.questCache}
                        servants={this.state.servantCache}
                        missions={missionMap}
                        items={this.state.itemCache}
                        enums={this.state.enums}
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
        missionMap: Map<number, Mission.Mission>
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
                    {this.renderMissionConds(region, mission, missionMap)}
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
        itemMap: Map<number, Item.Item>
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
                                        missionMap
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
                                <th scope="row">{reward.point}</th>
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

    renderShopTab(
        region: Region,
        shops: Shop.Shop[],
        itemMap: Map<number, Item.Item>
    ) {
        return (
            <Table hover responsive className="shopTable">
                <thead>
                    <tr>
                        <th>Detail</th>
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
                                    <td>
                                        <b>{shop.name}</b>
                                        <div style={{ fontSize: "0.75rem" }}>
                                            {handleNewLine(shop.detail)}
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
                                        {shop.cost.amount}
                                    </td>
                                    <td>
                                        <ShopPurchaseDescriptor
                                            region={region}
                                            shop={shop}
                                            itemMap={itemMap}
                                        />
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        {shop.setNum}
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        {shop.limitNum === 0
                                            ? "Unlimited"
                                            : shop.limitNum}
                                    </td>
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
        itemMap: Map<number, Item.Item>
    ) {
        switch (tab.type) {
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
                return this.renderMissionTab(region, event.missions, itemMap);
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

        return (
            <div>
                <h1>{event.name}</h1>

                <br />
                <div style={{ marginBottom: "3%" }}>
                    <DataTable
                        data={{
                            ID: event.id,
                            Name: event.name,
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
                                    this.state.itemCache
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
