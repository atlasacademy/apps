import React, { useState } from 'react';
import QuestDescriptor from './QuestDescriptor';
import ServantDescriptor from './ServantDescriptor';
import {Profile, Region, Servant} from '@atlasacademy/api-connector';
import Api from '../Api';

const { VoiceCondType } = Profile;
export default (props : { cond: Exclude<Servant.Servant['profile'], undefined>['voices'][0]['voiceLines'][0]['conds'][0], region: Region }) => {
    function ServantLink (props : { id: number }) {
        const [servant, setServant] = useState<Servant.Servant>(null as any);
        Api.servant(props.id).then(s => setServant(s));
        return (
            servant
                ? <ServantDescriptor region={region} servant={servant} />
                : <>servantId {value}</>
        )
    }

    let { cond: { condType, value, valueList }, region } = props;
    switch (condType) {
        case VoiceCondType.BIRTH_DAY: return <>Player birthday</>;
        case VoiceCondType.COUNT_STOP: return <>Final ascension</>
        case VoiceCondType.EVENT: return <>An event is available</>;
        case VoiceCondType.FRIENDSHIP: return <>Bond level {value}</>;
        case VoiceCondType.LEVEL_UP: return <>Level up</>;
        case VoiceCondType.LIMIT_COUNT: return <>Ascension {value}</>;
        case VoiceCondType.LIMIT_COUNT_COMMON: return <>Ascension 2</>;
        case VoiceCondType.QUEST_CLEAR: return <>Cleared <QuestDescriptor region={region} text="" questId={value} questPhase={1}/></>
        case VoiceCondType.SVT_GET: return <>Presence of <ServantLink id={value} /></>;
        case VoiceCondType.SVT_GROUP: return (
            <>
                Presence of any of the following :<br />
                {valueList.map(value => <><ServantLink id={value}/><br /></>)}
            </>
        );
        default: return <>{condType}</>
    }
}