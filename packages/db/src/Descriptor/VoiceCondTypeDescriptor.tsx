import React from 'react';
import QuestDescriptor from './QuestDescriptor';
import EventDescriptor from './EventDescriptor';
import {BasicServantDescriptor} from './ServantDescriptor';
import {Profile, Region, Servant} from '@atlasacademy/api-connector';

const { VoiceCondType } = Profile;

interface IProps {
    cond: Exclude<Servant.Servant['profile'], undefined>['voices'][0]['voiceLines'][0]['conds'][0],
    costumes?: Exclude<Servant.Servant['profile'], undefined>['costume'],
    region: Region,
    servants: Servant.ServantBasic[];
}

let VoiceCondTypeDescriptor = (props : IProps) => {
    function ServantLink (props : { id: number; servants: Servant.ServantBasic[] }) {
        let servant = props.servants.filter(servant => servant.id === props.id)[0];
        return <BasicServantDescriptor region={region} servant={servant} />
    }

    let { cond: { condType, value, valueList }, costumes = {}, region } = props;
    switch (condType) {
        case VoiceCondType.BIRTH_DAY: return <>Player birthday</>;
        case VoiceCondType.COUNT_STOP: return <>Final ascension</>
        case VoiceCondType.EVENT: return <>An event is available</>;
        case VoiceCondType.EVENT_PERIOD: return <>During event <b><EventDescriptor eventId={value}/></b></>;
        case VoiceCondType.EVENT_END: return <>Event <b><EventDescriptor eventId={value}/></b> ended</>;
        case VoiceCondType.EVENT_NOEND: return <>Event <b><EventDescriptor eventId={value}/></b> hasn't ended</>;
        case VoiceCondType.EVENT_SHOP_PURCHASE: return <>Event <b><EventDescriptor eventId={value}/></b> shop purchase line</>;
        case VoiceCondType.SPACIFIC_SHOP_PURCHASE: return <>Event <b><EventDescriptor eventId={value}/></b> specific shop purchase line</>;
        case VoiceCondType.EVENT_MISSION_ACTION: return <>Event <b><EventDescriptor eventId={value}/></b> mission line</>;
        case VoiceCondType.FRIENDSHIP: return <>Bond level {value}</>;
        case VoiceCondType.FRIENDSHIP_ABOVE: return <>Bond level {value}</>;
        case VoiceCondType.FRIENDSHIP_BELOW: return <>Bond level {value} or less</>;
        case VoiceCondType.MASTER_MISSION: return <>Master mission {value}</>
        case VoiceCondType.LEVEL_UP: return <>Level up</>;
        case VoiceCondType.LIMIT_COUNT: return <>Ascension {value}</>;
        case VoiceCondType.LIMIT_COUNT_COMMON: return <>Ascension 2</>;
        case VoiceCondType.LIMIT_COUNT_ABOVE: return <>Ascension {value}</>;
        case VoiceCondType.COSTUME: return <>Unlock costume <b>{costumes[value].name}</b></>;
        case VoiceCondType.IS_NEW_WAR: return <>New war {value}</>;
        case VoiceCondType.QUEST_CLEAR: return <>Cleared <QuestDescriptor region={region} text="" questId={value} questPhase={1}/></>;
        case VoiceCondType.NOT_QUEST_CLEAR: return <>Hasn't cleared <QuestDescriptor region={region} text="" questId={value} questPhase={1}/></>;
        case VoiceCondType.SVT_GET: return <>Presence of <ServantLink id={value} servants={props.servants}/></>;
        case VoiceCondType.SVT_GROUP: return (
            <>
                {'Presence of any of the following: '}
                {valueList.map((value, i) =>
                    <><ServantLink id={value} servants={props.servants}/>{ i < valueList.length - 1 ? ', ' : '' }</>
                )}
            </>
        );
        default: return <>{condType}</>
    }
}

export default VoiceCondTypeDescriptor;
