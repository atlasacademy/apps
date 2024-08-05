import { DataVal, Func, Region } from "@atlasacademy/api-connector";

import { areIdenticalSets } from "../../Helper/ArrayHelper";
import { mergeElements } from "../../Helper/OutputHelper";
import { MergeElementsOr } from "../MultipleDescriptors";
import { FuncDescriptorSections } from "./FuncDescriptorSections";

const RANGE_DIRECTION = ["<=", "<", ">=", ">"] as const;
type RANGE_TYPE = (typeof RANGE_DIRECTION)[number];

interface RangeInfo {
    value: number;
    direction: RANGE_TYPE;
}

const parseRange = (range: string): RangeInfo | undefined => {
    let value: number | undefined = undefined,
        direction: string | undefined = undefined;

    const lessThanMatch = range.match(/(\d+)(<=|<)/);
    if (lessThanMatch) {
        value = parseInt(lessThanMatch[1]);
        switch (lessThanMatch[2]) {
            case "<=":
                direction = ">=";
                break;
            case "<":
                direction = ">";
                break;
        }
    }

    const moreThanMatch = range.match(/(<=|<)(\d+)/);
    if (moreThanMatch) {
        value = parseInt(moreThanMatch[2]);
        direction = moreThanMatch[1];
    }

    if (value !== undefined && direction !== undefined) {
        for (const d of RANGE_DIRECTION) {
            if (d === direction) {
                return { value, direction };
            }
        }
    }

    return undefined;
};

const describeRange = (range: RangeInfo, transformValue?: (value: number) => number): string => {
    const transformedValue = transformValue !== undefined ? transformValue(range.value) : range.value;
    switch (range.direction) {
        case "<":
            return `< ${transformedValue}`;
        case "<=":
            return `≤ ${transformedValue}`;
        case ">":
            return `> ${transformedValue}`;
        case ">=":
            return `≥  ${transformedValue}`;
    }
};

export const RangesDescription = ({
    ranges,
    transformValue,
}: {
    ranges: string[];
    transformValue?: (value: number) => number;
}) => {
    const parsed = ranges.map((r) => parseRange(r)).filter((r) => r !== undefined);

    if (
        parsed.length === 2 &&
        parsed[0].value === parsed[1].value &&
        areIdenticalSets(new Set(parsed.map((p) => p.direction)), new Set([">=", "<="]))
    ) {
        return <>is {transformValue !== undefined ? transformValue(parsed[0].value) : parsed[0].value}</>;
    }

    return (
        <>
            {mergeElements(
                parsed.map((p) => describeRange(p, transformValue)),
                " and "
            )}
        </>
    );
};

export default function handleConditionSection(
    region: Region,
    sections: FuncDescriptorSections,
    func: Func.BasicFunc,
    dataVal: DataVal.DataVal
): void {
    const section = sections.condition,
        parts = section.parts;

    if (dataVal.StarHigher !== undefined) parts.push(`[${dataVal.StarHigher}+ Critical Stars]`);

    const triggeredHpDataval = dataVal.TriggeredTargetHpRange ?? dataVal.TriggeredTargetHpRateRange;
    if (triggeredHpDataval !== undefined) {
        const compareKey = "<",
            rawValue = triggeredHpDataval.replace(compareKey, ""),
            hpValue = dataVal.TriggeredTargetHpRange !== undefined ? `${rawValue}HP` : `${parseInt(rawValue) / 10}%`;

        let direction = "";
        if (triggeredHpDataval[0] === compareKey) {
            direction = "below";
        } else if (triggeredHpDataval.endsWith(compareKey)) {
            direction = "above";
        }

        parts.push(`If targets' HPs are ${direction} ${hpValue},`);
    }

    if (dataVal.FriendShipAbove !== undefined) {
        parts.push(`If servant's bond level is above ${dataVal.FriendShipAbove},`);
    }

    if (dataVal.StartingPosition !== undefined) {
        parts.push(
            <>
                If servant's starting position is{" "}
                <MergeElementsOr elements={dataVal.StartingPosition} lastJoinWord="or" />,
            </>
        );
    }

    if (dataVal.CheckOverChargeStageRange) {
        parts.push(
            <>
                If Overcharge level{" "}
                <RangesDescription
                    ranges={dataVal.CheckOverChargeStageRange}
                    transformValue={(val: number) => val + 1}
                />
                ,
            </>
        );
    }

    if (dataVal.CheckBattlePointPhaseRange) {
        parts.push(
            <>
                If Master Affection lvl{" "}
                <RangesDescription ranges={dataVal.CheckBattlePointPhaseRange.map((bp) => bp.range).flat()} />,
            </>
        );
    }
}
