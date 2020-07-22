import React from "react";
import Func, {DataVal, FuncType} from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import {mergeElements} from "../../Helper/OutputHelper";
import TraitDescriptor from "../TraitDescriptor";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export default function (region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal): void {
    const section = sections.affects,
        parts = section.parts;

    if (func.funcType === FuncType.DAMAGE_NP_HPRATIO_LOW) {
        parts.push('(additional for low HP)');
    } else if (typeof dataVal.Target === "number"
        && (
            func.funcType === FuncType.DAMAGE_NP_INDIVIDUAL
            || func.funcType === FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX
        )
    ) {
        parts.push(
            <span>(additional to targets with {
                <TraitDescriptor region={region} trait={dataVal.Target}/>
            })</span>
        );
    } else if (typeof dataVal.TargetList === "number" && func.funcType === FuncType.DAMAGE_NP_INDIVIDUAL_SUM) {
        parts.push(
            <span>(bonus per trait of {
                <TraitDescriptor region={region} trait={dataVal.TargetList}/>
            }{
                dataVal.ParamAddMaxCount ? `[Limit ${dataVal.ParamAddMaxCount}]` : null
            })</span>
        );
    } else if (typeof dataVal.TargetRarityList === "string" && func.funcType === FuncType.DAMAGE_NP_RARE) {
        parts.push(
            <span>(bonus to {dataVal.TargetRarityList} {
                dataVal.TargetRarityList.split('/').length > 1 ? 'rarities' : 'rarity'
            })</span>
        )
    } else if (func.funcType === FuncType.DAMAGE_NP_PIERCE) {
        parts.push('(that pierces defense)');
    }

    if (func.funcquestTvals.length) {
        parts.push('if on field');
        parts.push(
            mergeElements(
                func.funcquestTvals.map(trait => <TraitDescriptor region={region} trait={trait}/>),
                ' & '
            )
        );
    }

    if (func.functvals.length) {
        parts.push('for');

        if (func.functvals.length > 1) {
            parts.push('all');
        }

        func.functvals.forEach((trait, index) => {
            if (index > 0)
                parts.push('&');

            parts.push(<TraitDescriptor region={region} trait={trait}/>);
        });
    }

    if (!parts.length) {
        section.showing = false;
    }

}
