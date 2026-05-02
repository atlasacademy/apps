import { Skill } from "@atlasacademy/api-connector";

import { ReferencePartial, ReferenceType } from "../Descriptor.js";

export default class SkillReferencePartial extends ReferencePartial {
    constructor(skill: Skill.Skill | number) {
        super(ReferenceType.SKILL, skill);
    }
}
