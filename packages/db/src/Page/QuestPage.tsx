import { Quest, Region } from "@atlasacademy/api-connector";
import { AxiosError } from "axios";
import React from "react";
import { Col, Pagination, Row, Tab, Tabs } from "react-bootstrap";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import Api, { Host } from "../Api";
import ClassIcon from "../Component/ClassIcon";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import QuestStage from "../Component/QuestStage";
import RawDataViewer from "../Component/RawDataViewer";
import CondTargetValueDescriptor from "../Descriptor/CondTargetValueDescriptor";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import QuestConsumeDescriptor from "../Descriptor/QuestConsumeDescriptor";
import TraitDescription from "../Descriptor/TraitDescription";
import { WarDescriptorId } from "../Descriptor/WarDescriptor";
import { mergeElements } from "../Helper/OutputHelper";
import Manager from "../Setting/Manager";

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
    setPhase: (phase: number) => void;
}) => {
    const currentPhase = props.quest.phase,
        phases = props.quest.phases;
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
    setPhase: (phase: number) => void;
}) => {
    const quest = props.quest;
    return (
        <DataTable
            data={{
                ID: quest.id,
                Phases: (
                    <PhaseNavigator
                        region={props.region}
                        quest={quest}
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
                War: (
                    <WarDescriptorId
                        region={props.region}
                        warId={quest.warId}
                    />
                ),
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
                        <TraitDescription region={props.region} trait={trait} />
                    )),
                    ", "
                ),
                "Enemy Classes": mergeElements(
                    quest.className.map((className) => (
                        <ClassIcon className={className} />
                    )),
                    " "
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
        this.loadQuest();
    }

    async loadQuest() {
        try {
            this.props.history.replace(
                `/${this.props.region}/quest/${this.props.id}/${this.state.phase}`
            );
            const quest = await Api.questPhase(this.props.id, this.state.phase);

            this.setState({
                loading: false,
                quest: quest,
            });
            document.title = `[${this.props.region}] Quest - ${quest.name} - Atlas Academy DB`;
        } catch (e) {
            this.setState({
                error: e,
            });
        }
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
                            setPhase={(phase) => {
                                this.setState({ phase: phase });
                                this.loadQuest();
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
                <Tabs
                    defaultActiveKey={this.props.stage ?? "stage-1"}
                    onSelect={(key: string | null) => {
                        this.props.history.replace(
                            `/${this.props.region}/quest/${this.props.id}/${this.state.phase}/${key}`
                        );
                    }}
                >
                    {quest.stages.map((stage) => (
                        <Tab
                            key={stage.wave}
                            eventKey={`stage-${stage.wave}`}
                            title={`Stage ${stage.wave}`}
                        >
                            <QuestStage
                                region={this.props.region}
                                stage={stage}
                            />
                        </Tab>
                    ))}
                </Tabs>
            </div>
        );
    }
}

export default withRouter(QuestPage);
