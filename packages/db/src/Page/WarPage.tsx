import { Bgm, Item, Quest, Region, War } from "@atlasacademy/api-connector";
import { faBook, faDragon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import React from "react";
import { Col, Row, Table } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";
import Api, { Host } from "../Api";
import renderCollapsibleContent from "../Component/CollapsibleContent";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import BgmDescriptor from "../Descriptor/BgmDescriptor";
import EventDescriptor from "../Descriptor/EventDescriptor";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import { handleNewLine, mergeElements } from "../Helper/OutputHelper";
import Manager from "../Setting/Manager";
import { QuestTypeDescription } from "./QuestPage";

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

        const phaseLink = (quest: Quest.Quest, phase: number) => {
            const hasEnemies = quest.phasesWithEnemies.includes(phase);
            const hasEnemiesDescription = hasEnemies
                ? " (has enemies data)"
                : "";
            const hasEnemiesIcon = hasEnemies ? (
                <>
                    &nbsp;
                    <FontAwesomeIcon icon={faDragon} />
                </>
            ) : null;
            const isStory =
                quest.phasesNoBattle.includes(phase) ||
                (quest.consumeType === Quest.QuestConsumeType.AP &&
                    quest.consume === 0);
            const isStoryDescription = isStory ? " (has no battle)" : "";
            const isStoryIcon = isStory ? (
                <>
                    &nbsp;
                    <FontAwesomeIcon icon={faBook} />
                </>
            ) : null;
            return (
                <Link
                    title={`Arrow ${phase}${hasEnemiesDescription}${isStoryDescription}`}
                    key={phase}
                    to={`/${region}/quest/${quest.id}/${phase}`}
                >
                    {phase}
                    {hasEnemiesIcon}
                    {isStoryIcon}
                </Link>
            );
        };

        const questTable = (
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
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
                                {mergeElements(
                                    quest.phases.map((phase) =>
                                        phaseLink(quest, phase)
                                    ),
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

        const banners = [war.banner].concat(
            war.warAdds
                .filter(
                    (warAdd) =>
                        warAdd.type === War.WarOverwriteType.BANNER &&
                        warAdd.overwriteBanner !== undefined
                )
                .map((warAdd) => warAdd.overwriteBanner)
        );

        const bannerImages = (
            <>
                {banners.map((banner, index) => (
                    <div key={index}>
                        <img
                            style={{
                                maxWidth: "100%",
                                maxHeight: "5em",
                            }}
                            src={banner}
                            onError={imgOnError}
                        />
                        <br />
                    </div>
                ))}
            </>
        );

        const bgms = new Map([[war.bgm.id, war.bgm]]);
        for (const map of war.maps) {
            bgms.set(map.bgm.id, map.bgm);
        }

        const bgmDeduped = Array.from(bgms.values()).filter(
            (bgm) => bgm.id !== 0
        );

        const bgmPlayers = bgmDeduped.map((bgm, index) => {
            return (
                <div
                    key={bgm.id}
                    style={{
                        marginBottom:
                            index === bgmDeduped.length - 1 ? 0 : "0.75em",
                    }}
                >
                    <BgmDescriptor region={this.props.region} bgm={bgm} />
                </div>
            );
        });

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
                            Banner: bannerImages,
                            BGM: <>{bgmPlayers}</>,
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
