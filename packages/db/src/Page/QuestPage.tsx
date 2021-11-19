import { Quest, QuestEnemy, Region } from "@atlasacademy/api-connector";
import { AxiosError } from "axios";
import React from "react";
import { Alert, Col, Pagination, Row, Tab, Tabs } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link, RouteComponentProps } from "react-router-dom";
import Api, { Host } from "../Api";
import ClassIcon from "../Component/ClassIcon";
import renderCollapsibleContent from "../Component/CollapsibleContent";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import QuestStage from "../Component/QuestStage";
import SupportServantTables from "../Component/SupportServant";
import RawDataViewer from "../Component/RawDataViewer";
import { QuestDropDescriptor } from "../Component/QuestEnemy";
import CondTargetValueDescriptor from "../Descriptor/CondTargetValueDescriptor";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import QuestConsumeDescriptor from "../Descriptor/QuestConsumeDescriptor";
import ScriptDescriptor, { sortScript } from "../Descriptor/ScriptDescriptor";
import TraitDescription from "../Descriptor/TraitDescription";
import { mergeElements } from "../Helper/OutputHelper";
import { colorString } from "../Helper/StringHelper";
import Manager from "../Setting/Manager";
import { flatten } from "../Helper/PolyFill";

import "../Helper/StringHelper.css";

export const QuestTypeDescription = new Map([
    [Quest.QuestType.MAIN, "Main"],
    [Quest.QuestType.FREE, "Free"],
    [Quest.QuestType.FRIENDSHIP, "Interlude"],
    [Quest.QuestType.EVENT, "Event"],
    [Quest.QuestType.HERO_BALLAD, "Hero Ballad"],
    [Quest.QuestType.WAR_BOARD, "War Board"],
]);

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    phase: number;
    stage?: number;
}

interface IState {
    phase: number;
    error?: AxiosError;
    loading: boolean;
    quest?: Quest.QuestPhase;
}

const PhaseNavigator = (props: {
    region: Region;
    quest: Quest.QuestPhase;
    currentPhase: number;
    setPhase: (phase: number) => void;
}) => {
    const currentPhase = props.currentPhase,
        phases = props.quest.phases.sort((a, b) => a - b);
    return (
        <Pagination style={{ marginBottom: 0, float: "right" }}>
            <Pagination.Prev
                disabled={currentPhase === Math.min(...phases)}
                onClick={() => {
                    props.setPhase(currentPhase - 1);
                }}
            />
            {props.quest.phases.map((phase) => (
                <Pagination.Item
                    key={phase}
                    active={phase === currentPhase}
                    onClick={() => {
                        props.setPhase(phase);
                    }}
                >
                    {phase}
                </Pagination.Item>
            ))}
            <Pagination.Next
                disabled={currentPhase === Math.max(...phases)}
                onClick={() => {
                    props.setPhase(currentPhase + 1);
                }}
            />
        </Pagination>
    );
};

const QuestMainData = (props: {
    region: Region;
    quest: Quest.QuestPhase;
    phase: number;
    setPhase: (phase: number) => void;
}) => {
    const quest = props.quest;
    return (
        <DataTable
            responsive
            data={{
                ID: quest.id,
                Phases: (
                    <PhaseNavigator
                        region={props.region}
                        quest={quest}
                        currentPhase={props.phase}
                        setPhase={props.setPhase}
                    />
                ),
                Type: QuestTypeDescription.get(quest.type) ?? quest.type,
                Cost: (
                    <QuestConsumeDescriptor
                        region={props.region}
                        consumeType={quest.consumeType}
                        consume={quest.consume}
                        consumeItem={quest.consumeItem}
                    />
                ),
                Reward: (
                    <>
                        {quest.gifts.map((gift) => (
                            <div key={`${gift.objectId}-${gift.priority}`}>
                                <GiftDescriptor
                                    region={props.region}
                                    gift={gift}
                                />
                                <br />
                            </div>
                        ))}
                    </>
                ),
                Repeatable:
                    quest.afterClear ===
                        Quest.QuestAfterClearType.REPEAT_LAST &&
                    props.phase === Math.max(...quest.phases)
                        ? "True"
                        : "False",
                War: (
                    <Link to={`/${props.region}/war/${quest.warId}`}>
                        {quest.warLongName}
                    </Link>
                ),
                Open: new Date(quest.openedAt * 1000).toLocaleString(),
                Close: new Date(quest.closedAt * 1000).toLocaleString(),
            }}
        />
    );
};

const QuestSubData = (props: { region: Region; quest: Quest.QuestPhase }) => {
    const quest = props.quest;
    return (
        <DataTable
            data={{
                "QP Reward": quest.qp.toLocaleString(),
                EXP: quest.exp.toLocaleString(),
                Bond: quest.bond.toLocaleString(),
                "Unlock Condition": (
                    <>
                        {quest.releaseConditions.map((cond) => (
                            <div
                                key={`${cond.type}-${cond.targetId}-${cond.value}`}
                            >
                                {cond.closedMessage !== ""
                                    ? `${cond.closedMessage} — `
                                    : ""}
                                <CondTargetValueDescriptor
                                    region={props.region}
                                    cond={cond.type}
                                    target={cond.targetId}
                                    value={cond.value}
                                />
                            </div>
                        ))}
                    </>
                ),
                Individuality: mergeElements(
                    quest.individuality.map((trait) => (
                        <TraitDescription
                            region={props.region}
                            trait={trait}
                            owner="quests"
                            ownerParameter="fieldIndividuality"
                        />
                    )),
                    ", "
                ),
                "Enemy Classes": mergeElements(
                    quest.className.map((className) => (
                        <ClassIcon className={className} />
                    )),
                    " "
                ),
                "Battle BG ID": (
                    <Link
                        to={`/${props.region}/quests?battleBgId=${quest.battleBgId}`}
                    >
                        {quest.battleBgId}
                    </Link>
                ),
                Raw: (
                    <Row>
                        <Col>
                            <RawDataViewer text="Nice" data={quest} />
                        </Col>
                        <Col>
                            <RawDataViewer
                                text="Raw"
                                data={`${Host}/raw/${props.region}/quest/${quest.id}/${quest.phase}`}
                            />
                        </Col>
                    </Row>
                ),
            }}
        />
    );
};

const QuestDrops = ({
    region,
    stages,
}: {
    region: Region;
    stages: Quest.Stage[];
}) => {
    const allDrops = flatten(
        flatten(stages.map((stage) => stage.enemies)).map(
            (enemy) => enemy.drops
        )
    );

    if (allDrops.length === 0) {
        return <></>;
    }

    const totalDrops = new Map<string, QuestEnemy.EnemyDrop>();
    for (const drop of allDrops) {
        const key = `${drop.type}-${drop.objectId}-${drop.num}`;
        if (totalDrops.has(key)) {
            totalDrops.get(key)!.dropCount += drop.dropCount;
        } else {
            totalDrops.set(key, { ...drop });
        }
    }

    const dropList = Array.from(totalDrops.values()).sort(
        (a, b) =>
            a.type.localeCompare(b.type) ||
            a.objectId - b.objectId ||
            a.num - b.num
    );

    return <QuestDropDescriptor region={region} drops={dropList} />;
};

class QuestPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            phase: props.phase,
            loading: true,
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadQuest(this.props.phase);
    }

    componentDidUpdate(
        prevProps: Readonly<IProps>,
        prevState: Readonly<IState>
    ) {
        if (
            this.props.id !== prevProps.id ||
            this.state.phase !== prevState.phase
        ) {
            this.loadQuest(this.state.phase);
            const url = `/${this.props.region}/quest/${this.props.id}/${this.state.phase}`;
            this.props.history.push(url);
        }
    }

    async loadQuest(phase: number) {
        Api.questPhase(this.props.id, phase)
            .then((quest) => {
                document.title = `[${this.props.region}] Quest - ${quest.name} - Phase ${phase} - Atlas Academy DB`;
                this.setState({ quest, loading: false });
            })
            .catch((error) => this.setState({ error }));
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.quest) return <Loading />;

        const quest = this.state.quest;

        return (
            <div>
                <h1>{quest.name}</h1>

                <br />
                <Row style={{ marginBottom: "3%" }}>
                    <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                        <QuestMainData
                            region={this.props.region}
                            quest={quest}
                            phase={this.state.phase}
                            setPhase={(phase) => {
                                this.setState({ phase });
                            }}
                        />
                    </Col>
                    <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                        <QuestSubData
                            region={this.props.region}
                            quest={quest}
                        />
                    </Col>
                </Row>
                {quest.messages.length > 0 ? (
                    <Alert variant="success" className="newline">
                        {quest.messages.length > 1 ? (
                            <ul style={{ marginBottom: 0 }}>
                                {quest.messages.map((message) => (
                                    <li key={message.idx}>
                                        {colorString(message.message)}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            colorString(quest.messages[0].message)
                        )}
                    </Alert>
                ) : null}
                {quest.scripts.length > 0 ? (
                    <Alert variant="success">
                        {quest.scripts.length > 1 ? (
                            <ul style={{ marginBottom: 0 }}>
                                {sortScript(
                                    quest.scripts.map(
                                        (script) => script.scriptId
                                    )
                                ).map((scriptId) => (
                                    <li key={scriptId}>
                                        <ScriptDescriptor
                                            region={this.props.region}
                                            scriptId={scriptId}
                                        />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <ScriptDescriptor
                                region={this.props.region}
                                scriptId={quest.scripts[0].scriptId}
                            />
                        )}
                    </Alert>
                ) : null}
                <QuestDrops region={this.props.region} stages={quest.stages} />
                {quest.supportServants.length > 0 ? (
                    <>
                        {renderCollapsibleContent({
                            title: `Support Servant${
                                quest.supportServants.length > 1 ? "s" : ""
                            }`,
                            content: (
                                <SupportServantTables
                                    region={this.props.region}
                                    supportServants={quest.supportServants}
                                />
                            ),
                            subheader: false,
                            initialOpen: false,
                        })}
                    </>
                ) : null}
                {quest.stages.length > 0 ? (
                    <Tabs
                        defaultActiveKey={
                            this.props.stage !== undefined
                                ? this.props.stage
                                : 1
                        }
                        onSelect={(key: string | null) => {
                            this.props.history.replace(
                                `/${this.props.region}/quest/${this.props.id}/${this.state.phase}` +
                                    (key ? `/stage-${key}` : "")
                            );
                        }}
                    >
                        {quest.stages.map((stage) => (
                            <Tab
                                key={stage.wave}
                                eventKey={stage.wave}
                                title={`Stage ${stage.wave}`}
                            >
                                <QuestStage
                                    region={this.props.region}
                                    stage={stage}
                                />
                            </Tab>
                        ))}
                    </Tabs>
                ) : null}
            </div>
        );
    }
}

export default withRouter(QuestPage);
