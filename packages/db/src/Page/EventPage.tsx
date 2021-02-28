import { Event, Item, Region, Shop } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";
import { AxiosError } from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { Col, Row, Tab, Table, Tabs } from "react-bootstrap";
import { withRouter } from "react-router";
import ItemIcon from "../Component/ItemIcon";
import { RouteComponentProps } from "react-router-dom";
import Api, { Host } from "../Api";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import ShopPurchaseDescriptor from "../Descriptor/ShopPurchaseDescriptor";
import { mergeElements } from "../Helper/OutputHelper";
import Manager from "../Setting/Manager";

import "./EventPage.css";

interface TabInfo {
    type: "ladder" | "shop";
    id: number;
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
    itemMap: Map<number, Item.Item>;
}

class EventPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            itemMap: new Map([]),
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadItemList();
        this.loadEvent();
    }

    async loadItemList() {
        const itemList = await Api.itemList();
        this.setState({
            itemMap: new Map(itemList.map((item) => [item.id, item])),
        });
    }

    async loadEvent() {
        try {
            const event = await Api.event(this.props.eventId);
            this.setState({ loading: false, event: event });
            document.title = `[${this.props.region}] Event - ${event.name} - Atlas Academy DB`;
        } catch (e) {
            this.setState({
                error: e,
            });
        }
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
                                                key={gift.id}
                                                region={region}
                                                gift={gift}
                                                itemMap={itemMap}
                                                pointBuffMap={pointBuffMap}
                                            />
                                        )),
                                        " and "
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
                                            {shop.detail}
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
        }
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.event) return <Loading />;

        const event = this.state.event;

        let tabs: TabInfo[] = [];

        tabs = tabs.concat(
            Array.from(
                new Set(event.rewards.map((reward) => reward.groupId))
            ).map((groupId) => {
                return {
                    type: "ladder",
                    id: groupId,
                };
            })
        );

        tabs = tabs.concat(
            Array.from(new Set(event.shop.map((shop) => shop.slot))).map(
                (shopSlot) => {
                    return {
                        type: "shop",
                        id: shopSlot,
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
                        (tabs.length > 0
                            ? `${tabs[0].type}-${tabs[0].id}`
                            : undefined)
                    }
                    mountOnEnter={true}
                    onSelect={(key: string | null) => {
                        this.props.history.replace(
                            `/${this.props.region}/event/${this.props.eventId}/${key}`
                        );
                    }}
                >
                    {tabs.map((tab) => {
                        const tabKey = `${tab.type}-${tab.id}`;
                        return (
                            <Tab
                                key={tabKey}
                                eventKey={tabKey}
                                title={`${toTitleCase(tab.type)} ${tab.id}`}
                            >
                                {this.renderTab(
                                    this.props.region,
                                    event,
                                    tab,
                                    this.state.itemMap
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
