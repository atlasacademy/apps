import { ReverseData, ReverseDepth } from "../ApiConnector";
import { Buff } from "./Buff";
import { DataVal } from "./DataVal";
import { NoblePhantasm, NoblePhantasmBasic } from "./NoblePhantasm";
import { Skill, SkillBasic } from "./Skill";
import { Trait } from "./Trait";

export enum FuncTargetTeam {
    PLAYER = "player",
    ENEMY = "enemy",
    PLAYER_AND_ENEMY = "playerAndEnemy",
}

export enum FuncTargetType {
    SELF = "self",
    PT_ONE = "ptOne",
    PT_ANOTHER = "ptAnother",
    PT_ALL = "ptAll",
    ENEMY = "enemy",
    ENEMY_ANOTHER = "enemyAnother",
    ENEMY_ALL = "enemyAll",
    PT_FULL = "ptFull",
    ENEMY_FULL = "enemyFull",
    PT_OTHER = "ptOther",
    PT_ONE_OTHER = "ptOneOther",
    PT_RANDOM = "ptRandom",
    ENEMY_OTHER = "enemyOther",
    ENEMY_RANDOM = "enemyRandom",
    PT_OTHER_FULL = "ptOtherFull",
    ENEMY_OTHER_FULL = "enemyOtherFull",
    PTSELECT_ONE_SUB = "ptselectOneSub",
    PTSELECT_SUB = "ptselectSub",
    PT_ONE_ANOTHER_RANDOM = "ptOneAnotherRandom",
    PT_SELF_ANOTHER_RANDOM = "ptSelfAnotherRandom",
    ENEMY_ONE_ANOTHER_RANDOM = "enemyOneAnotherRandom",
    PT_SELF_ANOTHER_FIRST = "ptSelfAnotherFirst",
    PT_SELF_BEFORE = "ptSelfBefore",
    PT_SELF_AFTER = "ptSelfAfter",
    PT_SELF_ANOTHER_LAST = "ptSelfAnotherLast",
    COMMAND_TYPE_SELF_TREASURE_DEVICE = "commandTypeSelfTreasureDevice",
    FIELD_OTHER = "fieldOther",
    ENEMY_ONE_NO_TARGET_NO_ACTION = "enemyOneNoTargetNoAction",
    PT_ONE_HP_LOWEST_VALUE = "ptOneHpLowestValue",
    PT_ONE_HP_LOWEST_RATE = "ptOneHpLowestRate",
    ENEMY_RANGE = "enemyRange",
}

export enum FuncType {
    NONE = "none",
    ADD_STATE = "addState",
    SUB_STATE = "subState",
    DAMAGE = "damage",
    DAMAGE_NP = "damageNp",
    GAIN_STAR = "gainStar",
    GAIN_HP = "gainHp",
    GAIN_NP = "gainNp",
    LOSS_NP = "lossNp",
    SHORTEN_SKILL = "shortenSkill",
    EXTEND_SKILL = "extendSkill",
    RELEASE_STATE = "releaseState",
    LOSS_HP = "lossHp",
    INSTANT_DEATH = "instantDeath",
    DAMAGE_NP_PIERCE = "damageNpPierce",
    DAMAGE_NP_INDIVIDUAL = "damageNpIndividual",
    ADD_STATE_SHORT = "addStateShort",
    GAIN_HP_PER = "gainHpPer",
    DAMAGE_NP_STATE_INDIVIDUAL = "damageNpStateIndividual",
    HASTEN_NPTURN = "hastenNpturn",
    DELAY_NPTURN = "delayNpturn",
    DAMAGE_NP_HPRATIO_HIGH = "damageNpHpratioHigh",
    DAMAGE_NP_HPRATIO_LOW = "damageNpHpratioLow",
    CARD_RESET = "cardReset",
    REPLACE_MEMBER = "replaceMember",
    LOSS_HP_SAFE = "lossHpSafe",
    DAMAGE_NP_COUNTER = "damageNpCounter",
    DAMAGE_NP_STATE_INDIVIDUAL_FIX = "damageNpStateIndividualFix",
    DAMAGE_NP_SAFE = "damageNpSafe",
    CALL_SERVANT = "callServant",
    PT_SHUFFLE = "ptShuffle",
    LOSS_STAR = "lossStar",
    CHANGE_SERVANT = "changeServant",
    CHANGE_BG = "changeBg",
    DAMAGE_VALUE = "damageValue",
    WITHDRAW = "withdraw",
    FIX_COMMANDCARD = "fixCommandcard",
    SHORTEN_BUFFTURN = "shortenBuffturn",
    EXTEND_BUFFTURN = "extendBuffturn",
    SHORTEN_BUFFCOUNT = "shortenBuffcount",
    EXTEND_BUFFCOUNT = "extendBuffcount",
    CHANGE_BGM = "changeBgm",
    DISPLAY_BUFFSTRING = "displayBuffstring",
    RESURRECTION = "resurrection",
    GAIN_NP_BUFF_INDIVIDUAL_SUM = "gainNpBuffIndividualSum",
    SET_SYSTEM_ALIVE_FLAG = "setSystemAliveFlag",
    FORCE_INSTANT_DEATH = "forceInstantDeath",
    DAMAGE_NP_RARE = "damageNpRare",
    GAIN_NP_FROM_TARGETS = "gainNpFromTargets",
    GAIN_HP_FROM_TARGETS = "gainHpFromTargets",
    LOSS_HP_PER = "lossHpPer",
    LOSS_HP_PER_SAFE = "lossHpPerSafe",
    SHORTEN_USER_EQUIP_SKILL = "shortenUserEquipSkill",
    QUICK_CHANGE_BG = "quickChangeBg",
    SHIFT_SERVANT = "shiftServant",
    DAMAGE_NP_AND_CHECK_INDIVIDUALITY = "damageNpAndCheckIndividuality",
    ABSORB_NPTURN = "absorbNpturn",
    OVERWRITE_DEAD_TYPE = "overwriteDeadType",
    FORCE_ALL_BUFF_NOACT = "forceAllBuffNoact",
    BREAK_GAUGE_UP = "breakGaugeUp",
    BREAK_GAUGE_DOWN = "breakGaugeDown",
    MOVE_TO_LAST_SUBMEMBER = "moveToLastSubmember",
    EXTEND_USER_EQUIP_SKILL = "extendUserEquipSkill",
    UPDATE_ENEMY_ENTRY_MAX_COUNT_EACH_TURN = "updateEnemyEntryMaxCountEachTurn",
    EXP_UP = "expUp",
    QP_UP = "qpUp",
    DROP_UP = "dropUp",
    FRIEND_POINT_UP = "friendPointUp",
    EVENT_DROP_UP = "eventDropUp",
    EVENT_DROP_RATE_UP = "eventDropRateUp",
    EVENT_POINT_UP = "eventPointUp",
    EVENT_POINT_RATE_UP = "eventPointRateUp",
    TRANSFORM_SERVANT = "transformServant",
    QP_DROP_UP = "qpDropUp",
    SERVANT_FRIENDSHIP_UP = "servantFriendshipUp",
    USER_EQUIP_EXP_UP = "userEquipExpUp",
    CLASS_DROP_UP = "classDropUp",
    ENEMY_ENCOUNT_COPY_RATE_UP = "enemyEncountCopyRateUp",
    ENEMY_ENCOUNT_RATE_UP = "enemyEncountRateUp",
    ENEMY_PROB_DOWN = "enemyProbDown",
    GET_REWARD_GIFT = "getRewardGift",
    SEND_SUPPORT_FRIEND_POINT = "sendSupportFriendPoint",
    MOVE_POSITION = "movePosition",
    REVIVAL = "revival",
    DAMAGE_NP_INDIVIDUAL_SUM = "damageNpIndividualSum",
    DAMAGE_VALUE_SAFE = "damageValueSafe",
    FRIEND_POINT_UP_DUPLICATE = "friendPointUpDuplicate",
    MOVE_STATE = "moveState",
    CHANGE_BGM_COSTUME = "changeBgmCostume",
    FUNC_126 = "func126",
    FUNC_127 = "func127",
    UPDATE_ENTRY_POSITIONS = "updateEntryPositions",
    BUDDY_POINT_UP = "buddyPointUp",
    ADD_FIELD_CHANGE_TO_FIELD = "addFieldChangeToField",
    SUB_FIELD_BUFF = "subFieldBuff",
    EVENT_FORTIFICATION_POINT_UP = "eventFortificationPointUp",
    GAIN_NP_INDIVIDUAL_SUM = "gainNpIndividualSum",
    SET_QUEST_ROUTE_FLAG = "setQuestRouteFlag",
    LAST_USE_PLAYER_SKILL_COPY = "lastUsePlayerSkillCopy",
    CHANGE_ENEMY_MASTER_FACE = "changeEnemyMasterFace",
    DAMAGE_VALUE_SAFE_ONCE = "damageValueSafeOnce",
}

export interface BasicFunc {
    funcId: number;
    funcType: FuncType;
    funcTargetType: FuncTargetType;
    funcTargetTeam: FuncTargetTeam;
    functvals: Trait[];
    funcquestTvals: number[];
    buffs: Buff[];
    traitVals?: Trait[];
    reverse?: {
        basic?: {
            NP?: NoblePhantasmBasic[];
            skill?: SkillBasic[];
        };
    };
}

export interface Func extends BasicFunc {
    funcPopupText: string;
    funcPopupIcon?: string;
    svals: DataVal[];
    svals2?: DataVal[];
    svals3?: DataVal[];
    svals4?: DataVal[];
    svals5?: DataVal[];
    followerVals?: DataVal[];
    reverse?: {
        basic?: {
            NP?: NoblePhantasmBasic[];
            skill?: SkillBasic[];
        };
        nice?: {
            NP?: NoblePhantasm[];
            skill?: Skill[];
        };
    };
}

export type FuncSearchOptions = {
    popupText?: string;
    type?: FuncType[];
    targetType?: FuncTargetType[];
    targetTeam?: FuncTargetTeam[];
    vals?: number[];
    tvals?: number[];
    questTvals?: number[];
    reverse?: boolean;
    reverseData?: ReverseData;
    reverseDepth?: ReverseDepth;
};
