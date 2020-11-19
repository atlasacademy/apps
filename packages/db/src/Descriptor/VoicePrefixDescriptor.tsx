import React from "react";
import type {Servant} from "@atlasacademy/api-connector";
interface IProps {
    currentVoicePrefix: number;
    ascensionAdd: Servant.Servant['ascensionAdd'];
    costumes?: Exclude<Servant.Servant['profile'], undefined>['costume']
}
export default (props : IProps) => {
    let { ascensionAdd: { voicePrefix }, currentVoicePrefix, costumes = {} } = props;
    let ascConds = Object.entries(voicePrefix.ascension || {})
        .filter(([_, prefix]) => prefix === currentVoicePrefix)
        .map(asc => +asc[0])
    let costumeConds = Object.entries(voicePrefix.costume || {})
        .filter(([_, prefix]) => prefix === currentVoicePrefix)
        .map(costumeId => costumes?.[costumeId[0]].name)
    if ((ascConds.length === 0) && (costumeConds.length === 0)) {
        ascConds = [...Array(5).keys()]
    }
    // write a range instead of listing all levels
    // if contiguous range
    let isValidRange = (Math.max(...ascConds) - Math.min(...ascConds) + 1) === ascConds.length;
    let ascString = isValidRange
        ? (ascConds.length === 1 ? ascConds[0] : `${ascConds.sort()[0]} – ${ascConds.sort().reverse()[0]}`)
        : ascConds.join(' / ');
    return (
        <>
            {ascConds.length ? <>Ascension {ascString}&nbsp;</> : ''}
            {costumeConds.length ? <>{ascConds.length ? 'or c' : 'C'}ostume {costumeConds.join(' / ')}</> : ''}
        </>
    )
}