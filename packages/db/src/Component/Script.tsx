import { Region } from "@atlasacademy/api-connector";

import { AssetHost } from "../Api";
import { flatten } from "../Helper/PolyFill";
import { splitString } from "../Helper/StringHelper";

export enum ScriptComponentType {
    UNPARSED = "UNPARSED",
    ENABLE_FULL_SCREEN = "ENABLE_FULL_SCREEN",
    CHARA_SET = "CHARA_SET",
    CHARA_CHANGE = "CHARA_CHANGE",
    CHARA_TALK = "CHARA_TALK",
    CHARA_TALK_TOGGLE = "CHARA_TALK_TOGGLE",
    CHARA_FILTER = "CHARA_FILTER",
    CHARA_SCALE = "CHARA_SCALE",
    CHARA_DEPTH = "CHARA_DEPTH",
    CHARA_CUT_IN = "CHARA_CUT_IN",
    CHARA_FACE = "CHARA_FACE",
    CHARA_FADE_TIME = "CHARA_FADE_TIME",
    CHARA_FADE_IN = "CHARA_FADE_IN",
    CHARA_FADE_OUT = "CHARA_FADE_OUT",
    CHARA_PUT = "CHARA_PUT",
    IMAGE_SET = "IMAGE_SET",
    VERTICAL_IMAGE_SET = "VERTICAL_IMAGE_SET",
    HORIZONTAL_IMAGE_SET = "HORIZONTAL_IMAGE_SET",
    EQUIP_SET = "EQUIP_SET",
    SCENE_SET = "SCENE_SET",
    DIALOGUE = "DIALOGUE",
    CHOICES = "CHOICES",
    SOUND_EFFECT = "SOUND_EFFECT",
    WAIT = "WAIT",
    LABEL = "LABEL",
    BRANCH = "BRANCH",
    BRANCH_QUEST_NOT_CLEAR = "BRANCH_QUEST_NOT_CLEAR",
    BRANCH_MASTER_GENDER = "BRANCH_MASTER_GENDER",
    BGM = "BGM",
    BGM_STOP = "BGM_STOP",
    VOICE = "VOICE",
    BACKGROUND = "BACKGROUND",
    FLAG = "FLAG",
    DIALOGUE_TEXT = "DIALOGUE_TEXT",
    DIALOGUE_TEXT_IMAGE = "DIALOGUE_TEXT_IMAGE",
    DIALOGUE_NEW_LINE = "DIALOGUE_NEW_LINE",
    DIALOGUE_PLAYER_NAME = "DIALOGUE_PLAYER_NAME",
    DIALOGUE_LINE = "DIALOGUE_LINE",
    DIALOGUE_GENDER = "DIALOGUE_GENDER",
    DIALOGUE_RUBY = "DIALOGUE_RUBY",
    DIALOGUE_HIDDEN_NAME = "DIALOGUE_HIDDEN_NAME",
    DIALOGUE_SPEED = "DIALOGUE_SPEED",
}

export type ScriptSound = {
    id: number;
    name: string;
    fileName: string;
    notReleased: boolean;
    audioAsset: string;
};

export type DialogueTextSize = "small" | "medium" | "large" | "x-large";

export type DialogueText = {
    type: ScriptComponentType.DIALOGUE_TEXT;
    text: string;
    colorHex?: string;
    size?: DialogueTextSize;
};

export type DialogueTextImage = {
    type: ScriptComponentType.DIALOGUE_TEXT_IMAGE;
    imageAsset: string;
    ruby?: string;
};

export type DialogueNewLine = {
    type: ScriptComponentType.DIALOGUE_NEW_LINE;
};

export type DialoguePlayerName = {
    type: ScriptComponentType.DIALOGUE_PLAYER_NAME;
    colorHex?: string;
};

export type DialogueLine = {
    type: ScriptComponentType.DIALOGUE_LINE;
    length: number;
    colorHex?: string;
};

export type DialogueRuby = {
    type: ScriptComponentType.DIALOGUE_RUBY;
    text: string;
    ruby?: string;
    colorHex?: string;
};

export type DialogueSpeakerHiddenName = {
    type: ScriptComponentType.DIALOGUE_HIDDEN_NAME;
    svtId: number;
    hiddenName: string;
    trueName: string;
    colorHex?: string;
};

export type DialogueSpeed = {
    type: ScriptComponentType.DIALOGUE_SPEED;
    speed: number;
};

export type DialogueBasicComponent =
    | DialogueText
    | DialogueTextImage
    | DialogueNewLine
    | DialogueSpeed
    | DialoguePlayerName
    | DialogueLine
    | DialogueRuby
    | DialogueSpeakerHiddenName;

export type DialogueGender = {
    type: ScriptComponentType.DIALOGUE_GENDER;
    male: DialogueBasicComponent[];
    female: DialogueBasicComponent[];
    colorHex?: string;
};

export type DialogueChildComponent = DialogueBasicComponent | DialogueGender | ScriptBracketComponent;

export type DialogueSpeaker = {
    name: string;
    speakerCode?: string;
    components: DialogueChildComponent[];
};

export type ScriptDialogue = {
    type: ScriptComponentType.DIALOGUE;
    speaker?: DialogueSpeaker;
    lines: string[];
    components: DialogueChildComponent[][];
    voice?: ScriptSound;
};

export type ScriptEnableFullScreen = {
    type: ScriptComponentType.ENABLE_FULL_SCREEN;
};

export type ScriptSoundEffect = {
    type: ScriptComponentType.SOUND_EFFECT;
    soundEffect: ScriptSound;
};

export type ScriptWait = {
    type: ScriptComponentType.WAIT;
    durationSec: number;
};

export type ScriptCharaSet = {
    type: ScriptComponentType.CHARA_SET;
    speakerCode: string; // "A", "B", "C", ...
    charaGraphId: number; // "8001000", "98003003", "98002000"
    charaGraphAsset: string;
    baseFace: number; // 1
    baseName: string; // "Mash", `"Dr. Roman"`, "Fou"
};

export type ScriptImageSet = {
    type: ScriptComponentType.IMAGE_SET;
    speakerCode: string;
    imageName: string;
    imageAsset: string;
};

export type ScriptVerticalImageSet = {
    type: ScriptComponentType.VERTICAL_IMAGE_SET;
    speakerCode: string;
    imageName: string;
    imageAsset: string;
};

export type ScriptHorizontalImageSet = {
    type: ScriptComponentType.HORIZONTAL_IMAGE_SET;
    speakerCode: string;
    imageName: string;
    imageAsset: string;
};

export type ScriptEquipSet = {
    type: ScriptComponentType.EQUIP_SET;
    speakerCode: string;
    equipId: string;
    equipAsset: string;
    baseFace: number;
    baseName: string;
};

export type ScriptSceneSet = {
    type: ScriptComponentType.SCENE_SET;
    speakerCode: string;
    backgroundId: string;
    backgroundAsset: string;
    baseFace: number;
};

export type CharaChangeKind = "fade" | "normal";

export type ScriptCharaChange = {
    type: ScriptComponentType.CHARA_CHANGE;
    speakerCode: string;
    charaGraphId: number;
    charaGraphAsset: string;
    baseFace: number;
    kind: CharaChangeKind;
    speed: number;
};

export type ScriptAssetSet =
    | ScriptCharaSet
    | ScriptCharaChange
    | ScriptImageSet
    | ScriptVerticalImageSet
    | ScriptHorizontalImageSet
    | ScriptEquipSet
    | ScriptSceneSet;

export type ScriptCharaTalk = {
    type: ScriptComponentType.CHARA_TALK;
    speakerCode: string;
    assetSet?: ScriptAssetSet;
};

export type CharaTalkToggleOption = "on" | "off" | "depthOn" | "depthOff";

export type ScriptCharaTalkToggle = {
    type: ScriptComponentType.CHARA_TALK_TOGGLE;
    toggle: CharaTalkToggleOption;
};

export type ScriptCharaFace = {
    type: ScriptComponentType.CHARA_FACE;
    speakerCode: string;
    face: number;
    assetSet?: ScriptAssetSet;
};

export type CharaFilterType = "silhouette" | "normal";

export type ScriptCharaFilter = {
    type: ScriptComponentType.CHARA_FILTER;
    speakerCode: string;
    filter: CharaFilterType;
    colorHex: string;
    assetSet?: ScriptAssetSet;
};

const positionList = [
    { x: -256, y: 0 },
    { x: 0, y: 0 },
    { x: 256, y: 0 },
    { x: -438, y: 0 },
    { x: -512, y: 0 },
    { x: 438, y: 0 },
    { x: 512, y: 0 },
];

const getPosition = (positionString: string) => {
    return positionString.includes(",")
        ? {
              x: parseFloat(positionString.split(",")[0]),
              y: parseFloat(positionString.split(",")[1]),
          }
        : positionList[parseInt(positionString)];
};

export type ScriptCharaFadeIn = {
    type: ScriptComponentType.CHARA_FADE_IN;
    speakerCode: string;
    durationSec: number;
    position?: { x: number; y: number };
    assetSet?: ScriptAssetSet;
};

export type ScriptCharaFadeOut = {
    type: ScriptComponentType.CHARA_FADE_OUT;
    speakerCode: string;
    durationSec: number;
    assetSet?: ScriptAssetSet;
};

export type ScriptCharaFadeTime = {
    type: ScriptComponentType.CHARA_FADE_TIME;
    speakerCode: string;
    duration: number;
    alpha: number;
    assetSet?: ScriptAssetSet;
};

export type ScriptCharaPut = {
    type: ScriptComponentType.CHARA_PUT;
    speakerCode: string;
    position: { x: number; y: number };
    assetSet?: ScriptAssetSet;
};

export type ScriptCharaScale = {
    type: ScriptComponentType.CHARA_SCALE;
    speakerCode: string;
    scale: number;
    assetSet?: ScriptAssetSet;
};

export type ScriptCharaDepth = {
    type: ScriptComponentType.CHARA_DEPTH;
    speakerCode: string;
    depth: number;
    assetSet?: ScriptAssetSet;
};

export type CharaCutInEffect =
    | "leftToRight"
    | "upToDown"
    | "circleIn"
    | "leftDownToRightUp"
    | "rightUpToLeftDown"
    | "wormEaten";

export type ScriptCharaCutIn = {
    type: ScriptComponentType.CHARA_CUT_IN;
    speakerCode: string;
    effect: CharaCutInEffect;
    durationSec: number;
    mgd: number;
    pause: boolean;
    assetSet?: ScriptAssetSet;
};

export type ScriptLabel = {
    type: ScriptComponentType.LABEL;
    name: string;
};

export type ScriptBranch = {
    type: ScriptComponentType.BRANCH;
    labelName: string;
    flag?: {
        name: string;
        value: string;
    };
};

export type ScriptBranchQuestNotClear = {
    type: ScriptComponentType.BRANCH_QUEST_NOT_CLEAR;
    labelName: string;
    questId: number;
};

export type ScriptBranchMasterGender = {
    type: ScriptComponentType.BRANCH_MASTER_GENDER;
    maleLabelName: string;
    femaleLabelName: string;
};

export type ScriptBgm = {
    type: ScriptComponentType.BGM;
    bgm: ScriptSound;
    volumne?: number;
    fadeinTime?: number;
};

export type ScriptBgmStop = {
    type: ScriptComponentType.BGM_STOP;
    bgm: ScriptSound;
    fadeoutTime: number;
};

export type ScriptVoice = {
    type: ScriptComponentType.VOICE;
    voice: ScriptSound;
};

export type ScriptBackground = {
    type: ScriptComponentType.BACKGROUND;
    backgroundAsset: string;
    crossFadeDurationSec?: number;
};

export type ScriptFlag = {
    type: ScriptComponentType.FLAG;
    name: string;
    value: string;
};

export type ScriptUnParsed = {
    type: ScriptComponentType.UNPARSED;
    parameters: string[];
};

// In contrast with components that span multiple lines like Dialogue or Choices
export type ScriptBracketComponent =
    | ScriptEnableFullScreen
    | ScriptUnParsed
    | ScriptSoundEffect
    | ScriptAssetSet
    | ScriptCharaChange
    | ScriptCharaTalk
    | ScriptCharaTalkToggle
    | ScriptCharaFace
    | ScriptCharaFilter
    | ScriptCharaFadeIn
    | ScriptCharaFadeOut
    | ScriptCharaFadeTime
    | ScriptCharaPut
    | ScriptCharaScale
    | ScriptCharaDepth
    | ScriptCharaCutIn
    | ScriptWait
    | ScriptLabel
    | ScriptBranch
    | ScriptBranchQuestNotClear
    | ScriptBranchMasterGender
    | ScriptBgm
    | ScriptBgmStop
    | ScriptVoice
    | ScriptBackground
    | ScriptFlag;

export type ScriptChoiceChildComponent = ScriptBracketComponent | ScriptDialogue;

export enum ScriptChoiceRouteType {
    NONE,
    BAD,
    TRUE,
}

export type ScriptChoiceRouteInfo = {
    route: number;
    saveCollection: boolean;
    routeType: ScriptChoiceRouteType;
};

export type ScriptChoice = {
    id: number;
    option: DialogueChildComponent[];
    results: ScriptChoiceChildComponent[];
    routeInfo?: ScriptChoiceRouteInfo;
};

export type ScriptChoices = {
    type: ScriptComponentType.CHOICES;
    choices: ScriptChoice[];
};

export type ScriptComponent = ScriptBracketComponent | ScriptDialogue | ScriptChoices;

export type ScriptInfo = {
    components: ScriptComponent[];
};

type ParserState = {
    choice: boolean;
    dialogue: boolean;
    assetSetMap: Map<string, ScriptAssetSet>;
    enableFullScreen?: boolean;
};

type ParserDialogueState = { colorHex?: string; size?: DialogueTextSize };

/**
 * Split the bracketed parameter into its components.
 * "[a b [c d]]" => ["a", "b", "[c d]"]
 */
function parseParameter(line: string): string[] {
    const noNewLine = line.replace("\n", " ").replace("\r", " ").trim(),
        sliceStart = noNewLine[0] === "[" ? 1 : 0,
        sliceEnd = noNewLine[noNewLine.length - 1] === "]" ? noNewLine.length - 1 : noNewLine.length;
    return noNewLine.slice(sliceStart, sliceEnd).match(/[^\s"]+|"([^"]*)"/g) ?? [];
}

function splitLine(line: string): string[] {
    let word = "";
    let wordList = [] as string[];
    let openBracket = 0;
    for (const char of line) {
        if (char === "[") {
            if (openBracket === 0) {
                if (word !== "") wordList.push(word);
                word = "[";
            } else {
                word += "[";
            }
            openBracket += 1;
        } else if (char === "]") {
            openBracket -= 1;
            if (openBracket === 0) {
                wordList.push(`${word}]`);
                word = "";
            } else {
                word += "]";
            }
        } else {
            word = word.concat(char);
        }
    }
    if (word !== "") wordList.push(word);
    return wordList;
}

function isDialogueBasic(word: string): boolean {
    const NOT_BASIC_SIGNATURES = ["se", "scene"];
    for (const signature of NOT_BASIC_SIGNATURES) {
        if (word.startsWith("[" + signature)) return false;
    }
    const BASIC_SIGNATURES = ["r", "sr", "csr", "s", "%1", "line", "#", "servantName", "image"];
    for (const signature of BASIC_SIGNATURES) {
        if (word.startsWith("[" + signature)) return true;
    }
    return false;
}

function parseDialogueBasic(
    region: Region,
    word: string,
    parserDialogueState: ParserDialogueState
): DialogueBasicComponent {
    if (word[0] === "[") {
        if (word[1] === "#") {
            // Ruby Text `[#string:ruby]`
            const [text, ruby] = word.slice(2, word.length - 1).split(":");
            return {
                type: ScriptComponentType.DIALOGUE_RUBY,
                text,
                ruby,
                colorHex: parserDialogueState.colorHex,
            };
        }

        const parameters = parseParameter(word);
        switch (parameters[0]) {
            case "r":
            case "sr":
            case "csr":
                return { type: ScriptComponentType.DIALOGUE_NEW_LINE };
            case "s":
                return {
                    type: ScriptComponentType.DIALOGUE_SPEED,
                    speed: parameters[1] === "-" ? -1 : parseFloat(parameters[1]),
                };
            case "%1":
                // Player's name
                return {
                    type: ScriptComponentType.DIALOGUE_PLAYER_NAME,
                    colorHex: parserDialogueState.colorHex,
                };
            case "line":
                return {
                    type: ScriptComponentType.DIALOGUE_LINE,
                    length: parseFloat(parameters[1]),
                    colorHex: parserDialogueState.colorHex,
                };
            case "servantName":
                const [svtId, hiddenName, trueName] = word
                    .slice(1, word.length - 1) // Remove surrounding brackets
                    .replace("servantName ", "")
                    .split(":");
                return {
                    type: ScriptComponentType.DIALOGUE_HIDDEN_NAME,
                    svtId: parseInt(svtId),
                    hiddenName,
                    trueName,
                    colorHex: parserDialogueState.colorHex,
                };
            case "image":
                const [image, ruby] = word.slice(1, word.length - 1).split(":");
                const imageName = image.split(" ")[1];
                return {
                    type: ScriptComponentType.DIALOGUE_TEXT_IMAGE,
                    imageAsset: `${AssetHost}/${region}/Marks/${imageName}.png`,
                    ruby,
                };
        }
    }
    return {
        type: ScriptComponentType.DIALOGUE_TEXT,
        text: word,
        colorHex: parserDialogueState.colorHex,
        size: parserDialogueState.size,
    };
}

function parseDialogueGender(region: Region, word: string, parserDialogueState: ParserDialogueState): DialogueGender {
    // Gender ternary `[&male:female]`
    const [male, female] = word.slice(2, word.length - 1).split(/:(?=[^\]]*(?:\[|$))/); // To split nested components
    return {
        type: ScriptComponentType.DIALOGUE_GENDER,
        male: splitLine(male).map((word) => parseDialogueBasic(region, word, parserDialogueState)),
        female: splitLine(female).map((word) => parseDialogueBasic(region, word, parserDialogueState)),
        colorHex: parserDialogueState.colorHex,
    };
}

function parseDialogueWord(
    region: Region,
    word: string,
    parserState: ParserState,
    parserDialogueState: ParserDialogueState
): DialogueChildComponent {
    if (word[0] === "[") {
        if (word[1] === "&" && word.includes(":")) {
            return parseDialogueGender(region, word, parserDialogueState);
        } else if (!isDialogueBasic(word)) {
            return parseBracketComponent(region, parseParameter(word), parserState);
        }
    }
    return parseDialogueBasic(region, word, parserDialogueState);
}

export function parseDialogueLine(region: Region, line: string, parserState: ParserState): DialogueChildComponent[] {
    let outComponents: DialogueChildComponent[] = [],
        parserDialogueState: ParserDialogueState = {};
    for (const word of splitLine(line)) {
        let parsed = false;
        if (word[0] === "[") {
            const parameters = parseParameter(word);

            const colorReg = parameters[0].match(/([0-9a-fA-F]{6})/);
            if (colorReg !== null) {
                parserDialogueState.colorHex = colorReg[1];
                parsed = true;
            }

            switch (parameters[0]) {
                case "-":
                    parserDialogueState.colorHex = undefined;
                    parserDialogueState.size = undefined;
                    parsed = true;
                    break;
                case "f":
                case "fontSize":
                case "font":
                    if (parameters[1] === "-") {
                        parserDialogueState.size = undefined;
                        parsed = true;
                        break;
                    }

                    if (parameters[1]) {
                        parserDialogueState.size = parameters[1] as DialogueTextSize;
                        parsed = true;
                        break;
                    }
            }
        }
        if (!parsed) {
            outComponents.push(parseDialogueWord(region, word, parserState, parserDialogueState));
        }
    }
    return outComponents;
}

function parseDialogueSpeaker(region: Region, line: string, parserState: ParserState): DialogueSpeaker {
    const noMarker = line.slice(1);
    let name = noMarker,
        speakerCode = undefined;

    if (noMarker.includes("：")) {
        [speakerCode, name] = noMarker.split("：");
    }

    return {
        name,
        speakerCode,
        components: parseDialogueLine(region, name, parserState),
    };
}

function getSoundEffectUrl(region: Region, fileName: string): string {
    let folder = "SE";
    switch (fileName.slice(0, 2)) {
        case "ba":
            folder = "Battle";
            break;
        case "ad":
            folder = "SE";
            break;
        case "ar":
            folder = "ResidentSE";
            break;
        case "21":
            folder = "SE_21";
            break;
    }
    return `${AssetHost}/${region}/Audio/${folder}/${fileName}.mp3`;
}

function getBgmObject(fileName: string, audioUrl: string): ScriptSound {
    return {
        id: -1,
        name: fileName,
        fileName,
        notReleased: false,
        audioAsset: audioUrl,
    };
}

function getVoiceLocation(scriptVoice: string): {
    folder: string;
    fileName: string;
} {
    const splitted = scriptVoice.split("_"),
        voiceLine = splitted[splitted.length - 1],
        fileName = splitted.slice(1).join("_"),
        folderName = voiceLine.startsWith("B") ? "Servants" : "ChrVoice",
        folder = `${folderName}_${splitted[0]}`;
    return { folder, fileName };
}

function parseBracketComponent(region: Region, parameters: string[], parserState: ParserState): ScriptBracketComponent {
    switch (parameters[0]) {
        case "charaSet":
            const charaSet = {
                type: ScriptComponentType.CHARA_SET,
                speakerCode: parameters[1],
                charaGraphId: parseInt(parameters[2]),
                charaGraphAsset: `${AssetHost}/${region}/CharaFigure/${parameters[2]}/${parameters[2]}_merged.png`,
                baseFace: parseInt(parameters[3]),
                baseName: parameters[4],
            } as ScriptCharaSet;
            parserState.assetSetMap.set(parameters[1], charaSet);
            return charaSet;
        case "imageSet":
        case "verticalImageSet":
        case "horizontalImageSet":
            let setType = ScriptComponentType.IMAGE_SET;
            switch (parameters[0]) {
                case "imageSet":
                    setType = ScriptComponentType.IMAGE_SET;
                    break;
                case "verticalImageSet":
                    setType = ScriptComponentType.VERTICAL_IMAGE_SET;
                    break;
                case "horizontalImageSet":
                    setType = ScriptComponentType.HORIZONTAL_IMAGE_SET;
                    break;
            }
            const imageSet = {
                type: setType,
                speakerCode: parameters[1],
                imageName: parameters[2],
                imageAsset: `${AssetHost}/${region}/Image/${parameters[2]}/${parameters[2]}.png`,
            } as ScriptImageSet | ScriptVerticalImageSet | ScriptHorizontalImageSet;
            parserState.assetSetMap.set(parameters[1], imageSet);
            return imageSet;
        case "equipSet":
            const equipSet = {
                type: ScriptComponentType.EQUIP_SET,
                speakerCode: parameters[1],
                equipId: parameters[2],
                equipAsset: `${AssetHost}/${region}/CharaGraph/${parameters[2]}/${parameters[2]}a.png`,
                baseFace: parseInt(parameters[3]),
                baseName: parameters[4],
            } as ScriptEquipSet;
            parserState.assetSetMap.set(parameters[1], equipSet);
            return equipSet;
        case "sceneSet":
            const sceneSet = {
                type: ScriptComponentType.SCENE_SET,
                speakerCode: parameters[1],
                backgroundId: parameters[2],
                backgroundAsset: `${AssetHost}/${region}/Back/back${parameters[2]}.png`,
                baseFace: parseInt(parameters[3]),
            } as ScriptSceneSet;
            parserState.assetSetMap.set(parameters[1], sceneSet);
            return sceneSet;
        case "charaChange":
            const charaChange = {
                type: ScriptComponentType.CHARA_CHANGE,
                speakerCode: parameters[1],
                charaGraphId: parseInt(parameters[2]),
                charaGraphAsset: `${AssetHost}/${region}/CharaFigure/${parameters[2]}/${parameters[2]}_merged.png`,
                baseFace: parseInt(parameters[3]),
                kind: parameters[4],
                speed: parseFloat(parameters[5]),
            } as ScriptCharaChange;
            parserState.assetSetMap.set(parameters[1], charaChange);
            return charaChange;
        case "charaTalk":
            if (["on", "off", "depthOn", "depthOff"].includes(parameters[1])) {
                return {
                    type: ScriptComponentType.CHARA_TALK_TOGGLE,
                    toggle: parameters[1] as CharaTalkToggleOption,
                };
            }
            return {
                type: ScriptComponentType.CHARA_TALK,
                speakerCode: parameters[1],
                assetSet: parserState.assetSetMap.get(parameters[1]),
            };
        case "charaFace":
            return {
                type: ScriptComponentType.CHARA_FACE,
                speakerCode: parameters[1],
                face: parseInt(parameters[2]),
                assetSet: parserState.assetSetMap.get(parameters[1]),
            };
        case "charaFilter":
            return {
                type: ScriptComponentType.CHARA_FILTER,
                speakerCode: parameters[1],
                filter: parameters[2] as CharaFilterType,
                colorHex: parameters[3],
                assetSet: parserState.assetSetMap.get(parameters[1]),
            };
        case "charaFadein":
            return {
                type: ScriptComponentType.CHARA_FADE_IN,
                speakerCode: parameters[1],
                durationSec: parseFloat(parameters[2]),
                position: parameters[3] !== undefined ? getPosition(parameters[3]) : undefined,
                assetSet: parserState.assetSetMap.get(parameters[1]),
            };
        case "charaFadeout":
            return {
                type: ScriptComponentType.CHARA_FADE_OUT,
                speakerCode: parameters[1],
                durationSec: parseFloat(parameters[2]),
                assetSet: parserState.assetSetMap.get(parameters[1]),
            };
        case "charaFadeTime":
            return {
                type: ScriptComponentType.CHARA_FADE_TIME,
                speakerCode: parameters[1],
                duration: parseFloat(parameters[2]),
                alpha: parseFloat(parameters[3]),
                assetSet: parserState.assetSetMap.get(parameters[1]),
            };
        case "charaPut":
            return {
                type: ScriptComponentType.CHARA_PUT,
                speakerCode: parameters[1],
                position: getPosition(parameters[2]),
                assetSet: parserState.assetSetMap.get(parameters[1]),
            };
        case "charaScale":
            return {
                type: ScriptComponentType.CHARA_SCALE,
                speakerCode: parameters[1],
                scale: parseFloat(parameters[2]),
                assetSet: parserState.assetSetMap.get(parameters[1]),
            };
        case "charaDepth":
            return {
                type: ScriptComponentType.CHARA_DEPTH,
                speakerCode: parameters[1],
                depth: parseFloat(parameters[2]),
                assetSet: parserState.assetSetMap.get(parameters[1]),
            };
        case "charaCutin":
        case "charaCutinPause":
            return {
                type: ScriptComponentType.CHARA_CUT_IN,
                speakerCode: parameters[1],
                effect: parameters[2] as CharaCutInEffect,
                durationSec: parseFloat(parameters[3]),
                mgd: parameters[4] !== undefined ? parseFloat(parameters[4]) : 0,
                pause: parameters[0] === "charaCutinPause",
                assetSet: parserState.assetSetMap.get(parameters[1]),
            };
        case "se":
            return {
                type: ScriptComponentType.SOUND_EFFECT,
                soundEffect: getBgmObject(parameters[1], getSoundEffectUrl(region, parameters[1])),
            };
        case "wt":
            return {
                type: ScriptComponentType.WAIT,
                durationSec: parseFloat(parameters[1]),
            };
        case "label":
            return {
                type: ScriptComponentType.LABEL,
                name: parameters[1],
            };
        case "branch":
            if (parameters[2] !== undefined && parameters[3] !== undefined) {
                return {
                    type: ScriptComponentType.BRANCH,
                    labelName: parameters[1],
                    flag: {
                        name: parameters[2],
                        value: parameters[3],
                    },
                };
            } else {
                return {
                    type: ScriptComponentType.BRANCH,
                    labelName: parameters[1],
                };
            }
        case "branchQuestNotClear":
            return {
                type: ScriptComponentType.BRANCH_QUEST_NOT_CLEAR,
                labelName: parameters[1],
                questId: parseInt(parameters[2]),
            };
        case "bgm":
            return {
                type: ScriptComponentType.BGM,
                bgm: getBgmObject(parameters[1], `${AssetHost}/${region}/Audio/${parameters[1]}/${parameters[1]}.mp3`),
                volumne: parameters[2] === undefined ? undefined : parseFloat(parameters[2]),
                fadeinTime: parameters[3] === undefined ? undefined : parseFloat(parameters[3]),
            };
        case "bgmStop":
            return {
                type: ScriptComponentType.BGM_STOP,
                bgm: getBgmObject(parameters[1], `${AssetHost}/${region}/Audio/${parameters[1]}/${parameters[1]}.mp3`),
                fadeoutTime: parseFloat(parameters[2]),
            };
        case "voice":
            const { folder, fileName } = getVoiceLocation(parameters[1]),
                audioUrl = `${AssetHost}/${region}/Audio/${folder}/${fileName}.mp3`;
            return {
                type: ScriptComponentType.VOICE,
                voice: getBgmObject(fileName, audioUrl),
            };
        case "scene":
            return {
                type: ScriptComponentType.BACKGROUND,
                backgroundAsset: parserState.enableFullScreen
                    ? `${AssetHost}/${region}/Back/back${parameters[1]}_1344_626.png`
                    : `${AssetHost}/${region}/Back/back${parameters[1]}.png`,
                crossFadeDurationSec: parameters[3] === undefined ? undefined : parseFloat(parameters[3]),
            };
        case "flag":
            return {
                type: ScriptComponentType.FLAG,
                name: parameters[1],
                value: parameters[2],
            };
        case "masterBranch":
            return {
                type: ScriptComponentType.BRANCH_MASTER_GENDER,
                maleLabelName: parameters[1],
                femaleLabelName: parameters[2],
            };
        case "enableFullScreen":
            parserState.enableFullScreen = true;
            return { type: ScriptComponentType.ENABLE_FULL_SCREEN };
        default:
            return {
                type: ScriptComponentType.UNPARSED,
                parameters,
            };
    }
}

export function parseScript(region: Region, script: string): ScriptInfo {
    let components = [] as ScriptComponent[];

    let dialogue: ScriptDialogue = {
        type: ScriptComponentType.DIALOGUE,
        speaker: undefined,
        lines: [],
        components: [],
        voice: undefined,
    };
    let choices = [] as ScriptChoice[];
    let choice: ScriptChoice = {
        id: -1,
        option: [],
        results: [],
    };

    let parserState: ParserState = {
        choice: false,
        dialogue: false,
        assetSetMap: new Map(),
    };

    const resetDialogueVariables = () => {
        dialogue.speaker = undefined;
        dialogue.voice = undefined;
        dialogue.lines = [];
        dialogue.components = [];
    };
    const resetChoiceVariables = () => {
        choice.id = -1;
        choice.option = [];
        choice.results = [];
    };
    const finalizeDialogueComponent = () => {
        dialogue.components = [parseDialogueLine(region, dialogue.lines.join(""), parserState)];
        // dialogue.components = dialogue.lines.map((line) =>
        //     parseDialogueLine(region, line, parserState)
        // );
        if (parserState.choice) {
            choice.results.push({ ...dialogue });
        } else {
            components.push({ ...dialogue });
        }

        parserState.dialogue = false;
        resetDialogueVariables();
    };

    const lineEnding = script.includes("\r\n") ? "\r\n" : "\n";

    for (const line of script.split(lineEnding)) {
        if (line.startsWith("//")) continue;
        if (line.includes("wait voiceCancel")) {
            const dialogueChildComponents = parseDialogueLine(region, line, parserState);
            const dialogueComponent = {
                type: ScriptComponentType.DIALOGUE,
                speaker: undefined,
                lines: [line],
                components: [dialogueChildComponents],
                voice: undefined,
            } as ScriptDialogue;
            for (const component of dialogueChildComponents) {
                if (component.type === ScriptComponentType.VOICE) {
                    dialogueComponent.voice = component.voice;
                }
            }
            components.push(dialogueComponent);
        }
        switch (line[0]) {
            case "＄":
                // First line script info: ＄01-00-08-19-2-2
                break;
            case "[":
                const parameters = parseParameter(line);
                switch (parameters[0]) {
                    case "k":
                    case "page":
                        finalizeDialogueComponent();
                        resetDialogueVariables();
                        break;
                    case "tVoice":
                        const folder = parameters[1];
                        const fileName = parameters[2];
                        const audioUrl = `${AssetHost}/${region}/Audio/${folder}/${fileName}.mp3`;
                        dialogue.voice = getBgmObject(fileName, audioUrl);
                        break;
                    default:
                        if (parserState.dialogue) {
                            dialogue.lines.push(line);
                            if (line.endsWith("[k]")) {
                                finalizeDialogueComponent();
                            }
                            break;
                        } else {
                            const parsedComponent = parseBracketComponent(region, parameters, parserState);
                            if (parserState.choice) {
                                choice.results.push(parsedComponent);
                            } else {
                                components.push(parsedComponent);
                            }
                        }
                }
                break;
            case "＠":
                parserState.dialogue = true;
                dialogue.speaker = parseDialogueSpeaker(region, line, parserState);
                break;
            case "？":
                if (line[1] === "！") {
                    choices.push({ ...choice });
                    components.push({
                        type: ScriptComponentType.CHOICES,
                        choices,
                    });
                    resetChoiceVariables();
                    choices = [];
                    parserState.choice = false;
                    break;
                }

                const [routeDetail, optionText] = splitString(line.slice(1), "：", 1);
                const lineChoiceNumber = parseInt(routeDetail[0]);
                if (lineChoiceNumber !== choice.id && choice.id !== -1) {
                    choices.push({ ...choice });
                }

                choice.id = lineChoiceNumber;
                choice.option = parseDialogueLine(region, optionText, parserState);
                choice.results = [];
                if (routeDetail.includes(",")) {
                    const routeParams = routeDetail.split(",");
                    let routeType = ScriptChoiceRouteType.NONE;
                    switch (routeParams[3]) {
                        case "trueRoute":
                            routeType = ScriptChoiceRouteType.TRUE;
                            break;
                        case "badRoute":
                            routeType = ScriptChoiceRouteType.BAD;
                            break;
                    }
                    choice.routeInfo = {
                        route: parseInt(routeParams[1]),
                        saveCollection: routeParams[2] === "saveCollection",
                        routeType,
                    };
                }

                parserState.choice = true;
                break;
            case undefined:
                break;
            default:
                dialogue.lines.push(line);
                // Hacky way to do this. The proper way is to parse by characters.
                if (line.endsWith("[k]")) {
                    finalizeDialogueComponent();
                    resetDialogueVariables();
                }
        }
    }

    return { components };
}

const countWordInString = (region: Region, text: string) => {
    if (region === Region.NA) {
        return text.split(/\s+/g).length;
    } else {
        return text.replace(/\s+/g, "").length;
    }
};

export const countWord = (region: Region, components: ScriptComponent[]) => {
    let wordCount = 0;
    const addWordCountBasic = (component: DialogueBasicComponent) => {
        switch (component.type) {
            case ScriptComponentType.DIALOGUE_TEXT:
            case ScriptComponentType.DIALOGUE_RUBY:
                wordCount += countWordInString(region, component.text);
                break;
            case ScriptComponentType.DIALOGUE_HIDDEN_NAME:
                wordCount += countWordInString(region, component.trueName);
                break;
        }
    };

    const addWordCountNotChoice = (component: ScriptComponent) => {
        if (component.type === ScriptComponentType.DIALOGUE) {
            for (const childComponent of flatten(component.components)) {
                switch (childComponent.type) {
                    case ScriptComponentType.DIALOGUE_TEXT:
                    case ScriptComponentType.DIALOGUE_RUBY:
                    case ScriptComponentType.DIALOGUE_HIDDEN_NAME:
                        addWordCountBasic(childComponent);
                        break;
                    case ScriptComponentType.DIALOGUE_GENDER:
                        childComponent.female.forEach(addWordCountBasic);
                        break;
                }
            }
        }
    };

    for (const component of components) {
        switch (component.type) {
            case ScriptComponentType.CHOICES:
                for (const choice of component.choices) {
                    for (const choiceComponent of choice.results) {
                        addWordCountNotChoice(choiceComponent);
                    }
                }
                break;
            default:
                addWordCountNotChoice(component);
        }
    }

    return wordCount;
};
