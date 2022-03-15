import React from "react";

import type { Servant } from "@atlasacademy/api-connector";

interface IProps {
    currentVoicePrefix: number;
    ascensionAdd: Servant.Servant["ascensionAdd"];
    costumes?: Exclude<Servant.Servant["profile"], undefined>["costume"];
}
let VoicePrefixDescriptor = (props: IProps) => {
    let {
        ascensionAdd: { voicePrefix },
        currentVoicePrefix,
        costumes = {},
    } = props;
    // Waver ascensionAdd has missing values for ascension 0-2
    // so set the default voicePrefix to 0 for all ascensions and overwrite with actual data
    let ascensionVoicePrefix = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
    Object.assign(ascensionVoicePrefix, voicePrefix.ascension);
    let ascConds = Object.entries(ascensionVoicePrefix)
        .filter(([_, prefix]) => prefix === currentVoicePrefix)
        .map((asc) => +asc[0]);
    let costumeConds = Object.entries(voicePrefix.costume || {})
        .filter(([_, prefix]) => prefix === currentVoicePrefix)
        .map((costumeId) => costumes?.[costumeId[0]].name);
    if (ascConds.length === 0 && costumeConds.length === 0) {
        ascConds = [...Array(5).keys()];
    }
    // write a range instead of listing all levels
    // if contiguous range
    let isValidRange = Math.max(...ascConds) - Math.min(...ascConds) + 1 === ascConds.length;
    let ascString = isValidRange
        ? ascConds.length === 1
            ? ascConds[0]
            : `${ascConds.sort()[0]} – ${ascConds.sort().reverse()[0]}`
        : ascConds.join(" / ");
    return (
        <>
            {ascConds.length ? <>Ascension {ascString}&nbsp;</> : ""}
            {costumeConds.length ? (
                <>
                    {ascConds.length ? "or c" : "C"}ostume {costumeConds.join(" / ")}
                </>
            ) : (
                ""
            )}
        </>
    );
};

export default VoicePrefixDescriptor;
