import React from "react";
import Func, {DataVal, FuncType} from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import TraitDescriptor from "../TraitDescriptor";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export default function (region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal): void {
    const section = sections.affects,
        parts = section.parts;

    if (func.functvals.length) {
        parts.push('for all');
        func.functvals.forEach((trait, index) => {
            if (index > 0)
                parts.push('&');

            parts.push(<TraitDescriptor region={region} trait={trait}/>);
        });
    } else if (
        (func.funcType === FuncType.ADD_STATE || func.funcType === FuncType.ADD_STATE_SHORT)
        && func.buffs[0] && func.buffs[0].ckSelfIndv.length
    ) {
        parts.push('of');
        func.buffs[0].ckSelfIndv.forEach((trait, index) => {
            if (index > 0)
                parts.push('&');

            parts.push(<TraitDescriptor region={region} trait={trait}/>);
        });
    } else {
        section.showing = false;
    }

}
