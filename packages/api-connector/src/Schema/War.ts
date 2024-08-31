import Cond, { CondType } from "../Enum/Cond";
import { Bgm } from "./Bgm";
import { Quest } from "./Quest";

export enum WarStartType {
    NONE = "none",
    SCRIPT = "script",
    QUEST = "quest",
}

export enum WarOverwriteType {
    BGM = "bgm",
    PARENT_WAR = "parentWar",
    BANNER = "banner",
    BG_IMAGE = "bgImage",
    SVT_IMAGE = "svtImage",
    FLAG = "flag",
    BASE_MAP_ID = "baseMapId",
    NAME = "name",
    LONG_NAME = "longName",
    MATERIAL_PARENT_WAR = "materialParentWar",
    COORDINATES = "coordinates",
    EFFECT_CHANGE_BLACK_MARK = "effectChangeBlackMark",
    QUEST_BOARD_SECTION_IMAGE = "questBoardSectionImage",
    WAR_FORCE_DISP = "warForceDisp",
    WAR_FORCE_HIDE = "warForceHide",
    START_TYPE = "startType",
    NOTICE_DIALOG_TEXT = "noticeDialogText",
    CLEAR_MARK = "clearMark",
    EFFECT_CHANGE_WHITE_MARK = "effectChangeWhiteMark",
    COMMAND_SPELL_ICON = "commandSpellIcon",
    MASTER_FACE_ICON = "masterFaceIcon",
}

export enum WarFlag {
    WITH_MAP = "withMap",
    SHOW_ON_MATERIAL = "showOnMaterial",
    FOLDER_SORT_PRIOR = "folderSortPrior",
    STORY_SHORTCUT = "storyShortcut",
    IS_EVENT = "isEvent",
    CLOSE_AFTER_CLEAR = "closeAfterClear",
    MAIN_SCENARIO = "mainScenario",
    IS_WAR_ICON_LEFT = "isWarIconLeft",
    CLEARED_RETURN_TO_TITLE = "clearedReturnToTitle",
    NO_CLEAR_MARK_WITH_CLEAR = "noClearMarkWithClear",
    NO_CLEAR_MARK_WITH_COMPLETE = "noClearMarkWithComplete",
    NOT_ENTRY_BANNER_ACTIVE = "notEntryBannerActive",
    SHOP = "shop",
    BLACK_MARK_WITH_CLEAR = "blackMarkWithClear",
    DISP_FIRST_QUEST = "dispFirstQuest",
    EFFECT_DISAPPEAR_BANNER = "effectDisappearBanner",
    WHITE_MARK_WITH_CLEAR = "whiteMarkWithClear",
    WHITE_MARK_UNDER_BOARD = "whiteMarkUnderBoard",
    SUB_FOLDER = "subFolder",
    DISP_EARTH_POINT_WITHOUT_MAP = "dispEarthPointWithoutMap",
    IS_WAR_ICON_FREE = "isWarIconFree",
    IS_WAR_ICON_CENTER = "isWarIconCenter",
    NOTICE_BOARD = "noticeBoard",
    CHANGE_DISP_CLOSED_MESSAGE = "changeDispClosedMessage",
}

export interface Map {
    id: number;
    mapImage?: string;
    mapImageW: number;
    mapImageH: number;
    mapGimmicks: MapGimmick[];
    headerImage?: string;
    bgm: Bgm;
}

export interface MapGimmick {
    id: number;
    image: string;
    x: number;
    y: number;
    depthOffset: number;
    scale: number;
    dispCondType: CondType;
    dispTargetId: number;
    dispTargetValue: number;
    dispCondType2: CondType;
    dispTargetId2: number;
    dispTargetValue2: number;
    actionAnimTime: number;
    actionEffectId: number;
    startedAt: number;
    endedAt: number;
}

export interface WarAdd {
    warId: number;
    type: WarOverwriteType;
    priority: number;
    overwriteId: number;
    overwriteStr: string;
    overwriteBanner?: string;
    condType: Cond;
    targetId: number;
    value: number;
    startedAt: number;
    endedAt: number;
}

export enum WarReleaseDisplayType {
    HIDE = "hide",
    OPEN = "open",
    CLOSE = "close",
    ANNOUNCEMENT = "announcement",
}

export interface WarRelease {
    priority: number;
    condType: CondType;
    condId: number;
    condNum: number;
    warDisplayType: WarReleaseDisplayType;
    closedDialogMessage: number;
}

export enum SpotOverwriteType {
    NONE = "none",
    FLAG = "flag",
    PATH_POINT_RATIO = "pathPointRatio",
    PATH_POINT_RATIO_LIMIT = "pathPointRatioLimit",
    NAME_PANEL_OFFSET_X = "namePanelOffsetX",
    NAME_PANEL_OFFSET_Y = "namePanelOffsetY",
    NAME = "name",
}

export interface SpotAdd {
    priority: number;
    overrideType: SpotOverwriteType;
    targetId: number;
    targetText: string;
    condType: CondType;
    condTargetId: number;
    condNum: number;
}

export interface Spot {
    id: number;
    joinSpotIds: number[];
    mapId: number;
    name: string;
    originalName: string;
    image?: string;
    x: number;
    y: number;
    imageOfsX: number;
    imageOfsY: number;
    nameOfsX: number;
    nameOfsY: number;
    questOfsX: number;
    questOfsY: number;
    nextOfsX: number;
    nextOfsY: number;
    closedMessage: string;
    spotAdds: SpotAdd[];
    quests: Quest[];
}

export interface SpotRoad {
    id: number;
    warId: number;
    mapId: number;
    image: string;
    srcSpotId: number;
    dstSpotId: number;
    dispCondType: Cond;
    dispTargetId: number;
    dispTargetValue: number;
    dispCondType2: Cond;
    dispTargetId2: number;
    dispTargetValue2: number;
    activeCondType: Cond;
    activeTargetId: number;
    activeTargetValue: number;
}

export interface War {
    id: number;
    coordinates: number[][];
    age: string;
    name: string;
    originalName: string;
    longName: string;
    originalLongName: string;
    flags: WarFlag[];
    banner?: string;
    headerImage?: string;
    priority: number;
    parentWarId: number;
    materialParentWarId: number;
    emptyMessage: string;
    bgm: Bgm;
    scriptId: string;
    script: string;
    startType: WarStartType;
    targetId: number;
    eventId: number;
    eventName: string;
    lastQuestId: number;
    releaseConditions: WarRelease[];
    warAdds: WarAdd[];
    maps: Map[];
    spots: Spot[];
    spotRoads: SpotRoad[];
}

export interface WarBasic {
    id: number;
    coordinates: number[][];
    age: string;
    name: string;
    longName: string;
    flags: WarFlag[];
    eventId: number;
    eventName: string;
}
