import {Func, Region} from "@atlasacademy/api-connector";
import FuncType from "@atlasacademy/api-connector/dist/Enum/FuncType";
import DataVal from "@atlasacademy/api-connector/dist/Schema/DataVal";
import React from "react";
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
    } else if (
        dataVal.TargetList
        && dataVal.TargetList.length > 0
        && func.funcType === FuncType.DAMAGE_NP_INDIVIDUAL_SUM
    ) {
        const traitIds = dataVal.TargetList,
            traits = traitIds.map(id => <TraitDescriptor region={region} trait={id}/>);

        parts.push(
            <span>(bonus per trait of {mergeElements(traits, ' or ')}{
                dataVal.ParamAddMaxCount ? `[Limit ${dataVal.ParamAddMaxCount}]` : null
            })</span>
        );
    } else if (
        dataVal.TargetRarityList
        && dataVal.TargetRarityList.length > 0
        && func.funcType === FuncType.DAMAGE_NP_RARE
    ) {
        parts.push(
            <span>(bonus to {dataVal.TargetRarityList.join('/')} {
                dataVal.TargetRarityList.length > 1 ? 'rarities' : 'rarity'
            })</span>
        )
    } else if (func.funcType === FuncType.DAMAGE_NP_PIERCE) {
        parts.push('(that pierces defense)');
    }

    if (
        func.funcType === FuncType.ENEMY_ENCOUNT_COPY_RATE_UP
        || func.funcType === FuncType.ENEMY_ENCOUNT_RATE_UP
        || func.funcType === FuncType.EVENT_DROP_UP
    ) {
        if (dataVal.Individuality) {
            parts.push(
                <span>with <TraitDescriptor region={region} trait={Number(dataVal.Individuality)}/></span>
            )
        }

        if (dataVal.EventId) {
            parts.push(
                <span>during event <TraitDescriptor region={region} trait={Number(dataVal.EventId)}/></span>
            )
        }
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
        parts.push('for targets');

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
