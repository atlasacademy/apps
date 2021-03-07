import { Item, Region, War } from "@atlasacademy/api-connector";
import { AxiosError } from "axios";
import React from "react";
import { Col, Row, Table } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";
import Api, { Host } from "../Api";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import QuestConsumeDescriptor from "../Descriptor/QuestConsumeDescriptor";
import { QuestTypeDescription } from "./QuestPage";
import { handleNewLine, mergeElements } from "../Helper/OutputHelper";
import renderCollapsibleContent from "../Component/CollapsibleContent";

import Manager from "../Setting/Manager";
import BgmDescriptor from "../Descriptor/BgmDescriptor";
import EventDescriptor from "../Descriptor/EventDescriptor";

const imgOnError = (e: React.SyntheticEvent<HTMLImageElement, ErrorEvent>) => {
    const el = e.target as HTMLImageElement;
    el.onerror = null;
    el.src = "";
};

interface IProps extends RouteComponentProps {
    region: Region;
    warId: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    war?: War.War;
    itemCache: Map<number, Item.Item>;
    spotRefs: Map<number, React.Ref<any>>;
}

class WarPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            itemCache: new Map(),
            spotRefs: new Map(),
        };
    }

    async componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadWar();
        this.loadItemMap();
    }

    async loadItemMap() {
        const itemList = await Api.itemList();
        this.setState({
            itemCache: new Map(itemList.map((item) => [item.id, item])),
        });
    }

    async loadWar() {
        try {
            const war = await Api.war(this.props.warId);
            this.setState({
                loading: false,
                war: war,
            });
            document.title = `[${this.props.region}] War - ${war.longName} - Atlas Academy DB`;
        } catch (e) {
            this.setState({
                error: e,
            });
        }
    }

    renderSpot(
        region: Region,
        spot: War.Spot,
        itemMap: Map<number, Item.Item>
    ) {
        const title = (
            <span>
                <img
                    style={{
                        width: "auto",
                        height: "1.5em",
                        position: "relative",
                        top: "-10px",
                    }}
                    src={spot.image}
                    onError={imgOnError}
                />
                {spot.name}
            </span>
        );
        const questTable = (
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Cost</th>
                        <th>Phases</th>
                        <th>Reward</th>
                    </tr>
                </thead>
                <tbody>
                    {spot.quests.map((quest) => (
                        <tr key={quest.id}>
                            <td>
                                <Link to={`/${region}/quest/${quest.id}/1`}>
                                    {quest.id}
                                </Link>
                            </td>
                            <td>
                                <Link to={`/${region}/quest/${quest.id}/1`}>
                                    {quest.name}
                                </Link>
                            </td>
                            <td>
                                {QuestTypeDescription.get(quest.type) ??
                                    quest.type}
                            </td>
                            <td>
                                <QuestConsumeDescriptor
                                    region={region}
                                    consumeType={quest.consumeType}
                                    consume={quest.consume}
                                    consumeItem={quest.consumeItem}
                                />
                            </td>
                            <td>
                                {mergeElements(
                                    quest.phases.map((phase) => (
                                        <Link
                                            key={phase}
                                            to={`/${region}/quest/${quest.id}/${phase}`}
                                        >
                                            {phase}
                                        </Link>
                                    )),
                                    ", "
                                )}
                            </td>
                            <td>
                                {quest.gifts.map((gift) => (
                                    <div
                                        key={`${gift.objectId}-${gift.priority}`}
                                    >
                                        <GiftDescriptor
                                            region={region}
                                            gift={gift}
                                            items={itemMap}
                                        />
                                        <br />
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
        return renderCollapsibleContent({
            title: title,
            content: questTable,
            subheader: false,
        });
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.war) return <Loading />;

        const war = this.state.war;

        const event =
            war.eventId !== 0 ? (
                <EventDescriptor
                    region={this.props.region}
                    eventId={war.eventId}
                />
            ) : (
                ""
            );

        return (
            <div>
                <h1 style={{ marginBottom: "1em" }}>
                    {handleNewLine(war.longName)}
                </h1>
                <div style={{ marginBottom: "3%" }}>
                    <DataTable
                        data={{
                            ID: war.id,
                            Name: handleNewLine(war.longName),
                            Age: war.age,
                            Event: event,
                            Banner: (
                                <img
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "5em",
                                    }}
                                    src={war.banner}
                                    onError={imgOnError}
                                />
                            ),
                            BGM: (
                                <BgmDescriptor
                                    region={this.props.region}
                                    bgm={war.bgm}
                                />
                            ),
                            Raw: (
                                <Row>
                                    <Col>
                                        <RawDataViewer text="Nice" data={war} />
                                    </Col>
                                    <Col>
                                        <RawDataViewer
                                            text="Raw"
                                            data={`${Host}/raw/${this.props.region}/war/${war.id}`}
                                        />
                                    </Col>
                                </Row>
                            ),
                        }}
                    />
                </div>
                {war.spots.map((spot) => (
                    <div key={spot.id}>
                        {this.renderSpot(
                            this.props.region,
                            spot,
                            this.state.itemCache
                        )}
                    </div>
                ))}
            </div>
        );
    }
}

export default withRouter(WarPage);
