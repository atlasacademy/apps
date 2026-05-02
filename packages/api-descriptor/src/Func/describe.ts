import { DataVal, Func } from "@atlasacademy/api-connector";

import { BasePartial, Descriptor, ParticlePartial } from "../Descriptor.js";
import describeActionSection from "./Sections/describeActionSection.js";
import describeChanceSection from "./Sections/describeChanceSection.js";
import describeTeamSection from "./Sections/describeTeamSection.js";
import determineSectionFlags from "./Sections/determineSectionFlags.js";
import extractStaticDataVal from "./extractStaticDataVal.js";

export default function (
    func: Func.Func,
    dataVal: DataVal.DataVal[],
    followerDataVal?: DataVal.DataVal[],
    forceLevel?: number
): Descriptor {
    const partials: BasePartial[] = [];
    const flags = determineSectionFlags(func);
    const staticDataVal = extractStaticDataVal(dataVal);

    if (flags.team.showing) addSection(partials, describeTeamSection(func), flags.team.preposition);
    if (flags.chance.showing)
        addSection(partials, describeChanceSection(func, staticDataVal), flags.chance.preposition);
    if (flags.action.showing) addSection(partials, describeActionSection(func));

    return new Descriptor(partials);
}

function addSection(partials: BasePartial[], sectionPartials: BasePartial[], preposition?: string) {
    if (!sectionPartials.length) return;

    if (partials.length) {
        preposition = preposition === undefined ? " " : ` ${preposition} `;
        partials.push(new ParticlePartial(preposition));
    }

    partials.push(...sectionPartials);
}
