import { useTranslation } from "react-i18next";

import { Profile } from "@atlasacademy/api-connector";

export const ProfileVoiceTypeDescriptor = ({ voiceType }: { voiceType: Profile.ProfileVoiceType }) => {
    const { t } = useTranslation();
    return <>{t("ProfileVoiceType." + voiceType)}</>;
};
