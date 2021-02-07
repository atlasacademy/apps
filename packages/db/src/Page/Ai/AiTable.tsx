import { Ai, Region, Skill, Trait } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";
import React from "react";
import { Table } from "react-bootstrap";
import renderCollapsibleContent from "../../Component/CollapsibleContent";
import AiDescriptor from "../../Descriptor/AiDescriptor";
import { BuffIdDescriptor } from "../../Descriptor/BuffDescription";
import SkillDescriptor from "../../Descriptor/SkillDescriptor";
import TraitDescription from "../../Descriptor/TraitDescription";
import { mergeElements } from "../../Helper/OutputHelper";

const AI_COND_SUBJECT = new Map<Ai.AiCond, string>([
    [Ai.AiCond.CHECK_SELF_BUFF, "Self"],
    [Ai.AiCond.CHECK_PT_BUFF, "Party members"],
    [Ai.AiCond.CHECK_OPPONENT_BUFF, "Opponents"],
    [Ai.AiCond.CHECK_SELF_INDIVIDUALITY, "Self"],
    [Ai.AiCond.CHECK_PT_INDIVIDUALITY, "Party members"],
    [Ai.AiCond.CHECK_OPPONENT_INDIVIDUALITY, "Opponents"],
    [Ai.AiCond.CHECK_SELF_BUFF_INDIVIDUALITY, "Self"],
    [Ai.AiCond.CHECK_PT_BUFF_INDIVIDUALITY, "Party members"],
    [Ai.AiCond.CHECK_OPPONENT_BUFF_INDIVIDUALITY, "Opponents"],
]);

const AI_SUBJECT_PLURAL = new Map<string, boolean>([
    ["Self", false],
    ["Party members", true],
    ["Opponents", true],
]);

function AiCondition(props: {
    region: Region;
    cond: Ai.AiCond;
    condNegative: boolean;
    vals: number[];
}) {
    const [cond, condNegative, vals] = [
        props.cond,
        props.condNegative,
        props.vals,
    ];
    let subject = AI_COND_SUBJECT.get(cond);
    let have = "";
    if (subject !== undefined && AI_SUBJECT_PLURAL.get(subject)) {
        have = condNegative ? "don't have" : "have";
    } else {
        have = condNegative ? "doesn't have" : "has";
    }
    switch (cond) {
        case Ai.AiCond.HP_HIGHER:
            return (
                <>
                    HP {condNegative ? "< " : "≥ "}
                    {vals[0] / 10}%
                </>
            );
        case Ai.AiCond.HP_LOWER:
            return (
                <>
                    HP {condNegative ? "> " : "≤ "}
                    {vals[0] / 10}%
                </>
            );
        case Ai.AiCond.CHECK_SELF_BUFF:
        case Ai.AiCond.CHECK_PT_BUFF:
        case Ai.AiCond.CHECK_OPPONENT_BUFF:
            return (
                <>
                    {[subject, have].join(" ")}
                    &nbsp;{vals.length > 1 ? "buffs" : "buff"}&nbsp;
                    {mergeElements(
                        vals.map((val) => (
                            <BuffIdDescriptor
                                region={props.region}
                                buffId={val}
                            />
                        )),
                        ", "
                    )}
                </>
            );
        case Ai.AiCond.CHECK_SELF_INDIVIDUALITY:
        case Ai.AiCond.CHECK_PT_INDIVIDUALITY:
        case Ai.AiCond.CHECK_OPPONENT_INDIVIDUALITY:
        case Ai.AiCond.CHECK_SELF_BUFF_INDIVIDUALITY:
        case Ai.AiCond.CHECK_PT_BUFF_INDIVIDUALITY:
        case Ai.AiCond.CHECK_OPPONENT_BUFF_INDIVIDUALITY:
            return (
                <>
                    {[subject, have].join(" ")}
                    &nbsp;
                    {mergeElements(
                        vals.map((val) => (
                            <TraitDescription
                                region={props.region}
                                trait={val}
                            />
                        )),
                        ", "
                    )}
                    &nbsp;
                    {[
                        Ai.AiCond.CHECK_SELF_BUFF_INDIVIDUALITY,
                        Ai.AiCond.CHECK_PT_BUFF_INDIVIDUALITY,
                        Ai.AiCond.CHECK_OPPONENT_BUFF_INDIVIDUALITY,
                    ].includes(cond)
                        ? "buffs"
                        : ""}
                </>
            );
        default:
            return (
                <>
                    {condNegative ? "Not " : ""}
                    {toTitleCase(cond)}
                    {vals.length > 0 ? ": " : ""}
                    {vals.toString()}
                </>
            );
    }
}

function ActTarget(props: {
    region: Region;
    target: Ai.AiActTarget;
    targetIndividuality: Trait.Trait[];
}) {
    return (
        <>
            {toTitleCase(props.target)}
            {props.targetIndividuality.length > 0 ? " - " : ""}
            {mergeElements(
                props.targetIndividuality.map((trait) => (
                    <TraitDescription region={props.region} trait={trait} />
                )),
                " "
            )}
        </>
    );
}

function ActSkill(props: {
    region: Region;
    skill?: Skill.SkillBasic;
    skillLv?: number;
}) {
    if (props.skill && props.skillLv) {
        return (
            <>
                <SkillDescriptor
                    region={props.region}
                    skill={props.skill}
                    whiteSpace={"nowrap"}
                />
                &nbsp;Lv.&nbsp;{props.skillLv}
            </>
        );
    } else {
        return null;
    }
}

function NextAi(props: {
    region: Region;
    aiType: Ai.AiType;
    avals: number[];
    handleNavigateAiId?: (id: number) => void;
}) {
    if (props.avals.length >= 2 && props.avals[0] !== 0) {
        return (
            <AiDescriptor
                region={props.region}
                aiType={props.aiType}
                id={props.avals[0]}
            />
        );
    } else {
        return null;
    }
}

export default function AiTable(props: {
    region: Region;
    aiType: Ai.AiType;
    ais: Ai.Ai[];
    handleNavigateAiId?: (id: number) => void;
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
                            {ai.actNum === Ai.AiActNum.UNKNOWN
                                ? ai.actNumInt
                                : toTitleCase(ai.actNum)}
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
                            <AiCondition
                                region={props.region}
                                cond={ai.cond}
                                condNegative={ai.condNegative}
                                vals={ai.vals}
                            />
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
                            <ActTarget
                                region={props.region}
                                target={ai.aiAct.target}
                                targetIndividuality={
                                    ai.aiAct.targetIndividuality
                                }
                            />
                        </td>
                    ))}
                </tr>
                <tr>
                    <td style={{ fontWeight: "bold" }}>Act Skill</td>
                    {ais.map((ai) => (
                        <td key={ai.idx}>
                            <ActSkill
                                region={props.region}
                                skill={ai.aiAct.skill}
                                skillLv={ai.aiAct.skillLv}
                            />
                        </td>
                    ))}
                </tr>
                <tr>
                    <td style={{ fontWeight: "bold" }}>Next AI</td>
                    {ais.map((ai) => (
                        <td key={ai.idx}>
                            <NextAi
                                region={props.region}
                                aiType={props.aiType}
                                avals={ai.avals}
                                handleNavigateAiId={props.handleNavigateAiId}
                            />
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
