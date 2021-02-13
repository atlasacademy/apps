import { CondType, Region, Servant } from "@atlasacademy/api-connector";
import EventDescriptor from "./EventDescriptor";
import QuestDescriptor from "./QuestDescriptor";
import { ServantLink } from "./ServantDescriptor";

export default function CondDescriptor(props: {
    region: Region;
    cond: CondType;
    target: number;
    value: number;
    forceFalseDescription?: string;
    servants: Servant.ServantBasic[];
}) {
    const forceFalseDescription = props.forceFalseDescription
        ? props.forceFalseDescription
        : "Not possible";
    const region = props.region;
    const target = props.target;
    const value = props.value;
    switch (props.cond) {
        case CondType.NONE:
            return null;
        case CondType.QUEST_CLEAR:
            return (
                <>
                    Has cleared{" "}
                    <QuestDescriptor
                        text=""
                        region={region}
                        questId={target}
                        questPhase={1}
                    />
                </>
            );
        case CondType.SVT_LIMIT:
            return (
                <>
                    <ServantLink
                        region={region}
                        id={target}
                        servants={props.servants}
                    />{" "}
                    at ascension {value}
                </>
            );
        case CondType.SVT_GET:
            return (
                <>
                    <ServantLink
                        region={region}
                        id={target}
                        servants={props.servants}
                    />{" "}
                    in Spirit Origin Collection
                </>
            );
        case CondType.EVENT_END:
            return (
                <>
                    Event{" "}
                    <b>
                        <EventDescriptor eventId={target} />
                    </b>{" "}
                    has ended
                </>
            );
        case CondType.QUEST_NOT_CLEAR:
            return (
                <>
                    Has not cleared{" "}
                    <QuestDescriptor
                        text=""
                        region={region}
                        questId={target}
                        questPhase={1}
                    />
                </>
            );
        case CondType.SVT_HAVING:
            return (
                <>
                    Presense of{" "}
                    <ServantLink
                        region={region}
                        id={target}
                        servants={props.servants}
                    />
                </>
            );
        case CondType.QUEST_CLEAR_PHASE:
            return (
                <>
                    Has cleared arrow {value} of{" "}
                    <QuestDescriptor
                        text=""
                        region={region}
                        questId={target}
                        questPhase={value}
                    />
                </>
            );
        case CondType.NOT_QUEST_CLEAR_PHASE:
            return (
                <>
                    Has not cleared arrow {value} of{" "}
                    <QuestDescriptor
                        text=""
                        region={region}
                        questId={target}
                        questPhase={value}
                    />
                </>
            );
        case CondType.SVT_RECOVERD:
            return <>Servant recovered</>;
        case CondType.EVENT_REWARD_DISP_COUNT:
            return (
                <>
                    Event{" "}
                    <b>
                        <EventDescriptor eventId={target} />
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
                    <ServantLink
                        region={region}
                        id={target}
                        servants={props.servants}
                    />{" "}
                    at ascension &ge; {value}
                </>
            );
        case CondType.LIMIT_COUNT_BELOW:
            return (
                <>
                    <ServantLink
                        region={region}
                        id={target}
                        servants={props.servants}
                    />{" "}
                    at ascension &le; {value}
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
