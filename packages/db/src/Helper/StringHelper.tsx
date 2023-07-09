import Fuse from "fuse.js";
import React from "react";

import { Region } from "@atlasacademy/api-connector";

import { parseDialogueLine } from "../Component/Script";
import { DialogueChild } from "../Component/ScriptDialogueLine";

const isEnglishText = (inputString: string) => {
    const spaceRemoved = inputString.replace(/\s/g, "");
    const latinCharCount = (spaceRemoved.match(/[\u0020-\u024F]/g) ?? []).length;
    return latinCharCount / spaceRemoved.length > 0.9;
};

export const Ruby = ({
    region,
    text,
    ruby,
    splitRank,
}: {
    region: Region;
    text: string;
    ruby: string;
    splitRank?: boolean;
}) => {
    if (region !== Region.JP || isEnglishText(text)) {
        return <>{text}</>;
    }

    let textSplitted = text.split(" ");
    let rank = textSplitted[textSplitted.length - 1];
    let skillName = textSplitted.slice(0, -1).join(" ");
    if (text === ruby || ruby === "-") {
        return <>{text}</>;
    } else if (splitRank && rank.length > 0 && ["A", "B", "C", "D", "E"].includes(rank[0].toUpperCase())) {
        return (
            <ruby>
                <FGOText text={skillName} />
                <rp>(</rp>
                <rt>
                    <FGOText text={ruby} />
                </rt>
                <rp>)</rp>&nbsp;{rank}
            </ruby>
        );
    } else {
        return (
            <ruby>
                <FGOText text={text} />
                <rp>(</rp>
                <rt>
                    <FGOText text={ruby} />
                </rt>
                <rp>)</rp>
            </ruby>
        );
    }
};

export function joinNumbers(numbers: number[]): string {
    if (numbers.length === 0) {
        return "";
    } else if (numbers.length === 1) {
        return numbers[0].toString();
    } else {
        return numbers.slice(0, -1).join(", ") + " and " + numbers[numbers.length - 1];
    }
}

interface SearchOptions {
    [key: string]: string | string[] | number | number[] | boolean | undefined;
}

export function getURLSearchParams(options: SearchOptions) {
    let searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(options)) {
        if (Array.isArray(value)) {
            for (const item of value) {
                searchParams.append(key, item.toString());
            }
        } else if (value !== undefined) {
            searchParams.append(key, value.toString());
        }
    }
    return searchParams;
}

export function isPositiveInteger(str: string) {
    return /^\d+$/.test(str);
}

const OrdinalSuperscript = new Map([
    [1, "st"],
    [2, "nd"],
    [3, "rd"],
]);

export const OrdinalNumeral = ({ index }: { index: number }) => {
    const superscript = index % 100 >= 11 && index % 100 <= 19 ? "th" : OrdinalSuperscript.get(index % 10) ?? "th";
    return (
        <span>
            {index}
            <sup>{superscript}</sup>
        </span>
    );
};

export const colorString = (inputString: string) => {
    // Can't use the given colors since they might look bad on different db themes
    return inputString.replace(/\[[a-zA-Z0-9]{6}\]/g, "").replace("[-]", "");
};

export const interpolateString = (inputString: string, variables?: any[]) => {
    if (!variables) return inputString;
    for (let i = 0; i < variables.length; i++) {
        inputString = inputString.replace(`{${i}}`, variables[i].toString());
    }
    return inputString;
};

const unicodeFromHex = (hex: string) => String.fromCharCode(parseInt(hex.slice(1), 16));

/**
 * Render FGO text string
 * - Interpolate variables
 * - Replace unicode hex codepoint with the unicode text: "u307F" with "み"
 * - Remove color code instead of rendering them since they might look bad on different db themes
 * - Deal with PUA code points
 */
export const FGOText = ({ text, interpolatedVariables }: { text: string; interpolatedVariables?: any[] }) => {
    const unicodeReplaced = text.replace(/u[0-9A-Z]{4}/g, unicodeFromHex);
    const inpolatedText = interpolateString(unicodeReplaced, interpolatedVariables);
    const coloredText = colorString(inpolatedText);

    const elements: (string | React.ReactElement)[] = [];
    let normalText = "";
    for (const char of coloredText) {
        const codePoint = char.charCodeAt(0);
        if ((codePoint >= 0xe000 && codePoint <= 0xf8ff) || [0x9bd6, 0x8fbf].includes(codePoint)) {
            elements.push(normalText);
            normalText = "";
            switch (codePoint) {
                case 0xe000:
                    elements.push(
                        <span className="e000" lang="ja-JP">
                            <span className="e000-bottom">人</span>
                            <span className="e000-top">神</span>
                        </span>
                    );
                    break;
                case 0x9bd6:
                    elements.push(<span lang="zh-TW">鯖</span>);
                    break;
                case 0xe001:
                    elements.push(<span lang="ja-JP">鯖</span>);
                    break;
                case 0x8fbf:
                    elements.push(<span lang="ja-JP">辿</span>);
                    break;
                case 0xe002:
                    elements.push(<span lang="zh-CN">辿</span>);
                    break;
                case 0xe003:
                case 0xe004:
                case 0xe005:
                case 0xe006:
                case 0xe007:
                case 0xe008:
                case 0xe009:
                case 0xe00a:
                    elements.push(<span lang="ja-JP">▊</span>);
                    break;
                default:
                    elements.push(char);
            }
        } else {
            normalText += char;
        }
    }
    elements.push(normalText);
    return (
        <>
            {elements.map((element, i) => (
                <React.Fragment key={i}>{element}</React.Fragment>
            ))}
        </>
    );
};

export const removeSuffix = (inputString: string, suffix: string) => {
    if (inputString.endsWith(suffix)) {
        return inputString.slice(0, -suffix.length);
    }
    return inputString;
};

export const removePrefix = (inputString: string, prefix: string) => {
    if (inputString.startsWith(prefix)) {
        return inputString.slice(prefix.length);
    }
    return inputString;
};

export const VoiceSubtitleFormat = ({ region, inputString }: { region: Region; inputString: string }) => {
    const components = parseDialogueLine(region, inputString.replace("\n", "[r]"), {
        choice: false,
        dialogue: false,
        assetSetMap: new Map(),
    });
    return (
        <>
            {components.map((component, i) => (
                <DialogueChild key={i} region={region} component={component} index={i} />
            ))}
        </>
    );
};

/**
 * Return a list of the words in the string, using sep as the delimiter string.
 * If maxsplit is given, at most maxsplit splits are done (thus, the list
 * will have at most maxsplit+1 elements). If maxsplit is not specified or -1,
 * then there is no limit on the number of splits (all possible splits are made).
 * https://docs.python.org/3/library/stdtypes.html#str.split
 */
export const splitString = (inputString: string, sep: string, maxsplit?: number) => {
    if (maxsplit === undefined || maxsplit < 0) {
        return inputString.split(sep);
    } else if (maxsplit === 0) {
        return [inputString];
    } else {
        const splitted = inputString.split(sep);
        if (maxsplit + 1 >= splitted.length) {
            return splitted;
        }
        return splitted.slice(0, maxsplit).concat(splitted.slice(maxsplit).join(sep));
    }
};

// https://stackoverflow.com/a/51874002/10241289
export const removeDiacriticalMarks = (inputString: string) =>
    inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const fuseGetFn = <T,>(obj: T, path: string | string[]) => {
    const value = Fuse.config.getFn(obj, path);
    if (typeof value === "string") {
        return removeDiacriticalMarks(value);
    } else {
        return value.map((el) => removeDiacriticalMarks(el));
    }
};
