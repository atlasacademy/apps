import React from "react";
import { Alert, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Ai, Quest, QuestEnemy, Region } from "@atlasacademy/api-connector";

import AiDescriptor from "../Descriptor/AiDescriptor";
import EntityDescriptor from "../Descriptor/EntityDescriptor";
import renderCollapsibleContent from "./CollapsibleContent";
import { QuestEnemyMainData, QuestEnemySubData } from "./QuestEnemy";

const BasicAiNpcDescriptor = ({
    region,
    aiNpc,
    iconHeight,
}: {
    region: Region;
    aiNpc: Quest.QuestPhaseAiNpc;
    iconHeight?: number;
}) => {
    return (
        <>
            <EntityDescriptor region={region} entity={aiNpc.npc.svt} iconHeight={iconHeight} />{" "}
            {aiNpc.aiIds.map((aiId) => (
                <AiDescriptor
                    key={aiId}
                    region={region}
                    aiType={Ai.AiType.SVT}
                    id={aiId}
                    skill1={aiNpc.detail?.skills.skill1?.id}
                    skill2={aiNpc.detail?.skills.skill2?.id}
                    skill3={aiNpc.detail?.skills.skill3?.id}
                />
            ))}
        </>
    );
};

const AiNpcDetailTable = ({ region, enemy }: { region: Region; enemy: QuestEnemy.QuestEnemy }) => {
    return (
        <Row className="quest-svt-tables">
            <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                <QuestEnemyMainData region={region} enemy={enemy} />
            </Col>
            <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                <QuestEnemySubData region={region} enemy={enemy} enemyLookUp={new Map()} />
            </Col>
        </Row>
    );
};

const QuestAiNpc = ({ region, aiNpcs }: { region: Region; aiNpcs: Quest.QuestPhaseAiNpc[] }) => {
    const { t } = useTranslation();

    if (aiNpcs.length === 1) {
        const aiNpc = aiNpcs[0];
        if (aiNpc.detail === undefined) {
            return (
                <Alert variant="success">
                    <b>{t("AI NPC")}:</b> <BasicAiNpcDescriptor region={region} aiNpc={aiNpc} />
                </Alert>
            );
        }

        return (
            <>
                {renderCollapsibleContent({
                    title: (
                        <>
                            {t("AI NPC")}: <BasicAiNpcDescriptor region={region} aiNpc={aiNpc} iconHeight={40} />
                        </>
                    ),
                    content: <AiNpcDetailTable region={region} enemy={aiNpc.detail} />,
                    subheader: true,
                    initialOpen: false,
                })}
            </>
        );
    }

    const multiNpcContent = (
        <>
            {aiNpcs.map((aiNpc) => (
                <React.Fragment key={aiNpc.npc.npcId}>
                    <h3>
                        <BasicAiNpcDescriptor key={aiNpc.npc.npcId} region={region} aiNpc={aiNpc} iconHeight={40} />
                    </h3>
                    {aiNpc.detail !== undefined && (
                        <AiNpcDetailTable key={aiNpc.npc.npcId} region={region} enemy={aiNpc.detail} />
                    )}
                </React.Fragment>
            ))}
        </>
    );

    return (
        <>
            {renderCollapsibleContent({
                title: t("AI NPC"),
                content: multiNpcContent,
                subheader: true,
                initialOpen: false,
            })}
        </>
    );
};

export default QuestAiNpc;
