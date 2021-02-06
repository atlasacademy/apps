import { Ai, Region, Skill, Trait } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";
import React from "react";
import { Table } from "react-bootstrap";
import renderCollapsibleContent from "../../Component/CollapsibleContent";
import AiDescriptor from "../../Descriptor/AiDescriptor";
import SkillDescriptor from "../../Descriptor/SkillDescriptor";
import TraitDescription from "../../Descriptor/TraitDescription";
import { mergeElements } from "../../Helper/OutputHelper";

function renderActTarget(
  region: Region,
  target: Ai.AiActTarget,
  targetIndividuality: Trait.Trait[]
) {
  return (
    <>
      {toTitleCase(target)}
      {targetIndividuality.length > 0 ? " - " : ""}
      {mergeElements(
        targetIndividuality.map((trait) => (
          <TraitDescription region={region} trait={trait} />
        )),
        " "
      )}
    </>
  );
}

function renderActSkill(
  region: Region,
  skill?: Skill.SkillBasic,
  skillLv?: number
) {
  if (skill && skillLv) {
    return (
      <>
        <SkillDescriptor region={region} skill={skill} whiteSpace={"nowrap"} />
        &nbsp;Lv.&nbsp;{skillLv}
      </>
    );
  } else {
    return "";
  }
}

function renderNextAi(region: Region, aiType: Ai.AiType, avals: number[]) {
  if (avals.length >= 2 && avals[0] !== 0) {
    return (
      <>
        <AiDescriptor region={region} aiType={aiType} id={avals[0]} /> -{" "}
        {avals[1]}
      </>
    );
  } else {
    return "";
  }
}

export default function AiTable(props: {
  region: Region;
  aiType: Ai.AiType;
  ais: Ai.Ai[];
}) {
  const ais = props.ais;
  const outputTable = (
    <Table
      responsive
      className={"ai-info"}
      style={{ whiteSpace: "nowrap" }}
      key={props.ais[0].id}
    >
      <thead style={{ fontWeight: "bold" }}>
        <tr>
          <th>AI Sub ID</th>
          {ais.map((ai) => (
            <td key={ai.idx}>{ai.idx}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ fontWeight: "bold" }}>Act Num</td>
          {ais.map((ai) => (
            <td key={ai.idx}>
              {ai.actNumInt} - {toTitleCase(ai.actNum)}
            </td>
          ))}
        </tr>
        <tr>
          <td style={{ fontWeight: "bold" }}>Priority/Probability</td>
          {ais.map((ai) => (
            <td key={ai.idx}>
              {ai.priority}/{ai.probability}
            </td>
          ))}
        </tr>
        <tr>
          <td style={{ fontWeight: "bold" }}>Condition</td>
          {ais.map((ai) => (
            <td key={ai.idx}>
              {ai.condNegative ? "Not " : ""}
              {toTitleCase(ai.cond)}
              {ai.vals.length > 0 ? ": " : ""}
              {ai.vals.toString()}
            </td>
          ))}
        </tr>
        <tr>
          <td style={{ fontWeight: "bold" }}>Act Type</td>
          {ais.map((ai) => (
            <td key={ai.idx}>{toTitleCase(ai.aiAct.type)}</td>
          ))}
        </tr>
        <tr>
          <td style={{ fontWeight: "bold" }}>Act Target</td>
          {ais.map((ai) => (
            <td key={ai.idx}>
              {renderActTarget(
                props.region,
                ai.aiAct.target,
                ai.aiAct.targetIndividuality
              )}
            </td>
          ))}
        </tr>
        <tr>
          <td style={{ fontWeight: "bold" }}>Act Skill</td>
          {ais.map((ai) => (
            <td key={ai.idx}>
              {renderActSkill(props.region, ai.aiAct.skill, ai.aiAct.skillLv)}
            </td>
          ))}
        </tr>
        <tr>
          <td style={{ fontWeight: "bold" }}>Change AI ID</td>
          {ais.map((ai) => (
            <td key={ai.idx}>
              {renderNextAi(props.region, props.aiType, ai.avals)}
            </td>
          ))}
        </tr>
      </tbody>
    </Table>
  );
  return renderCollapsibleContent({
    title: `AI ${ais[0].id}`,
    content: outputTable,
    subheader: false,
  });
}
