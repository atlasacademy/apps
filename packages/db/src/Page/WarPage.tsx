import { Item, Quest, Region, War } from "@atlasacademy/api-connector";
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
    if (el.src !== "") {
        el.onerror = null;
        el.src = "";
        el.alt = "";
    }
};

const SpotImage = (props: { src?: string; name: string; height: string }) => {
    if (props.src === undefined) return null;
    return (
        <img
            style={{
                width: "auto",
                height: props.height,
                position: "relative",
                top: "-10px",
            }}
            src={props.src}
            onError={imgOnError}
            alt={`Spot ${props.name}`}
        />
    );
};

const phaseLink = (region: Region, quest: Quest.Quest, phase: number) => {
    const hasEnemies = quest.phasesWithEnemies.includes(phase);
    const hasEnemiesDescription = hasEnemies ? " (has enemies data)" : "";
    const hasEnemiesIcon = hasEnemies ? (
        <>
            &nbsp;
            <FontAwesomeIcon icon={faDragon} />
        </>
    ) : null;
    const isStory = quest.phasesNoBattle.includes(phase);
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
            style={{ whiteSpace: "nowrap" }}
        >
            {phase}
            {hasEnemiesIcon}
            {isStoryIcon}
        </Link>
    );
};

const QuestTable = (props: {
    region: Region;
    quests: Quest.Quest[];
    itemMap: Map<number, Item.Item>;
    spots?: War.Spot[];
}) => {
    const region = props.region;
    return (
        <Table hover responsive>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    {props.spots !== undefined ? <th>Spot</th> : null}
                    <th>Phases</th>
                    <th>Reward</th>
                </tr>
            </thead>
            <tbody>
                {props.quests.map((quest, i) => (
                    <tr key={quest.id}>
                        <td>
                            <Link to={`/${region}/quest/${quest.id}/1`}>
                                {quest.id}
                            </Link>
                        </td>
                        <td style={{ maxWidth: "15em" }}>
                            <Link to={`/${region}/quest/${quest.id}/1`}>
                                {quest.name}
                            </Link>
                        </td>
                        {props.spots !== undefined ? (
                            <td style={{ whiteSpace: "nowrap" }}>
                                <SpotImage
                                    src={props.spots[i].image}
                                    name={props.spots[i].name}
                                    height="2em"
                                />{" "}
                                <span style={{ whiteSpace: "normal" }}>
                                    {props.spots[i].name}
                                </span>
                            </td>
                        ) : null}
                        <td>
                            {mergeElements(
                                quest.phases.map((phase) =>
                                    phaseLink(region, quest, phase)
                                ),
                                ", "
                            )}
                        </td>
                        <td>
                            {quest.gifts.map((gift) => (
                                <div key={`${gift.objectId}-${gift.priority}`}>
                                    <GiftDescriptor
                                        region={region}
                                        gift={gift}
                                        items={props.itemMap}
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
};

const MainQuests = (props: {
    region: Region;
    spots: War.Spot[];
    itemMap: Map<number, Item.Item>;
}) => {
    let mainQuests = [] as { quest: Quest.Quest; spot: War.Spot }[];
    for (let spot of props.spots) {
        for (let quest of spot.quests) {
            if (quest.type === Quest.QuestType.MAIN) {
                mainQuests.push({ quest, spot });
            }
        }
    }

    if (mainQuests.length === 0) return null;

    mainQuests = mainQuests.sort((a, b) => a.quest.id - b.quest.id);

    const questTable = (
        <QuestTable
            region={props.region}
            quests={mainQuests.map((quest) => quest.quest)}
            itemMap={props.itemMap}
            spots={mainQuests.map((quest) => quest.spot)}
        />
    );

    return renderCollapsibleContent({
        title: "Main Quests",
        content: questTable,
        subheader: false,
    });
};

const Spot = (props: {
    region: Region;
    spot: War.Spot;
    filterQuest: (quest: Quest.Quest) => boolean;
    itemMap: Map<number, Item.Item>;
}) => {
    const spot = props.spot;
    const filteredQuest = spot.quests.filter(props.filterQuest);

    if (filteredQuest.length === 0) return null;

    const title = (
        <span>
            <SpotImage src={spot.image} name={spot.name} height="1.5em" />
            {spot.name}
        </span>
    );

    const questTable = (
        <QuestTable
            region={props.region}
            quests={filteredQuest}
            itemMap={props.itemMap}
        />
    );

    return renderCollapsibleContent({
        title: title,
        content: questTable,
        subheader: true,
        initialOpen: filteredQuest.length > 0,
    });
};

const SpotQuestList = (props: {
    title: string;
    region: Region;
    spots: War.Spot[];
    filterQuest: (quest: Quest.Quest) => boolean;
    itemMap: Map<number, Item.Item>;
}) => {
    let hasFilteredQuest = false;
    for (let spot of props.spots) {
        if (spot.quests.filter(props.filterQuest).length > 0) {
            hasFilteredQuest = true;
            break;
        }
    }

    if (!hasFilteredQuest) return null;

    const spots = (
        <div>
            {props.spots.map((spot) => (
                <Spot
                    key={spot.id}
                    region={props.region}
                    spot={spot}
                    filterQuest={props.filterQuest}
                    itemMap={props.itemMap}
                />
            ))}
        </div>
    );

    return renderCollapsibleContent({
        title: props.title,
        content: spots,
        subheader: false,
    });
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

        let banners: string[] = [];
        if (war.banner !== undefined) banners.push(war.banner);
        for (let warAdd of war.warAdds) {
            if (
                warAdd.type === War.WarOverwriteType.BANNER &&
                warAdd.overwriteBanner !== undefined
            ) {
                banners.push(warAdd.overwriteBanner);
            }
        }

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
                            alt={`War's banner #${index} ${banner}`}
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
                <MainQuests
                    region={this.props.region}
                    spots={war.spots}
                    itemMap={this.state.itemCache}
                />
                {[
                    Quest.QuestType.FREE,
                    Quest.QuestType.EVENT,
                    Quest.QuestType.FRIENDSHIP,
                    Quest.QuestType.WAR_BOARD,
                    Quest.QuestType.HERO_BALLAD,
                ].map((questType) => {
                    const questTypeDescription =
                        QuestTypeDescription.get(questType) ??
                        questType.toString();
                    return (
                        <SpotQuestList
                            key={questType}
                            title={`${questTypeDescription} Quests`}
                            region={this.props.region}
                            spots={war.spots}
                            filterQuest={(quest: Quest.Quest) =>
                                quest.type === questType
                            }
                            itemMap={this.state.itemCache}
                        />
                    );
                })}
            </div>
        );
    }
}

export default withRouter(WarPage);
