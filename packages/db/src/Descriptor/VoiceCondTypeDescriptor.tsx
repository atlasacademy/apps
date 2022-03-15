import React from "react";

import { Profile, Region, Servant } from "@atlasacademy/api-connector";

import EventDescriptor from "./EventDescriptor";
import QuestDescriptor from "./QuestDescriptor";
import { ServantLink } from "./ServantDescriptor";
import { WarDescriptorId } from "./WarDescriptor";

const { VoiceCondType } = Profile;

interface IProps {
    cond: Exclude<Servant.Servant["profile"], undefined>["voices"][0]["voiceLines"][0]["conds"][0];
    costumes?: Exclude<Servant.Servant["profile"], undefined>["costume"];
    region: Region;
    servants: Map<number, Servant.ServantBasic>;
}

let VoiceCondTypeDescriptor = (props: IProps) => {
    let {
        cond: { condType, value, valueList },
        costumes = {},
        region,
    } = props;
    switch (condType) {
        case VoiceCondType.BIRTH_DAY:
            return <>Player birthday</>;
        case VoiceCondType.COUNT_STOP:
            return <>Final ascension</>;
        case VoiceCondType.EVENT:
            return <>An event is available</>;
        case VoiceCondType.EVENT_PERIOD:
            return (
                <>
                    During event <EventDescriptor region={region} eventId={value} />
                </>
            );
        case VoiceCondType.EVENT_END:
            return (
                <>
                    Event <EventDescriptor region={region} eventId={value} /> ended
                </>
            );
        case VoiceCondType.EVENT_NOEND:
            return (
                <>
                    Event <EventDescriptor region={region} eventId={value} /> hasn't ended
                </>
            );
        case VoiceCondType.EVENT_SHOP_PURCHASE:
            return (
                <>
                    Event <EventDescriptor region={region} eventId={value} /> shop purchase line
                </>
            );
        case VoiceCondType.SPACIFIC_SHOP_PURCHASE:
            return (
                <>
                    Event <EventDescriptor region={region} eventId={value} /> specific shop purchase line
                </>
            );
        case VoiceCondType.EVENT_MISSION_ACTION:
            return (
                <>
                    Event <EventDescriptor region={region} eventId={value} /> mission line
                </>
            );
        case VoiceCondType.FRIENDSHIP:
            return <>Bond level {value}</>;
        case VoiceCondType.FRIENDSHIP_ABOVE:
            return <>Bond level {value}</>;
        case VoiceCondType.FRIENDSHIP_BELOW:
            return <>Bond level {value} or less</>;
        case VoiceCondType.MASTER_MISSION:
            return <>Master mission {value}</>;
        case VoiceCondType.LEVEL_UP:
            return <>Level up</>;
        case VoiceCondType.LIMIT_COUNT:
            return <>Ascension {value}</>;
        case VoiceCondType.LIMIT_COUNT_COMMON:
            return <>Ascension 2</>;
        case VoiceCondType.LIMIT_COUNT_ABOVE:
            return <>Ascension {value}</>;
        case VoiceCondType.COSTUME:
            return (
                <>
                    Unlock costume <b>{costumes[value].name}</b>
                </>
            );
        case VoiceCondType.IS_NEW_WAR:
            return (
                <>
                    War <WarDescriptorId region={region} warId={value} /> Opened
                </>
            );
        case VoiceCondType.QUEST_CLEAR:
            return (
                <>
                    Cleared <QuestDescriptor region={region} questId={value} />
                </>
            );
        case VoiceCondType.NOT_QUEST_CLEAR:
            return (
                <>
                    Hasn't cleared <QuestDescriptor region={region} questId={value} />
                </>
            );
        case VoiceCondType.SVT_GET:
            return (
                <>
                    Presence of <ServantLink region={region} id={value} servants={props.servants} />
                </>
            );
        case VoiceCondType.SVT_GROUP:
            return (
                <>
                    {"Presence of any of the following: "}
                    {valueList.map((value, i) => (
                        <span key={value}>
                            <ServantLink region={region} id={value} servants={props.servants} />
                            {i < valueList.length - 1 ? ", " : ""}
                        </span>
                    ))}
                </>
            );
        default:
            return <>{condType}</>;
    }
};

export default VoiceCondTypeDescriptor;
