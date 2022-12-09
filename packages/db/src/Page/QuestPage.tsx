import { AxiosError } from "axios";
import React from "react";
import { Alert, Col, Pagination, Row, Tab, Tabs, Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router";
import { Link, RouteComponentProps } from "react-router-dom";

import { Ai, Quest, QuestEnemy, Region } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import Api, { Host } from "../Api";
import ClassIcon from "../Component/ClassIcon";
import renderCollapsibleContent from "../Component/CollapsibleContent";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import { QuestDropDescriptor } from "../Component/QuestEnemy";
import QuestRestriction from "../Component/QuestRestriction";
import QuestStage from "../Component/QuestStage";
import RawDataViewer from "../Component/RawDataViewer";
import SupportServantTables from "../Component/SupportServant";
import AiDescriptor from "../Descriptor/AiDescriptor";
import CondTargetValueDescriptor from "../Descriptor/CondTargetValueDescriptor";
import EntityDescriptor from "../Descriptor/EntityDescriptor";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import QuestConsumeDescriptor from "../Descriptor/QuestConsumeDescriptor";
import { QuestDescriptorId } from "../Descriptor/QuestDescriptor";
import ScriptDescriptor, { sortScript } from "../Descriptor/ScriptDescriptor";
import TraitDescription from "../Descriptor/TraitDescription";
import { mergeElements } from "../Helper/OutputHelper";
import { colorString, removePrefix } from "../Helper/StringHelper";
import Manager, { lang } from "../Setting/Manager";

import "../Helper/StringHelper.css";

export const QuestTypeDescription = new Map([
    [Quest.QuestType.MAIN, "Main"],
    [Quest.QuestType.FREE, "Free"],
    [Quest.QuestType.FRIENDSHIP, "Interlude"],
    [Quest.QuestType.EVENT, "Event"],
    [Quest.QuestType.HERO_BALLAD, "Hero Ballad"],
    [Quest.QuestType.WAR_BOARD, "War Board"],
]);

export const QuestFlagDescription = new Map([[Quest.QuestFlag.NONE, "None"]]);

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
    const { t } = useTranslation();
    return (
        <DataTable
            responsive
            data={[
                { label: "ID", value: quest.id },
                {
                    label: t("Phases"),
                    value: (
                        <PhaseNavigator
                            region={props.region}
                            quest={quest}
                            currentPhase={props.phase}
                            setPhase={props.setPhase}
                        />
                    ),
                },
                { label: t("Type"), value: QuestTypeDescription.get(quest.type) ?? quest.type },
                {
                    label: t("Cost"),
                    value: (
                        <QuestConsumeDescriptor
                            region={props.region}
                            consumeType={quest.consumeType}
                            consume={quest.consume}
                            consumeItem={quest.consumeItem}
                        />
                    ),
                },
                {
                    label: t("Reward"),
                    value: (
                        <>
                            {quest.giftIcon ? (
                                <>
                                    <div key={`${quest.giftIcon}`}>
                                        <img
                                            alt={`Quest Reward ${quest.giftIcon} icon`}
                                            style={{ maxWidth: "100%", maxHeight: "2em" }}
                                            src={quest.giftIcon}
                                        />
                                        <br />
                                    </div>
                                </>
                            ) : null}
                            {quest.gifts.map((gift) => (
                                <div key={`${gift.objectId}-${gift.priority}`}>
                                    <GiftDescriptor region={props.region} gift={gift} />
                                    <br />
                                </div>
                            ))}
                        </>
                    ),
                },
                {
                    label: t("Repeatable"),
                    value:
                        quest.afterClear === Quest.QuestAfterClearType.REPEAT_LAST &&
                        props.phase === Math.max(...quest.phases)
                            ? "True"
                            : "False",
                },
                {
                    label: t("War"),
                    value: (
                        <Link to={`/${props.region}/war/${quest.warId}`} lang={lang(props.region)}>
                            {quest.warLongName}
                        </Link>
                    ),
                },
                { label: t("Spot"), value: <span lang={lang(props.region)}>{quest.spotName}</span> },
                { label: t("Open"), value: new Date(quest.openedAt * 1000).toLocaleString() },
                { label: t("Close"), value: new Date(quest.closedAt * 1000).toLocaleString() },
            ]}
        />
    );
};

const QuestSubData = ({ region, quest }: { region: Region; quest: Quest.QuestPhase }) => {
    const { t } = useTranslation();
    return (
        <DataTable
            data={[
                { label: t("QP Reward"), value: quest.qp.toLocaleString() },
                { label: t("EXP"), value: quest.exp.toLocaleString() },
                { label: t("Bond"), value: quest.bond.toLocaleString() },
                {
                    label: t("Flags"),
                    value: (
                        <>
                            {quest.flags.length > 0
                                ? quest.flags.map((flag) => (
                                      <Link to={`/${region}/quests?flag=${flag}`} key={flag}>
                                          <Badge style={{ marginRight: 5, background: "green", color: "white" }}>
                                              {QuestFlagDescription.get(flag) ?? toTitleCase(flag)}
                                          </Badge>
                                      </Link>
                                  ))
                                : "This quest has no flag"}
                        </>
                    ),
                },
                {
                    label: t("Unlock Condition"),
                    value: (
                        <>
                            {quest.releaseConditions.map((cond) => (
                                <div key={`${cond.type}-${cond.targetId}-${cond.value}`}>
                                    {cond.closedMessage !== "" ? (
                                        <span lang={lang(region)}>{cond.closedMessage} — </span>
                                    ) : (
                                        ""
                                    )}
                                    <CondTargetValueDescriptor
                                        region={region}
                                        cond={cond.type}
                                        target={cond.targetId}
                                        value={cond.value}
                                    />
                                </div>
                            ))}
                        </>
                    ),
                },
                {
                    label: t("Individuality"),
                    value: mergeElements(
                        quest.individuality.map((trait) => (
                            <TraitDescription
                                key={trait.id}
                                region={region}
                                trait={trait}
                                owner="quests"
                                ownerParameter="fieldIndividuality"
                            />
                        )),
                        ", "
                    ),
                },
                {
                    label: t("Enemy Classes"),
                    value: mergeElements(
                        quest.className.map((className) => <ClassIcon key={className} className={className} />),
                        " "
                    ),
                },
                { label: t("Recommended Level"), value: quest.recommendLv },
                {
                    label: t("Battle BG ID"),
                    value: <Link to={`/${region}/quests?battleBgId=${quest.battleBgId}`}>{quest.battleBgId}</Link>,
                },
                {
                    label: "Raw",
                    value: (
                        <Row>
                            <Col>
                                <RawDataViewer key={`${region}-${quest.id}-${quest.phase}`} text="Nice" data={quest} />
                            </Col>
                            <Col>
                                <RawDataViewer
                                    key={`${region}-${quest.id}-${quest.phase}`}
                                    text="Raw"
                                    data={`${Host}/raw/${region}/quest/${quest.id}/${quest.phase}`}
                                />
                            </Col>
                        </Row>
                    ),
                },
            ]}
        />
    );
};

const QuestDrops = ({ region, drops }: { region: Region; drops: QuestEnemy.EnemyDrop[] }) => {
    if (drops.length === 0) {
        return <></>;
    }

    drops.sort((a, b) => a.type.localeCompare(b.type) || a.objectId - b.objectId || a.num - b.num);

    return <QuestDropDescriptor region={region} drops={drops} />;
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

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>) {
        if (this.props.id !== prevProps.id || this.state.phase !== prevState.phase) {
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
                <h1 lang={lang(this.props.region)}>{quest.name}</h1>

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
                        <QuestSubData region={this.props.region} quest={quest} />
                    </Col>
                </Row>
                {quest.messages.length > 0 ? (
                    <Alert variant="success" className="newline" lang={lang(this.props.region)}>
                        {quest.messages.length > 1 ? (
                            <ul className="mb-0">
                                {quest.messages.map((message) => (
                                    <li key={message.idx}>{colorString(message.message)}</li>
                                ))}
                            </ul>
                        ) : (
                            colorString(quest.messages[0].message)
                        )}
                    </Alert>
                ) : null}
                {quest.extraDetail.hintTitle ? (
                    <Alert variant="success" className="newline" lang={lang(this.props.region)}>
                        <b>{quest.extraDetail.hintTitle}</b>
                        <br />
                        {quest.extraDetail.hintMessage ? removePrefix(quest.extraDetail.hintMessage, "\n") : null}
                    </Alert>
                ) : null}
                {quest.scripts.length > 0 ? (
                    <Alert variant="success">
                        {quest.scripts.length > 1 ? (
                            <ul className="mb-0">
                                {sortScript(quest.scripts.map((script) => script.scriptId)).map((scriptId) => (
                                    <li key={scriptId}>
                                        <ScriptDescriptor region={this.props.region} scriptId={scriptId} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <ScriptDescriptor region={this.props.region} scriptId={quest.scripts[0].scriptId} />
                        )}
                    </Alert>
                ) : null}
                {quest.extraDetail.questSelect !== undefined &&
                quest.extraDetail.questSelect.filter((questId) => questId !== this.props.id).length > 0 ? (
                    <Alert variant="success">
                        {quest.extraDetail.questSelect.filter((questId) => questId !== this.props.id).length > 1
                            ? "Other versions"
                            : "Another version"}{" "}
                        this quest:
                        <ul className="mb-0">
                            {quest.extraDetail.questSelect
                                .filter((questId) => questId !== this.props.id)
                                .map((questId) => (
                                    <li key={questId}>
                                        {questId}:{" "}
                                        <QuestDescriptorId
                                            region={this.props.region}
                                            questId={questId}
                                            questPhase={this.state.phase}
                                        />
                                    </li>
                                ))}
                        </ul>
                    </Alert>
                ) : null}
                <QuestDrops region={this.props.region} drops={quest.drops} />
                {quest.restrictions.length > 0 ? (
                    <Alert variant="success">
                        <QuestRestriction region={this.props.region} questRestrictions={quest.restrictions} />
                    </Alert>
                ) : null}
                {quest.extraDetail.aiNpc !== undefined ? (
                    <Alert variant="success">
                        <b>NPC AI:</b>{" "}
                        <EntityDescriptor region={this.props.region} entity={quest.extraDetail.aiNpc.npc.svt} />{" "}
                        {quest.extraDetail.aiNpc.aiIds.map((aiId) => (
                            <AiDescriptor key={aiId} region={this.props.region} aiType={Ai.AiType.SVT} id={aiId} />
                        ))}
                    </Alert>
                ) : null}
                {quest.supportServants.length > 0 ? (
                    <>
                        {renderCollapsibleContent({
                            title: `${quest.isNpcOnly ? "Forced " : ""}Support Servant${
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
                        defaultActiveKey={this.props.stage !== undefined ? this.props.stage : 1}
                        onSelect={(key: string | null) => {
                            this.props.history.replace(
                                `/${this.props.region}/quest/${this.props.id}/${this.state.phase}` +
                                    (key ? `/stage-${key}` : "")
                            );
                        }}
                    >
                        {quest.stages.map((stage) => (
                            <Tab key={stage.wave} eventKey={stage.wave} title={`Stage ${stage.wave}`}>
                                <QuestStage region={this.props.region} stage={stage} />
                            </Tab>
                        ))}
                    </Tabs>
                ) : null}
            </div>
        );
    }
}

export default withRouter(QuestPage);
