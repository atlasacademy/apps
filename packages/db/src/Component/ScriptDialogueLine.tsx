import { Region } from "@atlasacademy/api-connector";
import { mergeElements, Renderable } from "../Helper/OutputHelper";
import { colorString } from "../Helper/StringHelper";
import Manager from "../Setting/Manager";
import { parseParameter } from "./Script";

export const ScriptSpeakerName = (props: { name: string }) => {
    const name = props.name;
    const match = name.match(/\[(.*)\]/);
    if (match !== null) {
        const parameter = match[1];
        if (parameter.startsWith("servantName")) {
            const servantName = parameter
                .replace("servantName ", "")
                .split(":")[2];
            return <>{colorString(servantName)}</>;
        }
    }
    if (name[1] === "：") return <>{colorString(name.split("：")[1].trim())}</>;

    return <>{colorString(name)}</>;
};

const splitLine = (line: string) => {
    let word = "";
    let wordList = [] as string[];
    for (const char of line) {
        if (char === "[") {
            if (word !== "") wordList.push(word);
            word = "[";
        } else if (char === "]") {
            wordList.push(`${word}]`);
            word = "";
        } else {
            word = word.concat(char);
        }
    }
    if (word !== "") wordList.push(word);
    return wordList;
};

const ScriptDialogueLine = (props: { line: string }) => {
    const words = splitLine(props.line);
    let parts = [] as Renderable[];

    for (const word of words) {
        if (word[0] !== "[") {
            parts.push(word);
            continue;
        }

        const parameters = parseParameter(word.slice(1, word.length - 1));
        switch (parameters[0]) {
            case "sr":
                parts.push(<br />);
                break;
            case "%1":
                parts.push(
                    Manager.region() === Region.JP ? "ぐだ子" : "Gudako"
                );
                break;
            case "line":
                parts.push(
                    <div
                        style={{
                            width: `${15 * parseInt(parameters[1])}px`,
                            height: "0.25em",
                            borderTop: "1px solid black",
                            margin: "0 0.125em 0 0.25em",
                            display: "inline-block",
                        }}
                    ></div>
                );
                break;
            default:
                if (word[1] === "&") {
                    const genderChoices = word
                        .slice(2, word.length - 1)
                        .split(":");
                    parts.push(genderChoices[1]);
                }
        }
    }

    return <>{mergeElements(parts, "")}</>;
};

export default ScriptDialogueLine;
