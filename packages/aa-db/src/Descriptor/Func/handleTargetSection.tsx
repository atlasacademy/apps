import Func, {DataVal, FuncTargetType, FuncType} from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export const targetDescriptions = new Map<FuncTargetType, string>([
    [FuncTargetType.SELF, 'self'],
    [FuncTargetType.PT_ONE, 'party member'],
    // PT_ANOTHER
    [FuncTargetType.PT_ALL, 'party'],
    [FuncTargetType.ENEMY, 'enemy'],
    // ENEMY_ANOTHER
    [FuncTargetType.ENEMY_ALL, 'enemies'],
    [FuncTargetType.PT_FULL, 'party (including reserve)'],
    [FuncTargetType.ENEMY_FULL, 'enemies (including reserve)'],
    [FuncTargetType.PT_OTHER, 'party except self'],
    [FuncTargetType.PT_ONE_OTHER, 'other party members besides target'],
    [FuncTargetType.PT_RANDOM, 'random party member'],
    [FuncTargetType.ENEMY_OTHER, 'other enemies besides target'],
    [FuncTargetType.ENEMY_RANDOM, 'random enemy'],
    [FuncTargetType.PT_OTHER_FULL, 'party except self (including reserve)'],
    [FuncTargetType.ENEMY_OTHER_FULL, 'other enemies (including reserve)'],
    [FuncTargetType.PTSELECT_ONE_SUB, 'active party member and reserve party member'],
    [FuncTargetType.PTSELECT_SUB, 'reserve party member'],
    // PT_ONE_ANOTHER_RANDOM
    [FuncTargetType.PT_ONE_ANOTHER_RANDOM, 'other random party member'],
    [FuncTargetType.PT_SELF_ANOTHER_RANDOM, 'other random party member (except self)'],
    [FuncTargetType.ENEMY_ONE_ANOTHER_RANDOM, 'other random enemy'],
    [FuncTargetType.PT_SELF_ANOTHER_FIRST, 'first other party member (except self)'],
    // PT_SELF_BEFORE
    // PT_SELF_AFTER
    // PT_SELF_ANOTHER_LAST
    [FuncTargetType.COMMAND_TYPE_SELF_TREASURE_DEVICE, 'target noble phantasm version'],
]);

export default function (region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal): void {
    const section = sections.target,
        parts = section.parts;

    let targetType: FuncTargetType | undefined = func.funcTargetType;

    if (func.funcType === FuncType.GAIN_HP_FROM_TARGETS) {
        switch (dataVal.DependFuncId) {
            case 711:
                targetType = FuncTargetType.ENEMY_ALL;
                break;
            default:
                targetType = undefined;
                section.showing = false;
                break;
        }
    } else if (func.funcType === FuncType.GAIN_NP_FROM_TARGETS) {
        switch (dataVal.DependFuncId) {
            case 474:
                targetType = FuncTargetType.ENEMY_ALL;
                break;
            case 3962:
                targetType = FuncTargetType.PT_OTHER;
                break;
        }
    }

    if (targetType) {
        parts.push(targetDescriptions.get(targetType) ?? targetType);
    }
}
