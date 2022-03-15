import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Region, SupportServant, CraftEssence } from "@atlasacademy/api-connector";

import CondTargetValueDescriptor from "../Descriptor/CondTargetValueDescriptor";
import CraftEssenceDescriptor from "../Descriptor/CraftEssenceDescriptor";
import EntityDescriptor from "../Descriptor/EntityDescriptor";
import SkillPopover from "../Descriptor/SkillPopover";
import TraitDescription from "../Descriptor/TraitDescription";
import { mergeElements } from "../Helper/OutputHelper";
import { describeEnemyNoblePhantasm, describeEnemySkill, renderDoubleRow, renderSpanningRow } from "./QuestEnemy";

import "../Descriptor/Descriptor.css";
import "./QuestEnemy.css";

const SupportCraftEssenseLink = (props: { region: Region; craftEssence: CraftEssence.CraftEssence }) => {
    const { region, craftEssence } = props;
    if (craftEssence.collectionNo === 0) {
        const faceUrl = craftEssence.extraAssets.equipFace.equip
                ? craftEssence.extraAssets.equipFace.equip[craftEssence.id]
                : undefined,
            title = `Story Support CE ${craftEssence.id}`;
        return (
            <Link to={`/${region}/enemy/${craftEssence.id}`} className="descriptor-link">
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

const SupportServantMainData = (props: { region: Region; supportServant: SupportServant.SupportServant }) => {
    const { region, supportServant } = props;
    const craftEssense = supportServant.equips[0];
    const craftEsseseSkills =
        craftEssense === undefined
            ? []
            : craftEssense.equip.skills.filter(
                  (skill) => craftEssense.lv >= skill.condLv && craftEssense.limitCount >= skill.condLimitCount
              );
    return (
        <Table bordered responsive className="quest-svt-data-table">
            <tbody>
                {renderDoubleRow([
                    {
                        title: "ATK",
                        content: supportServant.atk.toLocaleString(),
                    },
                    {
                        title: "HP",
                        content: supportServant.hp.toLocaleString(),
                    },
                ])}
                {supportServant.skills.skillId1 !== 0
                    ? renderSpanningRow({
                          title: "Skill 1",
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
                          title: "Skill 2",
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
                          title: "Skill 3",
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
                          title: "Noble Phantasm",
                          content: describeEnemyNoblePhantasm(
                              region,
                              supportServant.noblePhantasm.noblePhantasmId,
                              supportServant.noblePhantasm.noblePhantasmLv,
                              supportServant.noblePhantasm.noblePhantasm
                          ),
                      })
                    : null}
                {supportServant.equips.length > 0
                    ? renderSpanningRow({
                          title: "Craft Essense",
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
                          title: "Craft Essense Skills",
                          content: mergeElements(
                              craftEsseseSkills.map((skill) => <SkillPopover region={region} skill={skill} />),
                              <br />
                          ),
                      })
                    : null}
            </tbody>
        </Table>
    );
};

const SupportServantSubData = (props: { region: Region; supportServant: SupportServant.SupportServant }) => {
    const { region, supportServant } = props;
    const traitDescriptions = supportServant.traits.map((trait) => (
        <TraitDescription
            region={region}
            trait={trait}
            overrideTraits={[{ id: supportServant.svt.id, name: `Self` }]}
        />
    ));
    return (
        <Table bordered responsive className="quest-svt-data-table">
            <tbody>
                {traitDescriptions.length > 0
                    ? renderSpanningRow({
                          title: "Traits",
                          content: mergeElements(traitDescriptions, ", "),
                      })
                    : null}
                {supportServant.releaseConditions.length > 0
                    ? renderSpanningRow({
                          title: "Release Conditions",
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
            </tbody>
        </Table>
    );
};

const SupportServantTable = (props: { region: Region; supportServant: SupportServant.SupportServant }) => {
    const { region, supportServant } = props;
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
                    <SupportServantMainData region={region} supportServant={supportServant} />
                </Col>
                <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                    <SupportServantSubData region={region} supportServant={supportServant} />
                </Col>
            </Row>
        </>
    );
};

const SupportServantTables = (props: { region: Region; supportServants: SupportServant.SupportServant[] }) => {
    const { region, supportServants } = props;
    return (
        <>
            {supportServants.map((supportServant) => (
                <SupportServantTable key={supportServant.id} region={region} supportServant={supportServant} />
            ))}
        </>
    );
};

export default SupportServantTables;
