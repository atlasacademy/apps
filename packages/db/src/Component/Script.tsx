import { Region } from "@atlasacademy/api-connector";
import { AssetHost } from "../Api";

export enum ScriptComponentType {
    UN_PARSED,
    DIALOGUE,
    CHOICES,
    SOUND_EFFECT,
    WAIT,
    DIALOGUE_TEXT,
    DIALOGUE_NEW_LINE,
    DIALOGUE_PLAYER_NAME,
    DIALOGUE_LINE,
    DIALOGUE_GENDER,
    DIALOGUE_RUBY,
}

export type ScriptSound = {
    id: number;
    name: string;
    fileName: string;
    notReleased: boolean;
    audioAsset: string;
};

export type ScriptSpeaker = {
    speakerCode: string; // "A", "B", "C", ...
    charaGraphId: string; // "8001000", "98003003", "98002000"
    baseName: string; // "Mash", `"Dr. Roman"`, "Fou"
};

export type DialogueText = {
    type: ScriptComponentType.DIALOGUE_TEXT;
    text: string;
};

export type DialogueNewLine = {
    type: ScriptComponentType.DIALOGUE_NEW_LINE;
};

export type DialoguePlayerName = {
    type: ScriptComponentType.DIALOGUE_PLAYER_NAME;
};

export type DialogueLine = {
    type: ScriptComponentType.DIALOGUE_LINE;
    length: number;
};

export type DialogueRuby = {
    type: ScriptComponentType.DIALOGUE_RUBY;
    text: string;
    ruby?: string;
};

export type DialogueBasicComponent =
    | DialogueText
    | DialogueNewLine
    | DialoguePlayerName
    | DialogueLine
    | DialogueRuby;

export type DialogueGender = {
    type: ScriptComponentType.DIALOGUE_GENDER;
    male: DialogueBasicComponent[];
    female: DialogueBasicComponent[];
};

export type DialogueChildComponent =
    | DialogueBasicComponent
    | DialogueGender
    | ScriptBracketComponent;

export type ScriptDialogue = {
    type: ScriptComponentType.DIALOGUE;
    speakerName: string;
    lines: string[];
    components: DialogueChildComponent[];
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

export type ScriptUnParsed = {
    type: ScriptComponentType.UN_PARSED;
    parameters: string[];
};

// In contrast with components that span multiple lines like Dialogue or Choices
export type ScriptBracketComponent =
    | ScriptUnParsed
    | ScriptSoundEffect
    | ScriptWait;

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
    charaGraphs: ScriptSpeaker[];
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
    const BASIC_SIGNATURES = ["r", "sr", "%1", "line", "#"];
    for (const signature of BASIC_SIGNATURES) {
        if (word.startsWith("[" + signature)) return true;
    }
    return false;
}

function parseDialogueBasic(word: string): DialogueBasicComponent {
    const parameters = parseParameter(word);
    switch (parameters[0]) {
        case "r":
        case "sr":
            return { type: ScriptComponentType.DIALOGUE_NEW_LINE };
        case "%1":
            // Player's name
            return { type: ScriptComponentType.DIALOGUE_PLAYER_NAME };
        case "line":
            return {
                type: ScriptComponentType.DIALOGUE_LINE,
                length: parseInt(parameters[1]),
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
            };
    }
    return {
        type: ScriptComponentType.DIALOGUE_TEXT,
        text: word,
    };
}

function parseDialogueGender(word: string): DialogueGender {
    // Gender ternary `[&male:female]`
    const [male, female] = word
        .slice(2, word.length - 1)
        .split(/:(?=[^\]]*(?:\[|$))/); // To split nested components
    return {
        type: ScriptComponentType.DIALOGUE_GENDER,
        male: splitLine(male).map((word) => parseDialogueBasic(word)),
        female: splitLine(female).map((word) => parseDialogueBasic(word)),
    };
}

function parseDialogueWord(
    region: Region,
    word: string
): DialogueChildComponent {
    if (word[0] === "[") {
        if (word[1] === "&") {
            return parseDialogueGender(word);
        } else if (!isDialogueBasic(word)) {
            return parseBracketComponent(region, parseParameter(word));
        }
    }
    return parseDialogueBasic(word);
}

function parseDialogueLine(
    region: Region,
    line: string
): DialogueChildComponent[] {
    return splitLine(line).map((word) => parseDialogueWord(region, word));
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

function parseBracketComponent(
    region: Region,
    parameters: string[]
): ScriptBracketComponent {
    switch (parameters[0]) {
        case "se":
            return {
                type: ScriptComponentType.SOUND_EFFECT,
                soundEffect: {
                    id: -1,
                    name: parameters[1],
                    fileName: parameters[1],
                    notReleased: false,
                    audioAsset: getSoundEffectUrl(region, parameters[1]),
                },
            };
        case "wt":
            return {
                type: ScriptComponentType.WAIT,
                durationSec: parseFloat(parameters[1]),
            };
        default:
            return {
                type: ScriptComponentType.UN_PARSED,
                parameters,
            };
    }
}

export function parseScript(region: Region, script: string): ScriptInfo {
    let charaGraphs = [] as ScriptSpeaker[];
    let components = [] as ScriptComponent[];

    let dialogue: ScriptDialogue = {
        type: ScriptComponentType.DIALOGUE,
        speakerName: "",
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
        dialogue.speakerName = "";
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
                    case "charaSet":
                        charaGraphs.push({
                            speakerCode: parameters[1],
                            charaGraphId: parameters[2],
                            baseName: parameters[4],
                        });
                        break;
                    case "k":
                        dialogue.components = dialogue.lines
                            .map((line) => parseDialogueLine(region, line))
                            .flat();
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
                        dialogue.voice = {
                            id: -1,
                            name: fileName,
                            fileName,
                            notReleased: false,
                            audioAsset: audioUrl,
                        };
                        break;
                    default:
                        if (parserState.dialogue) {
                            dialogue.lines.push(line);
                            break;
                        } else {
                            components.push(
                                parseBracketComponent(region, parameters)
                            );
                        }
                }
                break;
            case "＠":
                dialogue.speakerName = line.slice(1);
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

    return { charaGraphs, components };
}
