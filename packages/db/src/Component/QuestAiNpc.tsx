import { Alert, Col, Row } from "react-bootstrap";

import { Ai, Quest, Region } from "@atlasacademy/api-connector";

import AiDescriptor from "../Descriptor/AiDescriptor";
import EntityDescriptor from "../Descriptor/EntityDescriptor";
import renderCollapsibleContent from "./CollapsibleContent";
import { QuestEnemyMainData, QuestEnemySubData } from "./QuestEnemy";

const QuestAiNpc = ({ region, aiNpc }: { region: Region; aiNpc: Quest.QuestPhaseAiNpc }) => {
    const entityDescription = (
        <>
            <EntityDescriptor region={region} entity={aiNpc.npc.svt} />{" "}
            {aiNpc.aiIds.map((aiId) => (
                <AiDescriptor key={aiId} region={region} aiType={Ai.AiType.SVT} id={aiId} />
            ))}
        </>
    );

    if (aiNpc.detail !== undefined) {
        return (
            <>
                {renderCollapsibleContent({
                    title: <>NPC AI: {entityDescription}</>,
                    content: (
                        <>
                            <Row className="quest-svt-tables">
                                <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                                    <QuestEnemyMainData region={region} enemy={aiNpc.detail} />
                                </Col>
                                <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                                    <QuestEnemySubData region={region} enemy={aiNpc.detail} enemyLookUp={new Map()} />
                                </Col>
                            </Row>
                        </>
                    ),
                    subheader: true,
                    initialOpen: false,
                })}
            </>
        );
    }

    return (
        <Alert variant="success">
            <b>NPC AI:</b> {entityDescription}
        </Alert>
    );
};

export default QuestAiNpc;
