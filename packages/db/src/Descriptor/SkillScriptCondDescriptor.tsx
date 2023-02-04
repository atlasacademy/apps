import { useTranslation } from "react-i18next";

import { Skill } from "@atlasacademy/api-connector";

const SkillScriptCondDescriptor = ({ cond, value }: { cond: Skill.SkillScriptCond; value?: number }) => {
    const { t } = useTranslation();
    switch (cond) {
        case Skill.SkillScriptCond.NONE:
            return <>{t("No Requirement")}</>;
        case Skill.SkillScriptCond.STAR_HIGHER:
            return <>{t("consumeStars", { count: value })}</>;
    }

    return <></>;
};

export default SkillScriptCondDescriptor;
