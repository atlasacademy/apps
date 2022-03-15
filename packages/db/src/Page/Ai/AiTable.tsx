import { Button, Table } from "react-bootstrap";

import { Ai, Region, Skill, Trait } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import renderCollapsibleContent from "../../Component/CollapsibleContent";
import AiDescriptor from "../../Descriptor/AiDescriptor";
import { BuffIdDescriptor } from "../../Descriptor/BuffDescription";
import SkillPopover, { SkillPopOverId } from "../../Descriptor/SkillPopover";
import TraitDescription from "../../Descriptor/TraitDescription";
import { mergeElements } from "../../Helper/OutputHelper";

import "../../Component/MoveButton.css";
import "./AiTable.css";

enum SUBJECT {
    SELF = "Self",
    OPPONENT = "Opponents",
    PT = "Party members",
    PT_ALL = "All party members (including reserve)",
}

const AI_COND_SUBJECT = new Map<Ai.AiCond, SUBJECT>([
    [Ai.AiCond.CHECK_SELF_BUFF, SUBJECT.SELF],
    [Ai.AiCond.CHECK_PT_BUFF, SUBJECT.PT],
    [Ai.AiCond.CHECK_OPPONENT_BUFF, SUBJECT.OPPONENT],
    [Ai.AiCond.CHECK_SELF_INDIVIDUALITY, SUBJECT.SELF],
    [Ai.AiCond.CHECK_SELF_BUFF_ACTIVE, SUBJECT.SELF],
    [Ai.AiCond.CHECK_OPPONENT_BUFF_ACTIVE, SUBJECT.OPPONENT],
    [Ai.AiCond.CHECK_PT_INDIVIDUALITY, SUBJECT.PT],
    [Ai.AiCond.CHECK_PT_ALL_INDIVIDUALITY, SUBJECT.PT_ALL],
    [Ai.AiCond.CHECK_OPPONENT_INDIVIDUALITY, SUBJECT.OPPONENT],
    [Ai.AiCond.CHECK_SELF_BUFF_INDIVIDUALITY, SUBJECT.SELF],
    [Ai.AiCond.CHECK_PT_BUFF_INDIVIDUALITY, SUBJECT.PT],
    [Ai.AiCond.CHECK_OPPONENT_BUFF_INDIVIDUALITY, SUBJECT.OPPONENT],
]);

const AI_SUBJECT_PLURAL = new Map<SUBJECT, boolean>([
    [SUBJECT.SELF, false],
    [SUBJECT.PT, true],
    [SUBJECT.OPPONENT, true],
    [SUBJECT.PT_ALL, true],
]);

function AiCondition(props: { region: Region; cond: Ai.AiCond; condNegative: boolean; vals: number[] }) {
    const [cond, condNegative, vals] = [props.cond, props.condNegative, props.vals];
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
        case Ai.AiCond.CHECK_PT_ALL_BUFF:
        case Ai.AiCond.CHECK_OPPONENT_BUFF:
        case Ai.AiCond.CHECK_SELF_BUFF_ACTIVE:
        case Ai.AiCond.CHECK_OPPONENT_BUFF_ACTIVE:
            return (
                <>
                    {[subject, have].join(" ")}
                    &nbsp;{vals.length > 1 ? "buffs" : "buff"}&nbsp;
                    {mergeElements(
                        vals.map((val) => <BuffIdDescriptor region={props.region} buffId={val} />),
                        ", "
                    )}
                </>
            );
        case Ai.AiCond.CHECK_SELF_INDIVIDUALITY:
        case Ai.AiCond.CHECK_PT_INDIVIDUALITY:
        case Ai.AiCond.CHECK_PT_ALL_INDIVIDUALITY:
        case Ai.AiCond.CHECK_OPPONENT_INDIVIDUALITY:
            return (
                <>
                    {[subject, have].join(" ")}
                    &nbsp;
                    {mergeElements(
                        vals.map((val) => <TraitDescription region={props.region} trait={val} />),
                        ", "
                    )}
                </>
            );
        case Ai.AiCond.CHECK_SELF_BUFF_INDIVIDUALITY:
        case Ai.AiCond.CHECK_PT_BUFF_INDIVIDUALITY:
        case Ai.AiCond.CHECK_PT_ALL_BUFF_INDIVIDUALITY:
        case Ai.AiCond.CHECK_OPPONENT_BUFF_INDIVIDUALITY:
            return (
                <>
                    {[subject, have].join(" ")}
                    &nbsp;
                    {mergeElements(
                        vals.map((val) => (
                            <TraitDescription region={props.region} trait={val} owner="buffs" ownerParameter="vals" />
                        )),
                        ", "
                    )}
                    &nbsp; buffs
                </>
            );
        case Ai.AiCond.ACTCOUNT_THISTURN:
            return <>Act Count: {vals[0]}</>;
        case Ai.AiCond.TURN_AND_ACTCOUNT_THISTURN:
            return (
                <>
                    Turn {vals[0]} and Act Count: {vals[1]}
                </>
            );
        case Ai.AiCond.CHECK_OPPONENT_HEIGHT_NPGAUGE:
            return (
                <>
                    Any opponent's NP gauge {condNegative ? "<" : "≥"} {vals[0] / 100}%
                </>
            );
        case Ai.AiCond.CHECK_SELF_NPTURN:
            return (
                <>
                    Self needs {vals[0]} turn{vals[0] > 1 ? "s" : ""} to NP
                </>
            );
        default:
            return (
                <>
                    {condNegative ? "Not " : ""}
                    {toTitleCase(cond)}
                    {vals.length > 0 ? ": [" : ""}
                    {vals.toString()}
                    {vals.length > 0 ? "]" : ""}
                </>
            );
    }
}

function AiActType(props: {
    region: Region;
    type: Ai.AiActType;
    skillId1?: number;
    skillId2?: number;
    skillId3?: number;
}) {
    const region = props.region,
        type = props.type;
    switch (type) {
        case Ai.AiActType.SKILL_RANDOM:
            return <>Random skill</>;
        case Ai.AiActType.SKILL1:
            if (props.skillId1 !== undefined) {
                return <SkillPopOverId region={region} skillId={props.skillId1} />;
            } else {
                return <>Skill 1</>;
            }
        case Ai.AiActType.SKILL2:
            if (props.skillId2 !== undefined) {
                return <SkillPopOverId region={region} skillId={props.skillId2} />;
            } else {
                return <>Skill 2</>;
            }
        case Ai.AiActType.SKILL3:
            if (props.skillId3 !== undefined) {
                return <SkillPopOverId region={region} skillId={props.skillId3} />;
            } else {
                return <>Skill 3</>;
            }
        default:
            return <>{toTitleCase(type)}</>;
    }
}

function ActTarget(props: {
    region: Region;
    target: Ai.AiActTarget;
    targetIndividuality: Trait.Trait[];
    handleNavigateAiId?: (id: number) => void;
}) {
    return (
        <>
            {toTitleCase(props.target)}
            {props.targetIndividuality.length > 0 ? " - " : ""}
            {mergeElements(
                props.targetIndividuality.map((trait) => <TraitDescription region={props.region} trait={trait} />),
                " "
            )}
        </>
    );
}

function ActSkill(props: { region: Region; skill?: Skill.Skill; skillLv?: number }) {
    if (props.skill && props.skillLv) {
        return (
            <>
                <SkillPopover region={props.region} skill={props.skill} />
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
            <Button variant="link" className="move-button" onClick={() => props.handleNavigateAiId?.(props.avals[0])}>
                {AiDescriptor.renderAsString(props.aiType, props.avals[0])}
            </Button>
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
    skillId1?: number;
    skillId2?: number;
    skillId3?: number;
}) {
    const ais = props.ais;
    const outputTable = (
        <Table responsive className={"ai-info"} style={{ whiteSpace: "nowrap" }} key={props.ais[0].id}>
            <thead>
                <tr>
                    <th>AI Sub ID</th>
                    {ais.map((ai) => (
                        <td key={ai.idx}>
                            {ai.idx}
                            {ai.infoText !== "" ? ` – ${ai.infoText}` : null}
                        </td>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Act Num</td>
                    {ais.map((ai) => (
                        <td key={ai.idx}>
                            {ai.actNum === Ai.AiActNum.UNKNOWN ? ai.actNumInt : toTitleCase(ai.actNum)}
                        </td>
                    ))}
                </tr>
                <tr>
                    <td>Priority|Weight</td>
                    {ais.map((ai) => (
                        <td key={ai.idx}>
                            {ai.priority}|{ai.probability}
                        </td>
                    ))}
                </tr>
                <tr>
                    <td>Condition</td>
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
                    <td>Act Type</td>
                    {ais.map((ai) => (
                        <td key={ai.idx}>
                            <AiActType
                                region={props.region}
                                type={ai.aiAct.type}
                                skillId1={props.skillId1}
                                skillId2={props.skillId2}
                                skillId3={props.skillId3}
                            />
                        </td>
                    ))}
                </tr>
                <tr>
                    <td>Act Target</td>
                    {ais.map((ai) => (
                        <td key={ai.idx}>
                            <ActTarget
                                region={props.region}
                                target={ai.aiAct.target}
                                targetIndividuality={ai.aiAct.targetIndividuality}
                            />
                        </td>
                    ))}
                </tr>
                <tr>
                    <td>Act Skill</td>
                    {ais.map((ai) => (
                        <td key={ai.idx}>
                            <ActSkill region={props.region} skill={ai.aiAct.skill} skillLv={ai.aiAct.skillLv} />
                        </td>
                    ))}
                </tr>
                <tr>
                    <td>Next AI</td>
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
