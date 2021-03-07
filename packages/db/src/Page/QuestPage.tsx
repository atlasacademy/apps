import { Quest, Region } from "@atlasacademy/api-connector";
import { AxiosError } from "axios";
import React from "react";
import { Col, Row } from "react-bootstrap";
import Api, { Host } from "../Api";
import ClassIcon from "../Component/ClassIcon";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import QuestConsumeDescriptor from "../Descriptor/QuestConsumeDescriptor";
import TraitDescription from "../Descriptor/TraitDescription";
import { WarDescriptorId } from "../Descriptor/WarDescriptor";
import { mergeElements } from "../Helper/OutputHelper";
import CondTargetValueDescriptor from "../Descriptor/CondTargetValueDescriptor";
import Manager from "../Setting/Manager";

export const QuestTypeDescription = new Map([
    [Quest.QuestType.MAIN, "Main"],
    [Quest.QuestType.FREE, "Free"],
    [Quest.QuestType.FRIENDSHIP, "Interlude"],
    [Quest.QuestType.EVENT, "Event"],
    [Quest.QuestType.HERO_BALLAD, "Hero Ballad"],
    [Quest.QuestType.WAR_BOARD, "War Board"],
]);

interface IProps {
    region: Region;
    id: number;
    phase: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    quest?: Quest.QuestPhase;
}

const QuestMainData = (props: { region: Region; quest: Quest.QuestPhase }) => {
    const quest = props.quest;
    return (
        <DataTable
            data={{
                ID: quest.id,
                Phase: quest.phase,
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
                        {mergeElements(
                            quest.releaseConditions.map((cond) => (
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
                            )),
                            <br />
                        )}
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
            loading: true,
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadQuest();
    }

    async loadQuest() {
        try {
            const quest = await Api.questPhase(this.props.id, this.props.phase);

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
                        />
                    </Col>
                    <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                        <QuestSubData
                            region={this.props.region}
                            quest={quest}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default QuestPage;
