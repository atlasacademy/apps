import React from "react";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Func, NoblePhantasm, Region, Skill } from "@atlasacademy/api-connector";

import { isPlayerSideFunction } from "../Helper/FuncHelper";
import Manager from "../Setting/Manager";
import EffectBreakdownLines from "./EffectBreakdownLines";

interface IProps {
    region: Region;
    cooldowns?: number[];
    funcs: Func.Func[];
    triggerSkillIdStack?: number[];
    gain?: NoblePhantasm.NoblePhantasmGain;
    levels?: number;
    scripts?: Skill.SkillScript;
    popOver?: boolean;
    additionalSkillId?: number[];
    tableTitle?: string;
    condBranchSkillInfo?: Skill.CondBranchSkillInfo[];
    hideEnemyFunctions?: boolean;
}

function EffectBreakdown(props: IProps) {
    let hideEnemy = props.hideEnemyFunctions !== undefined ? props.hideEnemyFunctions : Manager.hideEnemyFunctions();
    const { t } = useTranslation();
    return (
        <Table responsive>
            <thead>
                <tr>
                    <th>
                        {props.tableTitle ?? t("Effect")} {hideEnemy && <>(enemies hidden)</>}
                    </th>
                    {props.levels
                        ? Array.from(Array(props.levels).keys()).map((level) => {
                              return <td key={level}>{level + 1}</td>;
                          })
                        : null}
                </tr>
            </thead>
            <tbody>
                <EffectBreakdownLines
                    region={props.region}
                    cooldowns={props.cooldowns}
                    funcs={props.funcs.filter((func) => {
                        if (!hideEnemy) return true;
                        return isPlayerSideFunction(func);
                    })}
                    triggerSkillIdStack={props.triggerSkillIdStack ?? []}
                    gain={props.gain}
                    level={props.levels}
                    scripts={props.scripts}
                    popOver={props.popOver}
                    condBranchSkillInfo={props.condBranchSkillInfo}
                    additionalSkillId={props.additionalSkillId}
                />
            </tbody>
        </Table>
    );
}

export default EffectBreakdown;
