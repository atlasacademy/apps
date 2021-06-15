import { Region } from "@atlasacademy/api-connector";
import { AssetHost } from "../Api";

export enum ScriptComponentType {
    UN_PARSED,
    CHARA_SET,
    CHARA_FACE,
    CHARA_FADE_IN,
    CHARA_FADE_OUT,
    DIALOGUE,
    CHOICES,
    SOUND_EFFECT,
    WAIT,
    LABEL,
    BRANCH,
    BGM,
    BGM_STOP,
    BACKGROUND,
    FLAG,
    DIALOGUE_TEXT,
    DIALOGUE_NEW_LINE,
    DIALOGUE_PLAYER_NAME,
    DIALOGUE_LINE,
    DIALOGUE_GENDER,
    DIALOGUE_RUBY,
    DIALOGUE_HIDDEN_NAME,
}

export type ScriptSound = {
    id: number;
    name: string;
    fileName: string;
    notReleased: boolean;
    audioAsset: string;
};

export type DialogueText = {
    type: ScriptComponentType.DIALOGUE_TEXT;
    text: string;
    colorHex?: string;
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

export type DialogueBasicComponent =
    | DialogueText
    | DialogueNewLine
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

export type DialogueChildComponent =
    | DialogueBasicComponent
    | DialogueGender
    | ScriptBracketComponent;

export type DialogueSpeaker = {
    name: string;
    speakerCode?: string;
    components: DialogueChildComponent[];
};

export type ScriptDialogue = {
    type: ScriptComponentType.DIALOGUE;
    speaker: DialogueSpeaker;
    lines: string[];
    components: DialogueChildComponent[][];
    voice?: ScriptSound;
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
    charaGraphId: string; // "8001000", "98003003", "98002000"
    baseFace: number; // 1
    baseName: string; // "Mash", `"Dr. Roman"`, "Fou"
};

export type ScriptCharaFace = {
    type: ScriptComponentType.CHARA_FACE;
    speakerCode: string;
    face: number;
};

export type ScriptCharaFadeIn = {
    type: ScriptComponentType.CHARA_FADE_IN;
    speakerCode: string;
    durationSec: number;
    face: number;
};

export type ScriptCharaFadeOut = {
    type: ScriptComponentType.CHARA_FADE_OUT;
    speakerCode: string;
    durationSec: number;
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
    type: ScriptComponentType.UN_PARSED;
    parameters: string[];
};

// In contrast with components that span multiple lines like Dialogue or Choices
export type ScriptBracketComponent =
    | ScriptUnParsed
    | ScriptSoundEffect
    | ScriptCharaSet
    | ScriptCharaFace
    | ScriptCharaFadeIn
    | ScriptCharaFadeOut
    | ScriptWait
    | ScriptLabel
    | ScriptBranch
    | ScriptBgm
    | ScriptBgmStop
    | ScriptBackground
    | ScriptFlag;

export type ScriptChoiceChildComponent =
    | ScriptBracketComponent
    | ScriptDialogue;

export type ScriptChoice = {
    id: number;
    option: DialogueChildComponent[];
    results: ScriptChoiceChildComponent[];
};

export type ScriptChoices = {
    type: ScriptComponentType.CHOICES;
    choices: ScriptChoice[];
};

export type ScriptComponent =
    | ScriptBracketComponent
    | ScriptDialogue
    | ScriptChoices;

export type ScriptInfo = {
    components: ScriptComponent[];
};

function parseParameter(line: string): string[] {
    const noNewLine = line.replace("\n", " ").replace("\r", " ").trim();
    return (
        noNewLine.slice(1, noNewLine.length - 1).match(/[^\s"]+|"([^"]*)"/g) ??
        []
    );
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
    const BASIC_SIGNATURES = ["r", "sr", "%1", "line", "#", "servantName"];
    for (const signature of BASIC_SIGNATURES) {
        if (word.startsWith("[" + signature)) return true;
    }
    return false;
}

function parseDialogueBasic(
    word: string,
    colorHex?: string
): DialogueBasicComponent {
    const parameters = parseParameter(word);
    switch (parameters[0]) {
        case "r":
        case "sr":
            return { type: ScriptComponentType.DIALOGUE_NEW_LINE };
        case "%1":
            // Player's name
            return { type: ScriptComponentType.DIALOGUE_PLAYER_NAME, colorHex };
        case "line":
            return {
                type: ScriptComponentType.DIALOGUE_LINE,
                length: parseInt(parameters[1]),
                colorHex,
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
                colorHex,
            };
    }
    switch (word[1]) {
        case "#":
            // Ruby Text `[#string:ruby]`
            const [text, ruby] = word.slice(2, word.length - 1).split(":");
            return {
                type: ScriptComponentType.DIALOGUE_RUBY,
                text: text,
                ruby: ruby,
                colorHex,
            };
    }
    return {
        type: ScriptComponentType.DIALOGUE_TEXT,
        text: word,
        colorHex,
    };
}

function parseDialogueGender(word: string, colorHex?: string): DialogueGender {
    // Gender ternary `[&male:female]`
    const [male, female] = word
        .slice(2, word.length - 1)
        .split(/:(?=[^\]]*(?:\[|$))/); // To split nested components
    return {
        type: ScriptComponentType.DIALOGUE_GENDER,
        male: splitLine(male).map((word) => parseDialogueBasic(word)),
        female: splitLine(female).map((word) => parseDialogueBasic(word)),
        colorHex,
    };
}

function parseDialogueWord(
    region: Region,
    word: string,
    colorHex?: string
): DialogueChildComponent {
    if (word[0] === "[") {
        if (word[1] === "&") {
            return parseDialogueGender(word, colorHex);
        } else if (!isDialogueBasic(word)) {
            return parseBracketComponent(region, parseParameter(word));
        }
    }
    return parseDialogueBasic(word, colorHex);
}

function parseDialogueLine(
    region: Region,
    line: string
): DialogueChildComponent[] {
    let outComponents: DialogueChildComponent[] = [],
        colorHex = undefined;
    for (const word of splitLine(line)) {
        if (word[0] === "[") {
            const colorReg = word.match(/\[([0-9a-f]{6})\]/);
            if (colorReg !== null) {
                colorHex = colorReg[1];
                continue;
            } else if (word[1] === "-") {
                colorHex = undefined;
                continue;
            }
        }
        outComponents.push(parseDialogueWord(region, word, colorHex));
    }
    return outComponents;
}

function parseDialogueSpeaker(region: Region, line: string): DialogueSpeaker {
    const noMarker = line.slice(1);
    let name = noMarker,
        speakerCode = undefined;

    if (noMarker.includes("：")) {
        [speakerCode, name] = noMarker.split("：");
    }

    return {
        name,
        speakerCode,
        components: parseDialogueLine(region, name),
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

function parseBracketComponent(
    region: Region,
    parameters: string[]
): ScriptBracketComponent {
    switch (parameters[0]) {
        case "charaSet":
            return {
                type: ScriptComponentType.CHARA_SET,
                speakerCode: parameters[1],
                charaGraphId: parameters[2],
                baseFace: parseInt(parameters[3]),
                baseName: parameters[4],
            };
        case "charaFace":
            return {
                type: ScriptComponentType.CHARA_FACE,
                speakerCode: parameters[1],
                face: parseInt(parameters[2]),
            };
        case "charaFadein":
            return {
                type: ScriptComponentType.CHARA_FADE_IN,
                speakerCode: parameters[1],
                durationSec: parseFloat(parameters[2]),
                face: parseInt(parameters[3]),
            };
        case "charaFadeout":
            return {
                type: ScriptComponentType.CHARA_FADE_OUT,
                speakerCode: parameters[1],
                durationSec: parseFloat(parameters[2]),
            };
        case "se":
            return {
                type: ScriptComponentType.SOUND_EFFECT,
                soundEffect: getBgmObject(
                    parameters[1],
                    getSoundEffectUrl(region, parameters[1])
                ),
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
        case "bgm":
            return {
                type: ScriptComponentType.BGM,
                bgm: getBgmObject(
                    parameters[1],
                    `${AssetHost}/${region}/Audio/${parameters[1]}/${parameters[1]}.mp3`
                ),
                volumne:
                    parameters[2] === undefined
                        ? undefined
                        : parseFloat(parameters[2]),
                fadeinTime:
                    parameters[3] === undefined
                        ? undefined
                        : parseFloat(parameters[3]),
            };
        case "bgmStop":
            return {
                type: ScriptComponentType.BGM_STOP,
                bgm: getBgmObject(
                    parameters[1],
                    `${AssetHost}/${region}/Audio/${parameters[1]}/${parameters[1]}.mp3`
                ),
                fadeoutTime: parseFloat(parameters[2]),
            };
        case "scene":
            return {
                type: ScriptComponentType.BACKGROUND,
                backgroundAsset: `${AssetHost}/${region}/Back/back${parameters[1]}.png`,
                crossFadeDurationSec:
                    parameters[3] === undefined
                        ? undefined
                        : parseFloat(parameters[3]),
            };
        case "flag":
            return {
                type: ScriptComponentType.FLAG,
                name: parameters[1],
                value: parameters[2],
            };
        default:
            return {
                type: ScriptComponentType.UN_PARSED,
                parameters,
            };
    }
}

export function parseScript(region: Region, script: string): ScriptInfo {
    let components = [] as ScriptComponent[];

    let dialogue: ScriptDialogue = {
        type: ScriptComponentType.DIALOGUE,
        speaker: { name: "", components: [] },
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

    let parserState = {
        choice: false,
        dialogue: false,
    };

    const resetDialogueVariables = () => {
        dialogue.speaker = { name: "", components: [] };
        dialogue.voice = undefined;
        dialogue.lines = [];
        dialogue.components = [];
    };
    const resetChoiceVariables = () => {
        choice.id = -1;
        choice.option = [];
        choice.results = [];
    };

    const lineEnding = script.includes("\r\n") ? "\r\n" : "\n";

    for (const line of script.split(lineEnding)) {
        switch (line[0]) {
            case "＄":
                // First line script info: ＄01-00-08-19-2-2
                break;
            case "[":
                const parameters = parseParameter(line);
                switch (parameters[0]) {
                    case "k":
                        dialogue.components = dialogue.lines
                            .map((line) => parseDialogueLine(region, line));
                        if (parserState.choice) {
                            choice.results.push({ ...dialogue });
                        } else {
                            components.push({ ...dialogue });
                        }

                        resetDialogueVariables();
                        parserState.dialogue = false;
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
                            break;
                        } else {
                            const parsedComponent = parseBracketComponent(
                                region,
                                parameters
                            );
                            if (parserState.choice) {
                                choice.results.push(parsedComponent);
                            } else {
                                components.push(parsedComponent);
                            }
                        }
                }
                break;
            case "＠":
                dialogue.speaker = parseDialogueSpeaker(region, line);
                parserState.dialogue = true;
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

                const lineChoiceNumber = parseInt(line[1]);
                if (lineChoiceNumber !== choice.id && choice.id !== -1) {
                    choices.push({ ...choice });
                }

                choice.id = lineChoiceNumber;
                choice.option = parseDialogueLine(region, line.slice(3));
                choice.results = [];

                parserState.choice = true;
                break;
            case undefined:
                break;
            default:
                if (parserState.dialogue) {
                    dialogue.lines.push(line);
                    break;
                }
        }
    }

    return { components };
}
