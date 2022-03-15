import { DataVal, Func, Region } from "@atlasacademy/api-connector";

import { mergeElements } from "../../Helper/OutputHelper";
import { joinNumbers } from "../../Helper/StringHelper";
import EventDescriptor from "../EventDescriptor";
import { ItemDescriptorIndividuality } from "../ItemDescriptor";
import TraitDescription from "../TraitDescription";
import { FuncDescriptorSections } from "./FuncDescriptorSections";

export default function handleAffectsSection(
    region: Region,
    sections: FuncDescriptorSections,
    func: Func.BasicFunc,
    dataVal: DataVal.DataVal
): void {
    const section = sections.affects,
        parts = section.parts;

    if (func.funcType === Func.FuncType.DAMAGE_NP_HPRATIO_LOW) {
        parts.push("(additional for low HP)");
    } else if (
        typeof dataVal.Target === "number" &&
        (func.funcType === Func.FuncType.DAMAGE_NP_INDIVIDUAL ||
            func.funcType === Func.FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX)
    ) {
        if (dataVal.Correction === undefined)
            // summary table description
            parts.push("with supereffective damage");
        parts.push(
            <span>
                against <TraitDescription region={region} trait={dataVal.Target} />
            </span>
        );
    } else if (
        dataVal.TargetList !== undefined &&
        dataVal.TargetList.length > 0 &&
        func.funcType === Func.FuncType.DAMAGE_NP_INDIVIDUAL_SUM
    ) {
        let traitDescription = mergeElements(
            dataVal.TargetList.map((id) => <TraitDescription region={region} trait={id} />),
            " or "
        );
        let limitDescription = dataVal.ParamAddMaxCount ? `[Max ${dataVal.ParamAddMaxCount} stacks]` : null;
        let whoseTrait = dataVal.Target && dataVal.Target >= 1 ? "on enemy" : "on self";
        let preposition = dataVal.Correction && dataVal.Correction > 0 ? " per stack of" : "against";

        parts.push(
            <span>
                {preposition} {traitDescription} {whoseTrait} {limitDescription}
            </span>
        );
    } else if (
        dataVal.TargetRarityList !== undefined &&
        dataVal.TargetRarityList.length > 0 &&
        func.funcType === Func.FuncType.DAMAGE_NP_RARE
    ) {
        if (dataVal.Correction === undefined)
            // summary table description
            parts.push("with supereffective damage");
        parts.push(<span>against {joinNumbers(dataVal.TargetRarityList)} star</span>);
    } else if (func.funcType === Func.FuncType.DAMAGE_NP_PIERCE) {
        parts.push("(that pierces defense)");
    } else if (func.funcType === Func.FuncType.SERVANT_FRIENDSHIP_UP) {
        if (dataVal.Individuality)
            parts.push(
                <span>
                    of <TraitDescription region={region} trait={dataVal.Individuality} />
                </span>
            );
        if (dataVal.EventId)
            parts.push(
                <span>
                    during event <EventDescriptor region={region} eventId={dataVal.EventId} />
                </span>
            );
        if (dataVal.ApplySupportSvt === 0) parts.push(<span>(No effect when equipped as Support)</span>);
    } else if (
        func.funcType === Func.FuncType.EVENT_DROP_UP ||
        func.funcType === Func.FuncType.EVENT_POINT_UP ||
        func.funcType === Func.FuncType.EVENT_DROP_RATE_UP ||
        func.funcType === Func.FuncType.EVENT_POINT_RATE_UP
    ) {
        if (dataVal.Individuality !== undefined)
            parts.push(
                <span>
                    of <ItemDescriptorIndividuality region={region} individuality={dataVal.Individuality} />
                </span>
            );

        if (func.funcType === Func.FuncType.EVENT_DROP_RATE_UP || func.funcType === Func.FuncType.EVENT_POINT_RATE_UP) {
            if (dataVal.AddCount !== undefined) parts.push(<span>by {dataVal.AddCount / 10}%</span>);

            if (dataVal.DropRateCount !== undefined) parts.push(<span>by {dataVal.DropRateCount / 10}%</span>);
        } else {
            if (dataVal.AddCount !== undefined) parts.push(<span>by {dataVal.AddCount}</span>);

            if (dataVal.RateCount !== undefined) parts.push(<span>by {dataVal.RateCount / 10}%</span>);
        }

        if (dataVal.EventId !== undefined && dataVal.EventId !== 0)
            parts.push(
                <span>
                    during event <EventDescriptor region={region} eventId={dataVal.EventId} />
                </span>
            );
    }

    if (
        func.funcType === Func.FuncType.ENEMY_ENCOUNT_COPY_RATE_UP ||
        func.funcType === Func.FuncType.ENEMY_ENCOUNT_RATE_UP
    ) {
        if (dataVal.Individuality !== undefined) {
            parts.push(
                <span>
                    with <TraitDescription region={region} trait={Number(dataVal.Individuality)} />
                </span>
            );
        }

        if (dataVal.EventId !== undefined && dataVal.EventId !== 0) {
            parts.push(
                <span>
                    during event <EventDescriptor region={region} eventId={dataVal.EventId} />
                </span>
            );
        }
    }

    if (func.funcquestTvals.length > 0) {
        parts.push("if on field");
        parts.push(
            mergeElements(
                func.funcquestTvals.map((trait) => (
                    <TraitDescription
                        region={region}
                        trait={trait}
                        owner="quests"
                        ownerParameter="fieldIndividuality"
                    />
                )),
                " or "
            )
        );
    }

    if (func.functvals.length > 0) {
        if (func.funcTargetType === Func.FuncTargetType.SELF) {
            parts.push("if self has");
        } else if (func.funcType === Func.FuncType.GAIN_STAR && dataVal.MultipleGainStar === 1) {
            parts.push("per target with");
        } else {
            parts.push("for targets with");
        }

        func.functvals.forEach((trait, index) => {
            if (index > 0) parts.push("or");

            parts.push(<TraitDescription region={region} trait={trait} />);
        });
    }

    if (!parts.length) {
        section.showing = false;
    }
}
