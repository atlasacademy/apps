import React from "react";
import type {Servant} from "@atlasacademy/api-connector";
export default (props : { currentVoicePrefix: number, ascensionAdd: Servant.Servant['ascensionAdd'] }) => {
    let { ascensionAdd: { voicePrefix }, currentVoicePrefix } = props;
    let ascensionConds = Object.entries(voicePrefix.ascension || {})
        .filter(([_, prefix]) => prefix === currentVoicePrefix)
        .map(asc => +asc[0])
    let costumeConds = Object.entries(voicePrefix.costume || {})
        .filter(([_, prefix]) => prefix === currentVoicePrefix)
        .map(costumeId => +costumeId[0]);
    return (
        <>
            {ascensionConds.length ? <>Ascension {ascensionConds.join(' / ')}&nbsp;</> : ''}
            {costumeConds.length ? <>{ascensionConds.length ? 'or c' : 'C'}ostume ID {costumeConds.join(' / ')}</> : ''}
        </>
    )
}