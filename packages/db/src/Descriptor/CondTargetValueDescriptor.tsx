import { CondType, Region, Servant } from "@atlasacademy/api-connector";

import CostumeDescriptor from "./CostumeDescriptor";
import EventDescriptor from "./EventDescriptor";
import { ItemDescriptorId } from "./ItemDescriptor";
import QuestDescriptor from "./QuestDescriptor";
import ServantDescriptorId from "./ServantDescriptorId";

export default function CondTargetValueDescriptor(props: {
    region: Region;
    cond: CondType;
    target: number;
    value: number;
    forceFalseDescription?: string;
    servants?: Map<number, Servant.ServantBasic>;
}) {
    const forceFalseDescription = props.forceFalseDescription ? props.forceFalseDescription : "Not possible";
    const region = props.region;
    const target = props.target;
    const value = props.value;
    switch (props.cond) {
        case CondType.NONE:
            return null;
        case CondType.QUEST_CLEAR:
            return (
                <>
                    Has cleared <QuestDescriptor region={region} questId={target} />
                </>
            );
        case CondType.SVT_LIMIT:
            return (
                <>
                    <ServantDescriptorId region={region} id={target} servants={props.servants} /> at ascension {value}
                </>
            );
        case CondType.SVT_GET:
            return (
                <>
                    <ServantDescriptorId region={region} id={target} servants={props.servants} /> in Spirit Origin
                    Collection
                </>
            );
        case CondType.SVT_FRIENDSHIP:
            return (
                <>
                    <ServantDescriptorId region={region} id={target} servants={props.servants} /> at bond level {value}
                </>
            );
        case CondType.SVT_FRIENDSHIP_BELOW:
            return (
                <>
                    <ServantDescriptorId region={region} id={target} servants={props.servants} /> at bond level {value}{" "}
                    or lower
                </>
            );
        case CondType.SVT_FRIENDSHIP_ABOVE:
            return (
                <>
                    <ServantDescriptorId region={region} id={target} servants={props.servants} /> at bond level {value}{" "}
                    or higher
                </>
            );
        case CondType.COSTUME_GET:
            return (
                <>
                    <CostumeDescriptor region={region} servantId={props.target} costumeLimit={props.value} /> get
                </>
            );
        case CondType.EVENT_END:
            return (
                <>
                    Event <EventDescriptor region={region} eventId={target} /> has ended
                </>
            );
        case CondType.QUEST_NOT_CLEAR:
            return (
                <>
                    Has not cleared <QuestDescriptor region={region} questId={target} />
                </>
            );
        case CondType.SVT_HAVING:
            return (
                <>
                    Presense of <ServantDescriptorId region={region} id={target} servants={props.servants} />
                </>
            );
        case CondType.QUEST_CLEAR_PHASE:
            return (
                <>
                    Has cleared arrow {value} of <QuestDescriptor region={region} questId={target} />
                </>
            );
        case CondType.NOT_QUEST_CLEAR_PHASE:
            return (
                <>
                    Has not cleared arrow {value} of{" "}
                    <QuestDescriptor region={region} questId={target} questPhase={value} />
                </>
            );
        case CondType.SVT_RECOVERD:
            return <>Servant recovered</>;
        case CondType.EVENT_REWARD_DISP_COUNT:
            return (
                <>
                    Event{" "}
                    <b>
                        <EventDescriptor region={region} eventId={target} />
                    </b>{" "}
                    reward voice line and at least {value - 1} other reward line
                    {value > 2 ? "s are " : " is "}
                    played before this one
                </>
            );
        case CondType.PLAYER_GENDER_TYPE:
            if (target === 1) {
                return <>Using male protagonist</>;
            } else {
                return <>Using female protagonist</>;
            }
        case CondType.FORCE_FALSE:
            return <>{forceFalseDescription}</>;
        case CondType.LIMIT_COUNT_ABOVE:
            return (
                <>
                    <ServantDescriptorId region={region} id={target} servants={props.servants} /> at ascension &ge;{" "}
                    {value}
                </>
            );
        case CondType.LIMIT_COUNT_BELOW:
            return (
                <>
                    <ServantDescriptorId region={region} id={target} servants={props.servants} /> at ascension &le;{" "}
                    {value}
                </>
            );
        case CondType.DATE:
            if (props.value !== undefined && props.value !== 0) {
                const date = new Date(props.value * 1000);
                return <>After {date.toLocaleString()}</>;
            } else if (props.value === 0) {
                return null;
            } else {
                return <>After unknown date</>;
            }
        case CondType.ITEM_GET:
            return (
                <>
                    Has <ItemDescriptorId region={region} itemId={target} /> x{value}
                </>
            );
        case CondType.NOT_ITEM_GET:
            return (
                <>
                    Doesn't have <ItemDescriptorId region={region} itemId={target} /> x{value}
                </>
            );
        default:
            return (
                <>
                    {props.cond} value {props.value} target {props.target}
                </>
            );
    }
}
