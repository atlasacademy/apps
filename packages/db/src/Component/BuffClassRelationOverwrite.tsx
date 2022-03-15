import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

import { Buff, ClassName } from "@atlasacademy/api-connector";

import Api from "../Api";
import ClassIcon from "./ClassIcon";

import "./BuffClassRelationOverwrite.css";

const OverwriteIcon = ({ overwriteType }: { overwriteType: Buff.ClassRelationOverwriteType }) => {
    switch (overwriteType) {
        case Buff.ClassRelationOverwriteType.OVERWRITE_MORE_THAN_TARGET:
            return <FontAwesomeIcon icon={faArrowUp} title="OVERWRITE_MORE_THAN_TARGET" />;
        case Buff.ClassRelationOverwriteType.OVERWRITE_LESS_THAN_TARGET:
            return <FontAwesomeIcon icon={faArrowDown} title="OVERWRITE_LESS_THAN_TARGET" />;
        default:
            return <></>;
    }
};

const SideRelationOverwrite = ({
    sideRelations,
    classIds,
}: {
    sideRelations: Record<ClassName, Record<ClassName, Buff.RelationOverwriteDetail>>;
    classIds: Map<ClassName, number>;
}) => {
    if (Object.keys(sideRelations).length === 0) {
        return <> None</>;
    }

    const attackers = Object.keys(sideRelations) as ClassName[];
    const defenderSet: Set<ClassName> = new Set();
    for (const attacker of Object.values(sideRelations)) {
        for (const defender of Object.keys(attacker)) {
            defenderSet.add(defender as ClassName);
        }
    }
    const defenders = Array.from(defenderSet);
    const sortByClassId = (a: ClassName, b: ClassName) => (classIds.get(a) ?? 1) - (classIds.get(b) ?? 0);
    attackers.sort(sortByClassId);
    defenders.sort(sortByClassId);

    return (
        <>
            <Table bordered hover responsive className="classRelationTable">
                <thead>
                    <tr>
                        <td>
                            <b>Attacker&nbsp;→</b>
                            <br />
                            <b>Defender&nbsp;↓</b>
                        </td>
                        {attackers.map((attacker) => (
                            <td key={attacker}>
                                <ClassIcon className={attacker} textFallback={true} />
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {defenders.map((defender) => (
                        <tr key={defender}>
                            <td>
                                <ClassIcon className={defender} textFallback={true} />
                            </td>
                            {attackers.map((attacker) => {
                                const attackerRel = sideRelations[attacker];
                                if (attackerRel !== undefined) {
                                    const defenderRel = attackerRel[defender];
                                    if (defenderRel !== undefined) {
                                        return (
                                            <td key={attacker}>
                                                {defenderRel.damageRate / 1000}
                                                <OverwriteIcon overwriteType={defenderRel.type} />
                                            </td>
                                        );
                                    }
                                }
                                return <td key={attacker}></td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

const BuffClassRelationOverwrite = ({ relations }: { relations: Buff.BuffRelationOverwrite }) => {
    const [classIds, setClassIds] = useState<Map<ClassName, number>>(new Map());

    useEffect(() => {
        Api.enumList().then((enums) => {
            const classIds: Map<ClassName, number> = new Map();
            for (const [key, value] of Object.entries(enums.SvtClass)) {
                classIds.set(value, parseInt(key));
            }
            setClassIds(classIds);
        });
    }, []);

    return (
        <>
            <h4>Class Affinity Change</h4>
            <b>When attacking:</b>
            <SideRelationOverwrite sideRelations={relations.atkSide} classIds={classIds} />
            <br />
            <b>When defending:</b>
            <SideRelationOverwrite sideRelations={relations.defSide} classIds={classIds} />
        </>
    );
};

export default BuffClassRelationOverwrite;
