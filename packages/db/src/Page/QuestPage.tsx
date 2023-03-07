import { AxiosError } from "axios";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { Quest, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import renderCollapsibleContent from "../Component/CollapsibleContent";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import QuestAiNpc from "../Component/QuestAiNpc";
import QuestRestriction from "../Component/QuestRestriction";
import QuestStage from "../Component/QuestStage";
import SupportServantTables from "../Component/SupportServant";
import { QuestDescriptorId } from "../Descriptor/QuestDescriptor";
import ScriptDescriptor, { sortScript } from "../Descriptor/ScriptDescriptor";
import { colorString, removePrefix } from "../Helper/StringHelper";
import Manager, { lang } from "../Setting/Manager";
import QuestDrops from "./Quest/QuestDrops";
import QuestMainData from "./Quest/QuestMainData";
import QuestSubData from "./Quest/QuestSubData";

import "../Helper/StringHelper.css";

interface IProps extends RouteComponentProps, WithTranslation {
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
        const { t } = this.props;

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
                        {t("Alternative version based on choices in the story")}:
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
                {quest.extraDetail.aiNpc !== undefined || quest.extraDetail.aiMultiNpc !== undefined ? (
                    <QuestAiNpc
                        region={this.props.region}
                        aiNpcs={(quest.extraDetail.aiNpc !== undefined ? [quest.extraDetail.aiNpc] : []).concat(
                            quest.extraDetail.aiMultiNpc ?? []
                        )}
                    />
                ) : null}
                {quest.supportServants.length > 0 ? (
                    <>
                        {renderCollapsibleContent({
                            title: quest.isNpcOnly
                                ? t("Forced Support Servant", { count: quest.supportServants.length })
                                : t("Support Servant", { count: quest.supportServants.length }),
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

export default withTranslation()(withRouter(QuestPage));
