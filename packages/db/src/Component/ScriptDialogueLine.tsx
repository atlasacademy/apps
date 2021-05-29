import { Region } from "@atlasacademy/api-connector";
import { mergeElements, Renderable } from "../Helper/OutputHelper";
import Manager from "../Setting/Manager";
import { parseParameter } from "./Script";

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
                            width: `${25 * parseInt(parameters[1])}px`,
                            height: "1em",
                            borderBottom: "1px solid black",
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
