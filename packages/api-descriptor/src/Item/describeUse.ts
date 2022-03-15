import { Item } from "@atlasacademy/api-connector";

import { toTitleCase } from "../Helpers";

export default function (use: Item.ItemUse | string): string {
    switch (use) {
        case "skill & ascension":
            return "Skill Up & Ascension Material";
        case Item.ItemUse.SKILL:
            return "Skill Up Material";
        case Item.ItemUse.ASCENSION:
            return "Ascension Material";
        case Item.ItemUse.COSTUME:
            return "Costume Unlock Material";
        default:
            return toTitleCase(use);
    }
}
