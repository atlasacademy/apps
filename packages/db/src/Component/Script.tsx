export enum ScriptComponentType {
    DIALOGUE,
    CHOICES,
}

export type ScriptSpeaker = {
    speakerCode: string; // "A", "B", "C", ...
    charaGraphId: string; // "8001000", "98003003", "98002000"
    baseName: string; // "Mash", `"Dr. Roman"`, "Fou"
};

export type ScriptDialogue = {
    type: ScriptComponentType.DIALOGUE;
    speakerName: string;
    dialogueLines: string[];
};

export type ScriptNotChoiceComponent = ScriptDialogue;

export type ScriptChoice = {
    id: number;
    text: string;
    components: ScriptNotChoiceComponent[];
};

export type ScriptChoices = {
    type: ScriptComponentType.CHOICES;
    choices: ScriptChoice[];
};

export type ScriptComponent = ScriptDialogue | ScriptChoices;

export type ScriptInfo = {
    charaGraphs: ScriptSpeaker[];
    components: ScriptComponent[];
};

export function parseParameter(line: string): string[] {
    return line.match(/[^\s"]+|"([^"]*)"/g) ?? [];
}

export function parseScript(script: string): ScriptInfo {
    let charaGraphs = [] as ScriptSpeaker[];
    let components = [] as ScriptComponent[];

    let speakerName = "";
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
                            speakerName: speakerName,
                            dialogueLines: dialogueLines,
                        };

                        if (parserState.choice) {
                            choice.components.push(dialogue);
                        } else {
                            components.push(dialogue);
                        }

                        resetDialogueVariables();
                        parserState.dialogue = false;
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
