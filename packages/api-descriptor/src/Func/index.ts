import describe from "./describe.js";
import describeBreakdown from "./describeBreakdown.js";
import describeValue from "./describeValue.js";
import { targetOpposingTeam, targetSameTeam } from "./getOpponentType.js";
import getRelatedNpIds from "./getRelatedNpIds.js";
import getRelatedSkillIds from "./getRelatedSkillIds.js";

const FuncDescriptor: {
    describe: typeof describe;
    describeBreakdown: typeof describeBreakdown;
    describeValue: typeof describeValue;
    getRelatedSkillIds: typeof getRelatedSkillIds;
    getRelatedNpIds: typeof getRelatedNpIds;
    targetOpposingTeam: typeof targetOpposingTeam;
    targetSameTeam: typeof targetSameTeam;
} = {
    describe,
    describeBreakdown,
    describeValue,
    getRelatedSkillIds,
    getRelatedNpIds,
    targetOpposingTeam,
    targetSameTeam,
};

export default FuncDescriptor;
