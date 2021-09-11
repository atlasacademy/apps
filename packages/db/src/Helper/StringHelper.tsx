import {Region} from "@atlasacademy/api-connector";
import {mergeElements, Renderable} from "./OutputHelper";

import "./StringHelper.css";

export default function getRubyText(region: Region, text: string, ruby: string, splitRank = false): Renderable {
    if (region === Region.JP && !text.split(" ")[0].match(/[a-zA-Z]/g)) {
        return makeRubyText(text, ruby, splitRank);
    } else {
        return text;
    }
}

export function makeRubyText(text: string, ruby: string, splitRank = false): Renderable {
    let textSplitted = text.split(" ");
    let rank = textSplitted[textSplitted.length - 1];
    let skillName = textSplitted.slice(0, -1).join(" ");
    if (text === ruby || ruby === "-") {
        return text;
    } else if (splitRank && rank.length > 0 && ["A", "B", "C", "D", "E"].includes(rank[0].toUpperCase())) {
        return (
            <ruby>
                {replacePUACodePoints(skillName)}
                <rp>(</rp>
                <rt>{replacePUACodePoints(ruby)}</rt>
                <rp>)</rp>&nbsp;{rank}
            </ruby>
        )
    } else {
        return (
            <ruby>
                {replacePUACodePoints(text)}
                <rp>(</rp>
                <rt>{replacePUACodePoints(ruby)}</rt>
                <rp>)</rp>
            </ruby>
        )
    }
}

export function joinNumbers(numbers: number[]): string {
    if (numbers.length === 0) {
        return '';
    } else if (numbers.length === 1) {
        return numbers[0].toString();
    } else {
        return numbers.slice(0, -1).join(', ') + ' and ' + numbers[numbers.length - 1];
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
            searchParams.append(key, value.toString())
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

export const ordinalNumeral = (index: number) => {
    const superscript = OrdinalSuperscript.get(index % 10) ?? "th";
    return (
        <span>
            {index}
            <sup>{superscript}</sup>
        </span>
    );
};

export const colorString = (inputString: string) => {
    // Can't use the given colors since they might look bad on different db themes
    return inputString.replace(/\[[a-zA-z0-9-]+\]/g, "");
}

export const interpolateString = (inputString: string, variables: any[]) => {
    for (let i = 0; i < variables.length; i++) {
        inputString = inputString.replace(`{${i}}`, variables[i].toString())
    }
    return inputString;
};

export const replacePUACodePoints = (
    inputString: string
): Renderable => {
    const elements: Renderable[] = [];
    let normalText = "";
    for (const char of inputString) {
        if ((char.charCodeAt(0) >= 0xe000 && char.charCodeAt(0) <= 0xf8ff) || ([0x9bd6].includes(char.charCodeAt(0)))) {
            elements.push(normalText);
            normalText = "";
            switch (char.charCodeAt(0)) {
                case 0xe000:
                    elements.push(
                        <span className="e000">
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
                default:
                    elements.push(char);
            }
        } else {
            normalText += char;
        }
    }
    elements.push(normalText);
    return mergeElements(elements, "");
};

export const removeSuffix = (inputString: string, suffix: string) => {
    if (inputString.endsWith(suffix)) {
        return inputString.slice(0, -suffix.length);
    }
    return inputString;
}
