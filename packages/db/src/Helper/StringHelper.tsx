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
    if (text === ruby || ruby === "-") {
        return text;
    } else if (splitRank) {
        let [name, rank] = text.split(" ");
        return (
            <ruby>
                {name}<rp>(</rp><rt>{ruby}</rt><rp>)</rp>&nbsp;{rank}
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