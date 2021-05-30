import { Region } from "@atlasacademy/api-connector";
import { AssetHost } from "../Api";
import BgmDescriptor from "../Descriptor/BgmDescriptor";
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

const ScriptDialogueLine = (props: { region: Region; line: string }) => {
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
            case "tVoice":
                const folder = parameters[1];
                const fileName = parameters[2];
                const audioUrl = `${AssetHost}/${props.region}/Audio/${folder}/${fileName}.mp3`;
                parts.push(
                    <BgmDescriptor
                        region={props.region}
                        bgm={{
                            id: -1,
                            name: `${folder} ${fileName}`,
                            audioAsset: audioUrl,
                        }}
                    />
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
