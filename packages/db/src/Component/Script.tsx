import { Region } from "@atlasacademy/api-connector";
import { AssetHost } from "../Api";

export enum ScriptComponentType {
    DIALOGUE,
    CHOICES,
    SOUND_EFFECT,
    WAIT,
}

export type ScriptSound = {
    id: number;
    name: string;
    audioAsset: string;
};

export type ScriptSpeaker = {
    speakerCode: string; // "A", "B", "C", ...
    charaGraphId: string; // "8001000", "98003003", "98002000"
    baseName: string; // "Mash", `"Dr. Roman"`, "Fou"
};

export type ScriptDialogue = {
    type: ScriptComponentType.DIALOGUE;
    speakerName: string;
    dialogueLines: string[];
    dialogueVoice?: ScriptSound;
};

export type ScriptSoundEffect = {
    type: ScriptComponentType.SOUND_EFFECT;
    soundEffect: ScriptSound;
};

export type ScriptWait = {
    type: ScriptComponentType.WAIT;
    durationSec: number;
};

export type ScriptChoice = {
    id: number;
    text: string;
    components: ScriptNotChoiceComponent[];
};

export type ScriptChoices = {
    type: ScriptComponentType.CHOICES;
    choices: ScriptChoice[];
};

export type ScriptNotChoiceComponent =
    | ScriptDialogue
    | ScriptSoundEffect
    | ScriptWait;

export type ScriptComponent = ScriptNotChoiceComponent | ScriptChoices;

export type ScriptInfo = {
    charaGraphs: ScriptSpeaker[];
    components: ScriptComponent[];
};

export function parseParameter(line: string): string[] {
    return line.match(/[^\s"]+|"([^"]*)"/g) ?? [];
}

export function getSoundEffectUrl(region: Region, fileName: string): string {
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

export function parseScript(region: Region, script: string): ScriptInfo {
    let charaGraphs = [] as ScriptSpeaker[];
    let components = [] as ScriptComponent[];

    let speakerName = "";
    let dialogueVoice: ScriptSound | undefined = undefined;
    let dialogueLines = [] as string[];
    let choices = [] as ScriptChoice[];
    let choice = {
        id: -1,
        text: "",
        components: [] as ScriptDialogue[],
    };

    let parserState = {
        choice: false,
        dialogue: false,
    };

    const resetDialogueVariables = () => {
        speakerName = "";
        dialogueVoice = undefined;
        dialogueLines = [];
    };
    const resetChoiceVariables = () => {
        choice.id = -1;
        choice.text = "";
        choice.components = [];
    };

    const lineEnding = script.includes("\r\n") ? "\r\n" : "\n";

    for (const line of script.split(lineEnding)) {
        switch (line[0]) {
            case "[":
                const lineContent = line.slice(1, line.length - 1);
                const parameters = parseParameter(lineContent);
                switch (parameters[0]) {
                    case "charaSet":
                        charaGraphs.push({
                            speakerCode: parameters[1],
                            charaGraphId: parameters[2],
                            baseName: parameters[4],
                        });
                        break;
                    case "k":
                        const dialogue: ScriptDialogue = {
                            type: ScriptComponentType.DIALOGUE,
                            speakerName,
                            dialogueLines,
                            dialogueVoice,
                        };

                        if (parserState.choice) {
                            choice.components.push(dialogue);
                        } else {
                            components.push(dialogue);
                        }

                        resetDialogueVariables();
                        parserState.dialogue = false;
                        break;
                    case "tVoice":
                        const folder = parameters[1];
                        const fileName = parameters[2];
                        const audioUrl = `${AssetHost}/${region}/Audio/${folder}/${fileName}.mp3`;
                        dialogueVoice = {
                            id: -1,
                            name: fileName,
                            audioAsset: audioUrl,
                        };
                        break;
                    case "se":
                        components.push({
                            type: ScriptComponentType.SOUND_EFFECT,
                            soundEffect: {
                                id: -1,
                                name: parameters[1],
                                audioAsset: getSoundEffectUrl(
                                    region,
                                    parameters[1]
                                ),
                            },
                        });
                        break;
                    case "wt":
                        components.push({
                            type: ScriptComponentType.WAIT,
                            durationSec: parseFloat(parameters[1]),
                        });
                        break;
                    default:
                        if (parserState.dialogue) {
                            dialogueLines.push(line);
                            break;
                        }
                }
                break;
            case "＠":
                speakerName = line.slice(1);
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
                choice.text = line.slice(3);
                choice.components = [];

                parserState.choice = true;
                break;
            case undefined:
                break;
            default:
                if (parserState.dialogue) {
                    dialogueLines.push(line);
                    break;
                }
        }
    }

    return { charaGraphs, components };
}
