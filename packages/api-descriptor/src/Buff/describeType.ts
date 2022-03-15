import { Buff } from "@atlasacademy/api-connector";

import { toTitleCase } from "../Helpers";
import { getUpDownBuffType } from "./BuffHelpers";
import { buffTriggerTypes, buffTypeDescriptions } from "./BuffTypes";

export default function (type: Buff.BuffType): string {
    const upDownBuffType = getUpDownBuffType(type),
        triggerType = buffTriggerTypes.get(type),
        typeDescription = buffTypeDescriptions.get(type);

    if (upDownBuffType) {
        if (upDownBuffType.up === type) {
            return `${upDownBuffType.description} Up`;
        } else {
            return `${upDownBuffType.description} Down`;
        }
    } else if (typeDescription) {
        return typeDescription;
    } else if (triggerType) {
        if (triggerType.counterNp) return "Counter NP";
        return `Trigger Skill ${triggerType.after ? "on " : "before "}${
            triggerType.when ? triggerType.when + " " : ""
        }${triggerType.event}`;
    }

    return toTitleCase(type);
}
