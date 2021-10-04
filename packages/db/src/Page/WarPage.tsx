import { Item, Quest, Region, War } from "@atlasacademy/api-connector";
import { faBook, faDragon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import React, { useState } from "react";
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
import ScriptDescriptor from "../Descriptor/ScriptDescriptor";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import { mergeElements } from "../Helper/OutputHelper";
import Manager from "../Setting/Manager";
import { QuestTypeDescription } from "./QuestPage";
import { removeSuffix } from "../Helper/StringHelper";

import "../Helper/StringHelper.css";

const BannerImage = (props: { src?: string; index: number }) => {
    const [src, setSrc] = useState(props.src);

    if (!src) return null;

    return (
        <div>
            <img
                style={{
                    maxWidth: "100%",
                    maxHeight: "5em",
                }}
                src={src}
                onError={() => {
                    setSrc(undefined);
                }}
                alt={`War's banner #${props.index} ${src}`}
            />
            <br />
        </div>
    );
};

const SpotImage = (props: { src?: string; name: string; height: string }) => {
    const [src, setSrc] = useState(props.src);

    if (src === undefined) return null;

    return (
        <img
            style={{
                width: "auto",
                height: props.height,
                position: "relative",
                top: "-10px",
            }}
            src={src}
            onError={() => {
                setSrc(undefined);
            }}
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

const getQuestSection = (quest: Quest.Quest) => {
    if (quest.chapterSubStr !== "") {
        return removeSuffix(quest.chapterSubStr, ":");
    }
    if (quest.chapterSubId !== 0) {
        return quest.chapterSubId.toString();
    }
    return "";
};

const QuestTable = (props: {
    region: Region;
    quests: Quest.Quest[];
    itemMap: Map<number, Item.Item>;
    spots?: War.Spot[];
    showSection?: boolean;
}) => {
    const { region, quests } = props,
        hasScript =
            props.quests.find((quest) => quest.phaseScripts.length > 0) !==
            undefined,
        hasSection =
            props.showSection &&
            (quests.find((quest) => quest.chapterSubId !== 0) ||
                quests.find((quest) => quest.chapterSubStr !== ""));
    return (
        <Table hover responsive>
            <thead>
                <tr>
                    {hasSection ? <th>Section</th> : null}
                    <th>ID</th>
                    <th>Name</th>
                    {props.spots !== undefined ? <th>Spot</th> : null}
                    <th>Phases</th>
                    <th>Reward</th>
                    {hasScript ? <th>Script</th> : null}
                </tr>
            </thead>
            <tbody>
                {props.quests.map((quest, i) => (
                    <tr key={quest.id}>
                        {hasSection ? <td>{getQuestSection(quest)}</td> : null}
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
                                <br />
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
                        {hasScript ? (
                            <td>
                                {mergeElements(
                                    quest.phaseScripts.map((scripts) => (
                                        <span style={{ whiteSpace: "nowrap" }}>
                                            {scripts.phase}:{" "}
                                            {mergeElements(
                                                scripts.scripts.map(
                                                    (script) => (
                                                        <ScriptDescriptor
                                                            region={region}
                                                            scriptId={
                                                                script.scriptId
                                                            }
                                                            scriptName={script.scriptId.slice(
                                                                -2
                                                            )}
                                                            scriptType=""
                                                        />
                                                    )
                                                ),
                                                ", "
                                            )}
                                        </span>
                                    )),
                                    <br />
                                )}
                            </td>
                        ) : null}
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

    mainQuests.sort((a, b) => a.quest.id - b.quest.id);

    const questTable = (
        <QuestTable
            region={props.region}
            quests={mainQuests.map((quest) => quest.quest)}
            itemMap={props.itemMap}
            spots={mainQuests.map((quest) => quest.spot)}
            showSection={true}
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
    last?: boolean;
}) => {
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

    return renderCollapsibleContent(
        {
            title: props.title,
            content: spots,
            subheader: false,
        },
        !props.last
    );
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
        Api.itemList()
            .then((items) => this.setState({
                itemCache: new Map(items.map((item) => [item.id, item])),
            }));
    }

    async loadWar() {
        Api.war(this.props.warId)
            .then((war) => {
                document.title = `[${this.props.region}] War - ${war.longName} - Atlas Academy DB`;
                this.setState({ war, loading: false });
            })
            .catch((error) => this.setState({ error }));
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.war) return <Loading />;

        const war = this.state.war;

        const event =
            war.eventId !== 0 ? (
                <Link to={`/${this.props.region}/event/${war.eventId}`}>
                    {war.eventName !== "" ? war.eventName : `Event ${war.eventId}`}
                </Link>
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
                    <BannerImage key={index} index={index} src={banner} />
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
                    <BgmDescriptor
                        region={this.props.region}
                        bgm={bgm}
                        showLink={true}
                    />
                </div>
            );
        });

        const openingScript =
            war.scriptId === "NONE" ? (
                ""
            ) : (
                <Link to={`/${this.props.region}/script/${war.scriptId}`}>
                    {war.scriptId}
                </Link>
            );

        return (
            <div>
                <h1 style={{ marginBottom: "1em" }} className="newline">
                    {war.longName}
                </h1>
                <div style={{ marginBottom: "3%" }}>
                    <DataTable
                        data={{
                            ID: war.id,
                            Name: <span className="newline">{war.longName}</span>,
                            Age: war.age,
                            Event: event,
                            "Opening Script": openingScript,
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
                ]
                    .filter((questType) => {
                        for (let { quests } of war.spots)
                            if (quests.find((q) => q.type === questType))
                                return true;

                        return false;
                    })
                    .map((questType, index, array) => {
                        const questTypeDescription =
                            QuestTypeDescription.get(questType) ??
                            questType.toString();
                        let questFilter = (quest: Quest.Quest) =>
                            quest.type === questType;

                        return (
                            <SpotQuestList
                                key={questType}
                                title={`${questTypeDescription} Quests`}
                                region={this.props.region}
                                spots={war.spots}
                                filterQuest={questFilter}
                                itemMap={this.state.itemCache}
                                last={index === array.length - 1}
                            />
                        );
                    })}
            </div>
        );
    }
}

export default withRouter(WarPage);
