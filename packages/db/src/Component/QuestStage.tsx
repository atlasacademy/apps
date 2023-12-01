import { useRef } from "react";
import { Alert, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Ai, Quest, Region } from "@atlasacademy/api-connector";

import AiDescriptor from "../Descriptor/AiDescriptor";
import BgmDescriptor from "../Descriptor/BgmDescriptor";
import SkillDescriptor from "../Descriptor/SkillDescriptor";
import { getStageCalcString } from "../Helper/CalcString";
import { numToPct } from "../Helper/NumberHelper";
import { mergeElements } from "../Helper/OutputHelper";
import QuestDrops from "../Page/Quest/QuestDrops";
import Manager from "../Setting/Manager";
import CopyToClipboard from "./CopyToClipboard";
import QuestEnemyTable, { FromToEntry, hashEnemy } from "./QuestEnemy";

const QuestStage = (props: { region: Region; stage: Quest.Stage }) => {
    const { region, stage } = props,
        { t } = useTranslation();
    const fieldAiDescriptions = stage.fieldAis.map((ai) => (
        <AiDescriptor region={props.region} aiType={Ai.AiType.FIELD} id={ai.id} />
    ));

    const enemyLookUp = new Map(stage.enemies.map((enemy) => [hashEnemy(enemy), enemy]));

    const enemyRefs = useRef<Map<string, HTMLDivElement> | null>(null);

    const callEntries: { caller: string; callee: number }[] = [];
    for (const enemy of stage.enemies) {
        if (enemy.enemyScript.call) {
            for (const npcId of new Set(enemy.enemyScript.call)) {
                callEntries.push({ caller: hashEnemy(enemy), callee: npcId });
            }
        }
    }

    const shiftEntries: FromToEntry[] = [];
    for (const enemy of stage.enemies) {
        if (enemy.enemyScript.shift) {
            for (const [npcId, index] of enemy.enemyScript.shift.entries()) {
                shiftEntries.push({
                    shiftFrom: hashEnemy(enemy),
                    shiftTo: npcId,
                    index,
                });
            }
        }
    }

    const changeEntries: FromToEntry[] = [];
    for (const enemy of stage.enemies) {
        if (enemy.enemyScript.change) {
            for (const [npcId, index] of enemy.enemyScript.change.entries()) {
                changeEntries.push({
                    shiftFrom: hashEnemy(enemy),
                    shiftTo: npcId,
                    index,
                });
            }
        }
    }

    const getEnemyRefs = () => {
        if (!enemyRefs.current) {
            enemyRefs.current = new Map();
        }
        return enemyRefs.current;
    };

    const scrollToEnemy = (enemyHash: string) => {
        const refMap = getEnemyRefs();
        const element = refMap.get(enemyHash);
        if (element !== undefined) element.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div>
            <div className="my-3 mx-0 lh-3">
                <b>BGM:</b> <BgmDescriptor region={props.region} bgm={stage.bgm} showLink={true} />
                {stage.fieldAis.length >= 1 ? (
                    <>
                        <br />
                        <b>Field AI:</b> {mergeElements(fieldAiDescriptions, " ")}
                    </>
                ) : null}
                {stage.waveStartMovies.length > 0 ? (
                    <>
                        <br />
                        <b>Movie:</b>
                        <br />
                        <Row>
                            {stage.waveStartMovies.map((movie, index) => (
                                <Col key={index} md={12} lg={6}>
                                    <video controls width="100%">
                                        <source src={movie.waveStartMovie} type="video/mp4" />
                                    </video>
                                </Col>
                            ))}
                        </Row>
                    </>
                ) : null}
                {stage.enemyFieldPosCount && (
                    <div>
                        <b>Number of enemies appearing at the same time:</b> {stage.enemyFieldPosCount}
                    </div>
                )}
                {Manager.calcStringEnabled() && (
                    <div>
                        <b>{t("Stage calc string")}:</b>{" "}
                        <CopyToClipboard
                            text={getStageCalcString(Manager.calcStringType(), stage.enemies, {
                                waveSize: stage.enemyFieldPosCount,
                            })}
                            title={t("Copy stage calc string to clipboard")}
                        />
                    </div>
                )}
                {stage.cutin !== undefined && (
                    <Alert variant="success" className="my-3 lh-1p5">
                        <b>{t("Cut-in random appearance:")}</b>
                        <ul className="mb-0">
                            <li>
                                {t("Skills")}
                                <ul>
                                    {stage.cutin.skills.map((skill) => (
                                        <li key={skill.skill.id}>
                                            <SkillDescriptor region={region} skill={skill.skill} />:{" "}
                                            {numToPct(skill.appearCount / (stage.cutin?.runs ?? 1))}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li>
                                {t("Drops")}
                                <QuestDrops region={region} drops={stage.cutin.drops} />
                            </li>
                        </ul>
                    </Alert>
                )}
            </div>

            {stage.enemies.map((enemy) => (
                <div
                    ref={(node) => {
                        const enemyHash = hashEnemy(enemy);
                        const map = getEnemyRefs();
                        if (node) {
                            map.set(enemyHash, node);
                        } else {
                            map.delete(enemyHash);
                        }
                    }}
                    key={`${enemy.deck}-${enemy.npcId}-${enemy.userSvtId}-${enemy.uniqueId}`}
                >
                    <QuestEnemyTable
                        region={props.region}
                        enemy={enemy}
                        enemyLookUp={enemyLookUp}
                        callEntries={callEntries}
                        shiftEntries={shiftEntries}
                        changeEntries={changeEntries}
                        handleNavigateEnemyHash={scrollToEnemy}
                    />
                </div>
            ))}
        </div>
    );
};

export default QuestStage;
