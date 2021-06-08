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
};

const renderScriptParameter = (word: string): Renderable => {
    const parameters = parseParameter(word.slice(1, word.length - 1));
    switch (parameters[0]) {
        case "r":
        case "sr":
            return <br />;
        case "%1":
            // Player's name
            return Manager.region() === Region.JP ? "ぐだ子" : "Gudako";
        case "line":
            return (
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
    }
    switch (word[1]) {
        case "&":
            // Gender ternary `[&male:female]`
            const genderChoices = word
                .slice(2, word.length - 1)
                .split(/:(?=[^\]]*(?:\[|$))/);
            return mergeElements(
                renderScriptString(splitLine(genderChoices[1])),
                ""
            );
        case "#":
            // Ruby Text `[#string:ruby]`
            const [text, ruby] = word.slice(2, word.length - 1).split(":");
            if (word !== undefined && ruby !== undefined) {
                return (
                    <ruby>
                        {text}
                        <rp>(</rp>
                        <rt>{ruby}</rt>
                        <rp>)</rp>
                    </ruby>
                );
            }
            return text;
    }
    return "";
};

const renderScriptString = (words: Renderable[]): Renderable[] => {
    let outRender = [] as Renderable[];
    for (const word of words) {
        if (typeof word === "string") {
            if (word[0] === "[") {
                outRender = outRender.concat(
                    renderScriptString([renderScriptParameter(word)])
                );
            } else if (word.includes("[")) {
                outRender = outRender.concat(
                    renderScriptString(splitLine(word))
                );
            } else {
                outRender.push(word);
            }
        } else {
            outRender.push(word);
        }
    }
    return outRender;
};

const ScriptDialogueLine = (props: { line: string }) => {
    const words = splitLine(props.line);
    const parts = renderScriptString(words);

    return <>{mergeElements(parts, "")}</>;
};

export default ScriptDialogueLine;
