import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DataVal, Func, Region } from "@atlasacademy/api-connector";

import { FuncDescriptorSections } from "./FuncDescriptorSections";

export default function handleDurationSection(
    region: Region,
    sections: FuncDescriptorSections,
    func: Func.BasicFunc,
    dataVal: DataVal.DataVal
): void {
    const section = sections.duration,
        parts = section.parts,
        shortDescription =
            func.funcType === Func.FuncType.ADD_STATE_SHORT ? (
                <>
                    {" "}
                    <FontAwesomeIcon icon={faStopwatch} title="Short Duration Buff" />
                </>
            ) : (
                <></>
            );

    if (dataVal.Count && dataVal.Count > 0 && dataVal.Turn && dataVal.Turn > 0) {
        const countDesc = dataVal.Count === 1 ? "1 Time" : `${dataVal.Count} Times`,
            turnDesc = dataVal.Turn === 1 ? "1 Turn" : `${dataVal.Turn} Turns`;

        parts.push(
            <>
                ({countDesc}, {turnDesc}
                {shortDescription})
            </>
        );
    } else if (dataVal.Turn && dataVal.Turn > 0) {
        parts.push(
            <>
                ({dataVal.Turn} Turn{dataVal.Turn > 1 ? "s" : ""}
                {shortDescription})
            </>
        );
    } else if (dataVal.Count && dataVal.Count > 0) {
        parts.push(dataVal.Count === 1 ? "(1 Time)" : `(${dataVal.Count} Times)`);
    } else if (func.funcType === Func.FuncType.ADD_FIELD_CHANGE_TO_FIELD && dataVal.Value !== undefined) {
        parts.push(`(${dataVal.Value} Turn${dataVal.Value > 1 ? "s" : ""})`);
    } else {
        section.showing = false;
    }
}
