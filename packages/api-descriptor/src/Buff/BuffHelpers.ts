import { Buff } from "@atlasacademy/api-connector";

import { buffTraitDescriptions, upDownBuffs, UpDownBuffType } from "./BuffTypes";

export function getUpDownBuffType(type: Buff.BuffType): UpDownBuffType | undefined {
    for (let x in upDownBuffs) {
        if (upDownBuffs[x].up === type || upDownBuffs[x].down === type) return upDownBuffs[x];
    }

    return undefined;
}

export function getTraitDescription(buff: Buff.BasicBuff): string | undefined {
    const traitIds = buff.vals.map((trait) => trait.id);

    for (let x in traitIds) {
        const traitId = traitIds[x],
            description = buffTraitDescriptions.get(traitId);

        if (description !== undefined) return description;
    }

    return undefined;
}
