import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

import { Profile, Region, Servant } from "@atlasacademy/api-connector";

import EventDescriptor from "./EventDescriptor";
import QuestDescriptor from "./QuestDescriptor";
import { ServantDescriptorMap } from "./ServantDescriptor";
import { WarDescriptorId } from "./WarDescriptor";

const { VoiceCondType } = Profile;

interface IProps {
    cond: Exclude<Servant.Servant["profile"], undefined>["voices"][0]["voiceLines"][0]["conds"][0];
    costumes?: Exclude<Servant.Servant["profile"], undefined>["costume"];
    region: Region;
    servants: Map<number, Servant.ServantBasic>;
}

const VoiceCondTypeDescriptor = (props: IProps) => {
    const { t } = useTranslation();
    const {
        cond: { condType, value, valueList },
        costumes = {},
        region,
    } = props;
    const translationKey = `VoiceCondType.${condType}`;
    switch (condType) {
        case VoiceCondType.BIRTH_DAY:
        case VoiceCondType.COUNT_STOP:
        case VoiceCondType.EVENT:
        case VoiceCondType.LEVEL_UP:
        case VoiceCondType.LIMIT_COUNT_COMMON:
        case VoiceCondType.FRIENDSHIP:
        case VoiceCondType.FRIENDSHIP_ABOVE:
        case VoiceCondType.FRIENDSHIP_BELOW:
        case VoiceCondType.MASTER_MISSION:
        case VoiceCondType.LIMIT_COUNT:
        case VoiceCondType.LIMIT_COUNT_ABOVE:
        case VoiceCondType.LEVEL_UP_LIMIT_COUNT:
        case VoiceCondType.LEVEL_UP_LIMIT_COUNT_ABOVE:
        case VoiceCondType.LEVEL_UP_LIMIT_COUNT_BELOW:
            return <>{t(translationKey, { value })}</>;
        case VoiceCondType.EVENT_PERIOD:
        case VoiceCondType.EVENT_END:
        case VoiceCondType.EVENT_NOEND:
        case VoiceCondType.EVENT_SHOP_PURCHASE:
        case VoiceCondType.SPACIFIC_SHOP_PURCHASE:
        case VoiceCondType.EVENT_MISSION_ACTION:
            return (
                <Trans
                    i18nKey={translationKey}
                    components={{ event: <EventDescriptor region={region} eventId={value} /> }}
                />
            );
        case VoiceCondType.COSTUME:
            return (
                <>
                    {t(translationKey)} <b>{costumes[value]?.name ?? `${t("Costume")} ${value}`}</b>
                </>
            );
        case VoiceCondType.IS_NEW_WAR:
            return (
                <Trans
                    i18nKey={translationKey}
                    components={{ war: <WarDescriptorId region={region} warId={value} /> }}
                />
            );
        case VoiceCondType.NOT_QUEST_CLEAR:
        case VoiceCondType.QUEST_CLEAR:
            return (
                <>
                    {t(translationKey)} <QuestDescriptor region={region} questId={value} />
                </>
            );
        case VoiceCondType.SVT_GET:
            return (
                <>
                    {t(translationKey)} <ServantDescriptorMap region={region} id={value} servants={props.servants} />
                </>
            );
        case VoiceCondType.SVT_GROUP:
            return (
                <>
                    {t(translationKey)}:{" "}
                    {valueList.map((value, i) => (
                        <span key={value}>
                            <ServantDescriptorMap region={region} id={value} servants={props.servants} />
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
