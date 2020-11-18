import React from "react";
import type {Servant} from "@atlasacademy/api-connector";
export default (props : { currentVoicePrefix: number, ascensionAdd: Servant.Servant['ascensionAdd'] }) => {
    let { ascensionAdd: { voicePrefix }, currentVoicePrefix } = props;
    let ascConds = Object.entries(voicePrefix.ascension || {})
        .filter(([_, prefix]) => prefix === currentVoicePrefix)
        .map(asc => +asc[0])
    let costumeConds = Object.entries(voicePrefix.costume || {})
        .filter(([_, prefix]) => prefix === currentVoicePrefix)
        .map(costumeId => +costumeId[0]);
    // write a range instead of listing all levels
    // if contiguous range
    let isValidRange = (Math.max(...ascConds) - Math.min(...ascConds) + 1) === ascConds.length;
    let ascString = isValidRange ? `${ascConds.sort()[0]} – ${ascConds.sort().pop()}` : ascConds.join(' / ')
    return (
        <>
            {ascConds.length ? <>Ascension {ascString}&nbsp;</> : ''}
            {costumeConds.length ? <>{ascConds.length ? 'or c' : 'C'}ostume ID {costumeConds.join(' / ')}</> : ''}
        </>
    )
}