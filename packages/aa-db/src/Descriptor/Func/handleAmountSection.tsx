import React from "react";
import Func, {DataVal} from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import BuffValueDescriptor from "../BuffValueDescriptor";
import FuncValueDescriptor from "../FuncValueDescriptor";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export default function (region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal): void {
    const section = sections.amount,
        parts = section.parts;

    if (dataVal.Value) {
        if (func.buffs[0]) {
            parts.push('of');
            parts.push(<BuffValueDescriptor region={region} buff={func.buffs[0]} dataVal={dataVal}/>);
        } else {
            // there are some properties that we don't want back as the description
            const prunedValues = {...dataVal};
            prunedValues.Rate = undefined;

            parts.push('of');

            parts.push(<FuncValueDescriptor region={region} func={func} dataVal={dataVal}/>);
        }
    }
}
