import {
    faGift,
    faInfoCircle,
    faPhone,
    faShare,
    faShieldHeart,
    faSkull,
    faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import quantile from "@stdlib/stats-base-dists-t-quantile";
import { Alert, Button, Col, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Ai, NoblePhantasm, Quest, QuestEnemy, Region, Skill } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import ClassIcon from "../Component/ClassIcon";
import FaceIcon from "../Component/FaceIcon";
import { AiAllocationDescriptor, findSupportAiAllocation } from "../Descriptor/AiAllocationDescriptor";
import AiDescriptor from "../Descriptor/AiDescriptor";
import EntityDescriptor from "../Descriptor/EntityDescriptor";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import NoblePhantasmPopover from "../Descriptor/NoblePhantasmPopover";
import shortenQuestHash from "../Descriptor/QuestHashDescriptor";
import SkillPopover from "../Descriptor/SkillPopover";
import { SvtClassDescriptor } from "../Descriptor/SvtClassDestriptor";
import { SvtAttrDescriptor } from "../Descriptor/SvttAttrDestriptor";
import TraitDescription from "../Descriptor/TraitDescription";
import { getEnemyCalcString } from "../Helper/CalcString";
import { numToPct } from "../Helper/NumberHelper";
import { Renderable, asPercent, mergeElements } from "../Helper/OutputHelper";
import { OrdinalNumeral } from "../Helper/StringHelper";
import Manager from "../Setting/Manager";
import CopyToClipboard from "./CopyToClipboard";

import "./QuestEnemy.css";

type RenderableRow = {
    title: Renderable;
    content: Renderable;
};

type EnemyLookUp = Map<string, QuestEnemy.QuestEnemy>;

export const hashEnemy = (enemy: QuestEnemy.QuestEnemy) => `${enemy.deck}-${enemy.npcId}`;

export function renderDoubleRow(content: [RenderableRow, RenderableRow]): Renderable {
    return (
        <tr>
            <th className="w-25pct align-middle">{content[0].title}</th>
            <td className="w-25pct align-middle">{content[0].content}</td>
            <th className="w-25pct align-middle">{content[1].title}</th>
            <td className="w-25pct align-middle">{content[1].content}</td>
        </tr>
    );
}

export function renderSpanningRow(content: RenderableRow): Renderable {
    return (
        <tr>
            <th className="align-middle">{content.title}</th>
            <td colSpan={3} className="align-middle">
                {content.content}
            </td>
        </tr>
    );
}

export function describeEnemySkill(region: Region, skillId: number, skillLv: number, skill?: Skill.Skill) {
    if (skillId === 0) {
        return "None";
    } else {
        if (skill !== undefined) {
            return (
                <>
                    <SkillPopover region={region} skill={skill} /> Lv. {skillLv}
                </>
            );
        } else {
            return `Skill ${skillId} Lv. ${skillLv}`;
        }
    }
}

export function describeEnemyNoblePhantasm(
    region: Region,
    noblePhantasmId: number,
    noblePhantasmLv: number,
    noblePhantasm?: NoblePhantasm.NoblePhantasm
) {
    if (noblePhantasmId === 0) {
        return "None";
    } else {
        if (noblePhantasm !== undefined) {
            return (
                <>
                    <NoblePhantasmPopover region={region} noblePhantasm={noblePhantasm} /> Lv. {noblePhantasmLv}
                </>
            );
        } else {
            return `Skill ${noblePhantasmId} Lv. ${noblePhantasmLv}`;
        }
    }
}

function describeMultipleSkills(region: Region, skills: Skill.Skill[]) {
    const skillDescriptions = skills.map((skill) => <SkillPopover region={region} skill={skill} />);
    return mergeElements(skillDescriptions, <br />);
}

const DeckTypeDescriptor = ({ deckType }: { deckType: QuestEnemy.DeckType }) => {
    switch (deckType) {
        case QuestEnemy.DeckType.ENEMY:
            return <FontAwesomeIcon icon={faSkull} title="Enemy Deck" />;
        case QuestEnemy.DeckType.SHIFT:
            return <FontAwesomeIcon icon={faShieldHeart} title="Shift Deck" />;
        case QuestEnemy.DeckType.TRANSFORM:
            return <FontAwesomeIcon icon={faWandMagicSparkles} title="Transform Deck" />;
        case QuestEnemy.DeckType.CALL:
            return <FontAwesomeIcon icon={faPhone} title="Call Deck" />;
        default:
            return <>{toTitleCase(deckType)}</>;
    }
};

function EnemyNpcDescription(props: {
    region: Region;
    enemyLookUp: EnemyLookUp;
    deck?: QuestEnemy.DeckType;
    npcId?: number;
    hash?: string;
    handleNavigateEnemyHash?: (hash: string) => void;
}) {
    const hash = props.hash ?? `${props.deck}-${props.npcId}`;
    const enemy = props.enemyLookUp.get(hash);
    if (enemy !== undefined) {
        return (
            <Button variant="link" className="reset-button-style" onClick={() => props.handleNavigateEnemyHash?.(hash)}>
                <DeckTypeDescriptor deckType={enemy.deck} /> {enemy.deckId}.{" "}
                <ClassIcon className={enemy.svt.className} rarity={enemy.svt.rarity} />{" "}
                <FaceIcon
                    type={enemy.svt.type}
                    rarity={enemy.svt.rarity}
                    location={enemy.svt.face}
                    mightNotExist={true}
                />{" "}
                {enemy.name} Lv. {enemy.lv}
            </Button>
        );
    } else {
        return <>Enemy {props.npcId}</>;
    }
}

function EnemyNpcListDescription(props: {
    region: Region;
    deck: QuestEnemy.DeckType;
    npcIds: number[];
    enemyLookUp: EnemyLookUp;
    handleNavigateEnemyHash?: (hash: string) => void;
}) {
    const enemyDescriptions = props.npcIds.map((npcId, index) => (
        <EnemyNpcDescription
            region={props.region}
            deck={props.deck}
            npcId={npcId}
            enemyLookUp={props.enemyLookUp}
            handleNavigateEnemyHash={props.handleNavigateEnemyHash}
        />
    ));
    return <>{mergeElements(enemyDescriptions, <br />)}</>;
}

export const QuestEnemyMainData = (props: {
    region: Region;
    enemy: QuestEnemy.QuestEnemy;
    supportDetail?: boolean;
    extraRows?: React.ReactNode;
}) => {
    const { region, enemy } = props,
        isSupportDetail = props.supportDetail ?? false;
    const { t } = useTranslation();
    return (
        <Table bordered responsive className="quest-svt-data-table">
            <tbody>
                {renderDoubleRow([
                    { title: "ATK", content: enemy.atk.toLocaleString() },
                    { title: "HP", content: enemy.hp.toLocaleString() },
                ])}
                {renderDoubleRow([
                    {
                        title: t("Death rate"),
                        content: asPercent(enemy.deathRate, 1),
                    },
                    {
                        title: t("Crit rate"),
                        content: asPercent(enemy.criticalRate, 1),
                    },
                ])}
                {!isSupportDetail &&
                    renderDoubleRow([
                        {
                            title: t("NP bar"),
                            content: `${enemy.chargeTurn} bar${enemy.chargeTurn > 1 ? "s" : ""}`,
                        },
                        {
                            title: t("NP gain mod"),
                            content: asPercent(enemy.serverMod.tdRate, 1),
                        },
                    ])}
                {!isSupportDetail &&
                    renderDoubleRow([
                        {
                            title: t("Crit star mod"),
                            content: asPercent(enemy.serverMod.starRate, 1),
                        },
                        {
                            title: t("Defense NP gain mod"),
                            content: asPercent(enemy.serverMod.tdAttackRate, 1),
                        },
                    ])}
                {enemy.skills.skillId1 !== 0
                    ? renderSpanningRow({
                          title: t("Skill 1"),
                          content: describeEnemySkill(
                              region,
                              enemy.skills.skillId1,
                              enemy.skills.skillLv1,
                              enemy.skills.skill1
                          ),
                      })
                    : null}
                {enemy.skills.skillId2 !== 0
                    ? renderSpanningRow({
                          title: t("Skill 2"),
                          content: describeEnemySkill(
                              region,
                              enemy.skills.skillId2,
                              enemy.skills.skillLv2,
                              enemy.skills.skill2
                          ),
                      })
                    : null}
                {enemy.skills.skillId3 !== 0
                    ? renderSpanningRow({
                          title: t("Skill 3"),
                          content: describeEnemySkill(
                              region,
                              enemy.skills.skillId3,
                              enemy.skills.skillLv3,
                              enemy.skills.skill3
                          ),
                      })
                    : null}
                {enemy.noblePhantasm.noblePhantasmId !== 0
                    ? renderSpanningRow({
                          title: t("Noble Phantasm"),
                          content: describeEnemyNoblePhantasm(
                              region,
                              enemy.noblePhantasm.noblePhantasmId,
                              enemy.noblePhantasm.noblePhantasmLv,
                              enemy.noblePhantasm.noblePhantasm
                          ),
                      })
                    : null}
                {enemy.classPassive.classPassive.length > 0
                    ? renderSpanningRow({
                          title: t("Class Passive"),
                          content: describeMultipleSkills(region, enemy.classPassive.classPassive),
                      })
                    : null}
                {enemy.classPassive.addPassive.length > 0
                    ? renderSpanningRow({
                          title: t("Extra Passive"),
                          content: describeMultipleSkills(region, enemy.classPassive.addPassive),
                      })
                    : null}
                {props.extraRows}
            </tbody>
        </Table>
    );
};

export const QuestEnemySubData = ({
    region,
    enemy,
    enemyLookUp,
    handleNavigateEnemyHash,
    supportDetail,
    stages,
}: {
    region: Region;
    enemy: QuestEnemy.QuestEnemy;
    enemyLookUp: EnemyLookUp;
    handleNavigateEnemyHash?: (hash: string) => void;
    supportDetail?: boolean;
    stages?: Quest.Stage[];
}) => {
    const traitDescriptions = enemy.traits
        .sort((a, b) => a.id - b.id)
        .map((trait) => (
            <TraitDescription
                className="text-nowrap mx-0p5"
                key={trait.id}
                region={region}
                trait={trait}
                overrideTraits={[{ id: enemy.svt.id, name: `Self` }]}
            />
        ));
    const { t } = useTranslation();
    const isSupportDetail = supportDetail ?? false;
    return (
        <Table bordered responsive className="quest-svt-data-table">
            <tbody>
                {renderSpanningRow({
                    title: t("Class"),
                    content: <SvtClassDescriptor svtClass={enemy.svt.className} />,
                })}
                {renderSpanningRow({
                    title: t("Attribute"),
                    content: <SvtAttrDescriptor attribute={enemy.svt.attribute} />,
                })}
                {renderSpanningRow({
                    title: t("Traits"),
                    content: <>{traitDescriptions}</>,
                })}
                {!isSupportDetail &&
                    renderSpanningRow({
                        title: t("AI"),
                        content: (
                            <AiDescriptor
                                region={region}
                                aiType={Ai.AiType.SVT}
                                id={enemy.ai.aiId}
                                skill1={enemy.skills.skillId1}
                                skill2={enemy.skills.skillId2}
                                skill3={enemy.skills.skillId3}
                            />
                        ),
                    })}
                {isSupportDetail &&
                    stages &&
                    findSupportAiAllocation(enemy.traits, stages).length > 0 &&
                    renderSpanningRow({
                        title: t("AI"),
                        content: (
                            <AiAllocationDescriptor
                                region={region}
                                traits={enemy.traits}
                                stages={stages}
                                skill1={enemy.skills.skillId1}
                                skill2={enemy.skills.skillId2}
                                skill3={enemy.skills.skillId3}
                            />
                        ),
                    })}
                {!isSupportDetail &&
                    renderDoubleRow([
                        { title: t("Act Priority"), content: enemy.ai.actPriority },
                        { title: t("Max Act Num"), content: enemy.ai.maxActNum },
                    ])}
                {enemy.enemyScript.call && enemy.enemyScript.call.length > 0
                    ? renderSpanningRow({
                          title: t("Summon"),
                          content: (
                              <EnemyNpcListDescription
                                  region={region}
                                  npcIds={enemy.enemyScript.call}
                                  deck={QuestEnemy.DeckType.CALL}
                                  enemyLookUp={enemyLookUp}
                                  handleNavigateEnemyHash={handleNavigateEnemyHash}
                              />
                          ),
                      })
                    : null}
                {enemy.enemyScript.shift && enemy.enemyScript.shift.length > 0
                    ? renderSpanningRow({
                          title: t("Break bar"),
                          content: (
                              <EnemyNpcListDescription
                                  region={region}
                                  npcIds={enemy.enemyScript.shift}
                                  deck={QuestEnemy.DeckType.SHIFT}
                                  enemyLookUp={enemyLookUp}
                                  handleNavigateEnemyHash={handleNavigateEnemyHash}
                              />
                          ),
                      })
                    : null}
                {enemy.enemyScript.change && enemy.enemyScript.change.length > 0
                    ? renderSpanningRow({
                          title: t("Transform"),
                          content: (
                              <EnemyNpcListDescription
                                  region={region}
                                  npcIds={enemy.enemyScript.change}
                                  deck={QuestEnemy.DeckType.CHANGE}
                                  enemyLookUp={enemyLookUp}
                                  handleNavigateEnemyHash={handleNavigateEnemyHash}
                              />
                          ),
                      })
                    : null}
                {enemy.enemyScript.leader
                    ? renderSpanningRow({
                          title: "Leader",
                          content: "Battle ends if servant is defeated",
                      })
                    : null}
            </tbody>
        </Table>
    );
};

export const QuestDropDescriptor = ({
    region,
    drops,
    questHash,
    questHashAverageGoTo,
}: {
    region: Region;
    drops: QuestEnemy.EnemyDrop[];
    questHash?: string | "average";
    questHashAverageGoTo?: () => void;
}) => {
    const { t } = useTranslation();

    return (
        <>
            {questHash !== undefined ? (
                questHash === "average" ? (
                    <div className="mb-3">{t("Average drop rates accross all enemy versions")}</div>
                ) : (
                    <div className="mb-3">
                        {t("Drop rates for enemy version")} <code>{shortenQuestHash(questHash)}</code>.{" "}
                        <Button
                            variant="link"
                            style={{ verticalAlign: "baseline", padding: 0 }}
                            onClick={() => {
                                if (questHashAverageGoTo !== undefined) questHashAverageGoTo();
                            }}
                        >
                            {t("Show average drop dates from all enemy versions")}&nbsp;
                            <FontAwesomeIcon icon={faShare} />
                        </Button>
                    </div>
                )
            ) : null}
            <ul className="mb-0">
                {drops.map((drop) => {
                    const dummyGift = {
                        ...drop,
                        id: 0,
                        priority: 0,
                        giftAdds: [],
                    };
                    let ciText = <></>;
                    if (drop.runs > 1) {
                        const c = quantile(0.975, drop.runs - 1);
                        const stdDevOverRuns = Math.sqrt(drop.dropVariance / drop.runs);
                        const lower = drop.dropExpected - c * stdDevOverRuns;
                        const upper = drop.dropExpected + c * stdDevOverRuns;
                        ciText = (
                            <>
                                <br />
                                95% CI: {numToPct(lower)} – {numToPct(upper)}
                            </>
                        );
                    }
                    const tooltip = (
                        <Tooltip id={`drop-detail-tooltip`} style={{ fontSize: "1em" }}>
                            {drop.dropCount.toLocaleString()} drops / {drop.runs.toLocaleString()} runs
                            {ciText}
                        </Tooltip>
                    );
                    return (
                        <li key={`${drop.type}-${drop.objectId}-${drop.num}`}>
                            <GiftDescriptor region={region} gift={dummyGift} />:{" "}
                            <span>{numToPct(drop.dropExpected)}</span>{" "}
                            <OverlayTrigger overlay={tooltip}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </OverlayTrigger>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

export interface FromToEntry {
    shiftFrom: string;
    shiftTo: number;
    index: number;
}

const QuestEnemyTable = (props: {
    region: Region;
    enemy: QuestEnemy.QuestEnemy;
    enemyLookUp: EnemyLookUp;
    callEntries: { caller: string; callee: number }[];
    shiftEntries: FromToEntry[];
    changeEntries: FromToEntry[];
    handleNavigateEnemyHash?: (hash: string) => void;
}) => {
    const enemy = props.enemy,
        region = props.region,
        { t } = useTranslation();

    const callerDescription =
        enemy.deck === QuestEnemy.DeckType.CALL
            ? props.callEntries
                  .filter((call) => call.callee === enemy.npcId)
                  .map((call) => (
                      <li key={`${call.caller}-${call.callee}`}>
                          Can be summoned by{" "}
                          <EnemyNpcDescription
                              region={region}
                              hash={call.caller}
                              enemyLookUp={props.enemyLookUp}
                              handleNavigateEnemyHash={props.handleNavigateEnemyHash}
                          />
                      </li>
                  ))
            : null;

    const shiftOriginDescription =
        enemy.deck === QuestEnemy.DeckType.SHIFT
            ? props.shiftEntries
                  .filter((shift) => shift.shiftTo === enemy.npcId)
                  .map((shift) => (
                      <li key={`${shift.shiftFrom}-${shift.shiftTo}-${shift.index}`}>
                          <OrdinalNumeral index={shift.index + 2} /> break bar of{" "}
                          <EnemyNpcDescription
                              region={region}
                              hash={shift.shiftFrom}
                              enemyLookUp={props.enemyLookUp}
                              handleNavigateEnemyHash={props.handleNavigateEnemyHash}
                          />
                      </li>
                  ))
            : null;

    const changeOriginDescription =
        enemy.deck === QuestEnemy.DeckType.CHANGE
            ? props.changeEntries
                  .filter((change) => change.shiftTo === enemy.npcId)
                  .map((change) => (
                      <li key={`${change.shiftFrom}-${change.shiftTo}-${change.index}`}>
                          <OrdinalNumeral index={change.index + 1} /> transformation of{" "}
                          <EnemyNpcDescription
                              region={region}
                              hash={change.shiftFrom}
                              enemyLookUp={props.enemyLookUp}
                              handleNavigateEnemyHash={props.handleNavigateEnemyHash}
                          />
                      </li>
                  ))
            : null;

    return (
        <>
            <h3>
                <DeckTypeDescriptor deckType={enemy.deck} /> {enemy.deckId}.{" "}
                <EntityDescriptor region={region} entity={enemy.svt} overwriteName={enemy.name} iconHeight={40} />{" "}
                <span className="quest-svt-lv">
                    Lv. {enemy.lv}
                    {enemy.infoScript.isAddition ? (
                        <>
                            {" "}
                            [&nbsp;
                            <FontAwesomeIcon icon={faGift} />
                            &nbsp;
                            {t("Spawn Bonus Enemy")}]
                        </>
                    ) : (
                        ""
                    )}
                </span>
                {Manager.calcStringEnabled() && (
                    <span className="ml-3">
                        <CopyToClipboard text={getEnemyCalcString(enemy)} title={t("Copy calc string to clipboard")} />
                    </span>
                )}
            </h3>
            <ul>
                {callerDescription}
                {shiftOriginDescription}
                {changeOriginDescription}
            </ul>

            {enemy.drops.length > 0 && (
                <Alert variant="success">
                    <QuestDropDescriptor region={region} drops={enemy.drops} />
                </Alert>
            )}

            <Row className="quest-svt-tables">
                <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                    <QuestEnemyMainData region={region} enemy={enemy} />
                </Col>
                <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                    <QuestEnemySubData
                        region={region}
                        enemy={enemy}
                        enemyLookUp={props.enemyLookUp}
                        handleNavigateEnemyHash={props.handleNavigateEnemyHash}
                    />
                </Col>
            </Row>
        </>
    );
};

export default QuestEnemyTable;
