import {Region} from "@atlasacademy/api-connector";
import React from "react";
import {Renderable} from "./OutputHelper";

export default function getRubyText(region: Region, text: string, ruby: string, splitRank = false): Renderable {
    if (region !== Region.JP) {
        return text;
    } else {
        return makeRubyText(text, ruby, splitRank);
    }
}

function makeRubyText(text: string, ruby: string, splitRank = false): Renderable {
    let textSplitted = text.split(" ");
    let rank = textSplitted[textSplitted.length - 1];
    let skillName = textSplitted.slice(0, -1).join(" ");
    if (text === ruby || ruby === "-") {
        return text;
    } else if (splitRank && rank && ["A", "B", "C", "D", "E"].includes(rank[0].toUpperCase())) {
        return (
            <ruby>
                {skillName}<rp>(</rp><rt>{ruby}</rt><rp>)</rp>&nbsp;{rank}
            </ruby>
        )
    } else {
        return (
            <ruby>
                {text}<rp>(</rp><rt>{ruby}</rt><rp>)</rp>
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