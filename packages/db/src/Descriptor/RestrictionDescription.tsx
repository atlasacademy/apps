import { Region, Restriction } from "@atlasacademy/api-connector";

import { listNumber } from "../Helper/ArrayHelper";
import { mergeElements } from "../Helper/OutputHelper";
import { OrdinalNumeral } from "../Helper/StringHelper";
import EventAllOutDescription from "./EventAllOutDescription";
import { MergeElementsOr, MultipleTraits } from "./MultipleDescriptors";
import ServantDescriptorId from "./ServantDescriptorId";
import TraitDescription from "./TraitDescription";

const RestrictionDescription = ({ region, restriction }: { region: Region; restriction: Restriction.Restriction }) => {
    const { targetVals, targetVals2 } = restriction,
        pluralS = targetVals.length > 1 ? "s" : "";

    const traits = (
        <>
            <MultipleTraits region={region} traitIds={targetVals} lastJoinWord="or" /> trait{pluralS}
        </>
    );

    switch (restriction.type) {
        case Restriction.RestrictionType.INDIVIDUALITY:
            switch (restriction.rangeType) {
                case Restriction.RestrictionRange.EQUAL:
                    return <>Only servants with {traits} can be deployed</>;
                case Restriction.RestrictionRange.NOT_EQUAL:
                    return <>Servants with {traits} cannot be deployed</>;
            }
            break;
        case Restriction.RestrictionType.RARITY:
        case Restriction.RestrictionType.TOTAL_COST:
        case Restriction.RestrictionType.LV:
            break;
        case Restriction.RestrictionType.SUPPORT_ONLY:
            return <>Support Only</>;
        case Restriction.RestrictionType.UNIQUE_SVT_ONLY:
            return <>No Duplicate Servants</>;
        case Restriction.RestrictionType.FIXED_SUPPORT_POSITION:
            return (
                <>
                    Support Servant must be at the{" "}
                    <MergeElementsOr
                        elements={targetVals.map((val) => (
                            <OrdinalNumeral index={val} />
                        ))}
                        lastJoinWord="or"
                    />{" "}
                    position
                </>
            );
        case Restriction.RestrictionType.FIXED_MY_SVT_INDIVIDUALITY_POSITION_MAIN:
            return (
                <>
                    At least one of player's own servants with {traits} must be{" "}
                    {targetVals2.length === 0 ? (
                        <>a starting member</>
                    ) : (
                        <>
                            at the{" "}
                            <MergeElementsOr
                                elements={targetVals2.map((val) => (
                                    <OrdinalNumeral index={val} />
                                ))}
                                lastJoinWord="or"
                            />{" "}
                            position
                        </>
                    )}
                </>
            );
        case Restriction.RestrictionType.FIXED_MY_SVT_INDIVIDUALITY_SINGLE:
            return <>Player's own servant with {traits} must solo this quest</>;
        case Restriction.RestrictionType.SVT_NUM:
            let svtNum = "",
                svtNumPlural = "s";
            switch (restriction.rangeType) {
                case Restriction.RestrictionRange.EQUAL:
                    svtNum = `Only ${targetVals[0]}`;
                    svtNumPlural = targetVals[0] > 1 ? "s" : "";
                    break;
                case Restriction.RestrictionRange.BELOW:
                    svtNum = `No more than ${targetVals[0]}`;
                    svtNumPlural = targetVals[0] > 1 ? "s" : "";
                    break;
                case Restriction.RestrictionRange.BETWEEN:
                    svtNum = `${targetVals[0]}–${targetVals[1]}`;
                    break;
            }
            return (
                <>
                    {svtNum} servant{svtNumPlural} can be deployed
                </>
            );
        case Restriction.RestrictionType.MY_SVT_NUM:
            let mySvtNum = "",
                mySvtNumPlural = "s";
            switch (restriction.rangeType) {
                case Restriction.RestrictionRange.EQUAL:
                    mySvtNum = `${targetVals[0]}`;
                    mySvtNumPlural = targetVals[0] > 1 ? "s" : "";
                    break;
                case Restriction.RestrictionRange.BELOW:
                    mySvtNum = `No more than ${targetVals[0]}`;
                    mySvtNumPlural = targetVals[0] > 1 ? "s" : "";
                    break;
            }
            return (
                <>
                    {mySvtNum} servant{mySvtNumPlural} can be from your party
                </>
            );
        case Restriction.RestrictionType.MY_SVT_OR_NPC:
            return (
                <>
                    Player's own or NPC Support <ServantDescriptorId region={region} id={targetVals[0]} /> must be used
                    at position {targetVals2[0]}
                </>
            );
        case Restriction.RestrictionType.MY_SVT_OR_SUPPORT:
            return (
                <>
                    One of player's own or Support with trait(s){" "}
                    {mergeElements(
                        targetVals.map((svtId) => <TraitDescription region={region} trait={svtId} />),
                        ", "
                    )}{" "}
                    must be used at position {targetVals2[0]}
                </>
            );
        case Restriction.RestrictionType.ALLOUT_BATTLE_UNIQUE_SVT:
            return (
                <>
                    Servants must not have been used in{" "}
                    <EventAllOutDescription region={region} eventId={targetVals[0]} alloutBattleId={targetVals[1]} />
                </>
            );
        case Restriction.RestrictionType.FIXED_SVT_INDIVIDUALITY_POSITION_MAIN:
            return <>At least 1 servant with {traits} must be a starting member</>;
        case Restriction.RestrictionType.UNIQUE_INDIVIDUALITY:
            return <>Two servants with the same {traits} cannot be in the lineup</>;
    }

    return (
        <>
            Type: {restriction.type}; Range: {restriction.rangeType}; Vals: {listNumber(restriction.targetVals)}; Vals2:{" "}
            {listNumber(restriction.targetVals2)}
        </>
    );
};

export default RestrictionDescription;
