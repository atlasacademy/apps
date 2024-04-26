import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { CraftEssence, Quest, Region, SupportServant } from "@atlasacademy/api-connector";

import { AiAllocationDescriptor, findSupportAiAllocation } from "../Descriptor/AiAllocationDescriptor";
import CondTargetValueDescriptor from "../Descriptor/CondTargetValueDescriptor";
import CraftEssenceDescriptor from "../Descriptor/CraftEssenceDescriptor";
import EntityDescriptor from "../Descriptor/EntityDescriptor";
import SkillPopover from "../Descriptor/SkillPopover";
import TraitDescription from "../Descriptor/TraitDescription";
import { mergeElements } from "../Helper/OutputHelper";
import {
    QuestEnemyMainData,
    QuestEnemySubData,
    describeEnemyNoblePhantasm,
    describeEnemySkill,
    renderDoubleRow,
    renderSpanningRow,
} from "./QuestEnemy";

import "../Descriptor/Descriptor.css";
import "./QuestEnemy.css";

const SupportCraftEssenseLink = (props: { region: Region; craftEssence: CraftEssence.CraftEssence }) => {
    const { t } = useTranslation();
    const { region, craftEssence } = props;
    if (craftEssence.collectionNo === 0) {
        const faceUrl = craftEssence.extraAssets.equipFace.equip
                ? craftEssence.extraAssets.equipFace.equip[craftEssence.id]
                : undefined,
            title = `${t("Story Support CE")} ${craftEssence.id}`;
        return (
            <Link to={`/${region}/craft-essence/${craftEssence.id}`} className="descriptor-link">
                {faceUrl !== undefined ? (
                    <>
                        <img src={faceUrl} style={{ height: "1.5em" }} alt={title} />{" "}
                    </>
                ) : null}
                <span className="hover-text">
                    {title} <FontAwesomeIcon icon={faShare} />
                </span>
            </Link>
        );
    }
    return <CraftEssenceDescriptor region={region} craftEssence={craftEssence} />;
};

const SupportServantCE = ({
    region,
    supportServant,
}: {
    region: Region;
    supportServant: SupportServant.SupportServant;
}) => {
    const { t } = useTranslation();
    const craftEssense = supportServant.equips[0];
    const craftEsseseSkills =
        craftEssense === undefined
            ? []
            : craftEssense.equip.skills.filter(
                  (skill) => craftEssense.lv >= skill.condLv && craftEssense.limitCount >= skill.condLimitCount
              );
    return (
        <>
            {supportServant.equips.length > 0
                ? renderSpanningRow({
                      title: t("Craft Essence"),
                      content: (
                          <>
                              <SupportCraftEssenseLink region={region} craftEssence={craftEssense.equip} /> LB{" "}
                              {craftEssense.limitCount} Lv. {craftEssense.lv}
                          </>
                      ),
                  })
                : null}
            {craftEsseseSkills.length > 0
                ? renderSpanningRow({
                      title: t("Craft Essence Skills"),
                      content: mergeElements(
                          craftEsseseSkills.map((skill) => <SkillPopover region={region} skill={skill} />),
                          <br />
                      ),
                  })
                : null}
        </>
    );
};

const SupportServantMainData = (props: { region: Region; supportServant: SupportServant.SupportServant }) => {
    const { region, supportServant } = props;
    const { t } = useTranslation();
    return (
        <Table bordered responsive className="quest-svt-data-table">
            <tbody>
                {renderDoubleRow([
                    {
                        title: t("ATK"),
                        content: supportServant.atk.toLocaleString(),
                    },
                    {
                        title: t("HP"),
                        content: supportServant.hp.toLocaleString(),
                    },
                ])}
                {supportServant.skills.skillId1 !== 0
                    ? renderSpanningRow({
                          title: t("Skill 1"),
                          content: describeEnemySkill(
                              region,
                              supportServant.skills.skillId1,
                              supportServant.skills.skillLv1,
                              supportServant.skills.skill1
                          ),
                      })
                    : null}
                {supportServant.skills.skillId2 !== 0
                    ? renderSpanningRow({
                          title: t("Skill 2"),
                          content: describeEnemySkill(
                              region,
                              supportServant.skills.skillId2,
                              supportServant.skills.skillLv2,
                              supportServant.skills.skill2
                          ),
                      })
                    : null}
                {supportServant.skills.skillId3 !== 0
                    ? renderSpanningRow({
                          title: t("Skill 3"),
                          content: describeEnemySkill(
                              region,
                              supportServant.skills.skillId3,
                              supportServant.skills.skillLv3,
                              supportServant.skills.skill3
                          ),
                      })
                    : null}
                {supportServant.noblePhantasm.noblePhantasmId !== 0
                    ? renderSpanningRow({
                          title: t("Noble Phantasm"),
                          content: describeEnemyNoblePhantasm(
                              region,
                              supportServant.noblePhantasm.noblePhantasmId,
                              supportServant.noblePhantasm.noblePhantasmLv,
                              supportServant.noblePhantasm.noblePhantasm
                          ),
                      })
                    : null}
                <SupportServantCE region={region} supportServant={supportServant} />
            </tbody>
        </Table>
    );
};

const SupportServantSubData = ({
    region,
    supportServant,
    stages,
}: {
    region: Region;
    supportServant: SupportServant.SupportServant;
    stages: Quest.Stage[];
}) => {
    const { t } = useTranslation();
    const traitDescriptions = supportServant.traits.map((trait) => (
        <TraitDescription
            region={region}
            trait={trait}
            overrideTraits={[{ id: supportServant.svt.id, name: t("Self") }]}
        />
    ));
    return (
        <Table bordered responsive className="quest-svt-data-table">
            <tbody>
                {traitDescriptions.length > 0
                    ? renderSpanningRow({
                          title: t("Traits"),
                          content: mergeElements(traitDescriptions, ", "),
                      })
                    : null}
                {supportServant.releaseConditions.length > 0
                    ? renderSpanningRow({
                          title: t("Release Conditions"),
                          content: mergeElements(
                              supportServant.releaseConditions.map((cond) => (
                                  <CondTargetValueDescriptor
                                      region={region}
                                      cond={cond.type}
                                      target={cond.targetId}
                                      value={cond.value}
                                  />
                              )),
                              <br />
                          ),
                      })
                    : null}
                {stages &&
                    findSupportAiAllocation(supportServant.svt.traits, stages).length > 0 &&
                    renderSpanningRow({
                        title: t("AI"),
                        content: (
                            <AiAllocationDescriptor
                                region={region}
                                traits={supportServant.svt.traits.concat(supportServant.traits)}
                                stages={stages}
                            />
                        ),
                    })}
            </tbody>
        </Table>
    );
};

const SupportServantTable = ({
    region,
    supportServant,
    stages,
}: {
    region: Region;
    supportServant: SupportServant.SupportServant;
    stages: Quest.Stage[];
}) => {
    return (
        <>
            <h4>
                {supportServant.id}.{" "}
                <EntityDescriptor
                    region={region}
                    entity={supportServant.svt}
                    overwriteName={supportServant.name === "NONE" ? supportServant.svt.name : supportServant.name}
                    iconHeight={40}
                />{" "}
                <span className="quest-svt-lv">Lv. {supportServant.lv}</span>
            </h4>
            <Row className="quest-svt-tables">
                <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                    {supportServant.detail ? (
                        <QuestEnemyMainData
                            region={region}
                            enemy={supportServant.detail}
                            supportDetail={true}
                            extraRows={<SupportServantCE region={region} supportServant={supportServant} />}
                        />
                    ) : (
                        <SupportServantMainData region={region} supportServant={supportServant} />
                    )}
                </Col>
                <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                    {supportServant.detail ? (
                        <QuestEnemySubData
                            region={region}
                            enemy={supportServant.detail}
                            enemyLookUp={new Map()}
                            supportDetail={true}
                            stages={stages}
                        />
                    ) : (
                        <SupportServantSubData region={region} supportServant={supportServant} stages={stages} />
                    )}
                </Col>
            </Row>
        </>
    );
};

const SupportServantTables = ({
    region,
    supportServants,
    stages,
}: {
    region: Region;
    supportServants: SupportServant.SupportServant[];
    stages: Quest.Stage[];
}) => {
    return (
        <>
            {supportServants.map((supportServant) => (
                <SupportServantTable
                    key={supportServant.id}
                    region={region}
                    supportServant={supportServant}
                    stages={stages}
                />
            ))}
        </>
    );
};

export default SupportServantTables;
