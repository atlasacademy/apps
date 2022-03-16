import Card from "../Enum/Card";
import ClassName from "../Enum/ClassName";
import CondType from "../Enum/Cond";
import { Attribute } from "./Attribute";
import { Item } from "./Item";
import { NoblePhantasm } from "./NoblePhantasm";
import { Skill } from "./Skill";
import { Trait } from "./Trait";

export enum EntityType {
    NORMAL = "normal",
    HEROINE = "heroine",
    COMBINE_MATERIAL = "combineMaterial",
    ENEMY = "enemy",
    ENEMY_COLLECTION = "enemyCollection",
    SERVANT_EQUIP = "servantEquip",
    STATUS_UP = "statusUp",
    SVT_EQUIP_MATERIAL = "svtEquipMaterial",
    ENEMY_COLLECTION_DETAIL = "enemyCollectionDetail",
    ALL = "all",
    COMMAND_CODE = "commandCode",
    SVT_MATERIAL_TD = "svtMaterialTd",
}

export enum EntityFlag {
    ONLY_USE_FOR_NPC = "onlyUseForNpc",
    SVT_EQUIP_FRIEND_SHIP = "svtEquipFriendShip",
    IGNORE_COMBINE_LIMIT_SPECIAL = "ignoreCombineLimitSpecial",
    SVT_EQUIP_EXP = "svtEquipExp",
    SVT_EQUIP_CHOCOLATE = "svtEquipChocolate",
    NORMAL = "normal",
    GOETIA = "goetia",
}

export enum Gender {
    MALE = "male",
    FEMALE = "female",
    UNKNOWN = "unknown",
}

export interface EntityAssetMap {
    ascension?: {
        [key: number]: string;
    };
    story?: {
        [key: number]: string;
    };
    costume?: {
        [key: number]: string;
    };
    equip?: {
        [key: number]: string;
    };
    cc?: {
        [key: number]: string;
    };
}

export interface EntityAssets {
    charaFigure: EntityAssetMap;
    charaFigureForm: { [key: string]: EntityAssetMap };
    charaFigureMulti: { [key: string]: EntityAssetMap };
    charaGraph: EntityAssetMap;
    charaGraphEx: EntityAssetMap;
    commands: EntityAssetMap;
    equipFace: EntityAssetMap;
    faces: EntityAssetMap;
    narrowFigure: EntityAssetMap;
    status: EntityAssetMap;
    image: EntityAssetMap;
    spriteModel: EntityAssetMap;
}

export interface CardDetail {
    attackIndividuality: Trait[];
}

export interface EntityLevelUpMaterials {
    items: { item: Item; amount: number }[];
    qp: number;
}

export interface EntityLevelUpMaterialProgression {
    [key: string]: EntityLevelUpMaterials;
}

export interface ValentineScript {
    scriptId: string;
    script: string;
    scriptName: string;
}

interface ServantAscensionAdditionDetails<T> {
    ascension: {
        [key: number]: T;
    };
    costume: {
        [key: number]: T;
    };
}

export interface EntityCoin {
    summonNum: number;
    item: Item;
}

export interface ServantAscensionAdditions {
    individuality: ServantAscensionAdditionDetails<Trait[]>;
    voicePrefix: ServantAscensionAdditionDetails<number>;
    overWriteServantName: ServantAscensionAdditionDetails<string>;
    overWriteServantBattleName: ServantAscensionAdditionDetails<string>;
    overWriteTDName: ServantAscensionAdditionDetails<string>;
    overWriteTDRuby: ServantAscensionAdditionDetails<string>;
    overWriteTDFileName: ServantAscensionAdditionDetails<string>;
    overWriteTDRank: ServantAscensionAdditionDetails<string>;
    overWriteTDTypeText: ServantAscensionAdditionDetails<string>;
}

export interface AppendPassive {
    num: number;
    priority: number;
    skill: Skill;
    unlockMaterials: { item: Item; amount: number }[];
}

export interface EntityTraitAdd {
    idx: number;
    trait: Trait[];
    limitCount: number;
    condType?: CondType;
    condId?: number;
    condNum?: number;
}

export interface EntityChange {
    beforeTreasureDeviceIds: number[];
    afterTreasureDeviceIds: number[];
    svtId: number;
    priority: number;
    condType: CondType;
    condTargetId: number;
    condValue: number;
    name: string;
    svtVoiceId: number;
    limitCount: number;
    flag: number;
    battleSvtId: number;
}

export interface EntityLimitImage {
    limitCount: number;
    priority: number;
    defaultLimitCount: number;
    condType: CondType;
    condTargetId: number;
    condNum: number;
}

export interface Entity {
    id: number;
    collectionNo: number;
    name: string;
    ruby: string;
    className: ClassName;
    type: EntityType;
    flag: EntityFlag;
    rarity: number;
    cost: number;
    lvMax: number;
    extraAssets: EntityAssets;
    gender: Gender;
    attribute: Attribute;
    traits: Trait[];
    starAbsorb: number;
    starGen: number;
    instantDeathChance: number;
    cards: Card[];
    hitsDistribution: {
        none?: number[];
        buster?: number[];
        arts?: number[];
        quick?: number[];
        extra?: number[];
        blank?: number[];
        weak?: number[];
        strength?: number[];
    };
    cardDetails: {
        none?: CardDetail;
        buster?: CardDetail;
        arts?: CardDetail;
        quick?: CardDetail;
        extra?: CardDetail;
        blank?: CardDetail;
        weak?: CardDetail;
        strength?: CardDetail;
    };
    atkBase: number;
    atkMax: number;
    hpBase: number;
    hpMax: number;
    relateQuestIds: number[];
    growthCurve: number;
    atkGrowth: number[];
    hpGrowth: number[];
    bondGrowth: number[];
    bondEquip: number;
    valentineEquip: number[];
    valentineScript: ValentineScript[];
    ascensionAdd: ServantAscensionAdditions;
    traitAdd: EntityTraitAdd[];
    svtChange: EntityChange[];
    ascensionImage: EntityLimitImage[];
    ascensionMaterials: EntityLevelUpMaterialProgression;
    skillMaterials: EntityLevelUpMaterialProgression;
    appendSkillMaterials: EntityLevelUpMaterialProgression;
    costumeMaterials: EntityLevelUpMaterialProgression;
    coin?: EntityCoin;
    skills: Skill[];
    classPassive: Skill[];
    extraPassive: Skill[];
    appendPassive: AppendPassive[];
    noblePhantasms: NoblePhantasm[];
}

export interface CostumeDetailBasic {
    id: number;
    costumeCollectionNo: number;
    battleCharaId: number;
    shortName: string;
}

export interface EntityBasic {
    id: number;
    collectionNo: number;
    name: string;
    type: EntityType;
    flag: EntityFlag;
    className: ClassName;
    attribute: Attribute;
    rarity: number;
    atkMax: number;
    hpMax: number;
    face: string;
    costume: {
        [key: string]: CostumeDetailBasic;
    };
}
