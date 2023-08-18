import { useTranslation } from "react-i18next";

import { Quest } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import { t } from "../i18n";

export const QuestTypeDescriptionMap = new Map([
    [Quest.QuestType.MAIN, t("Main")],
    [Quest.QuestType.FREE, t("Free")],
    [Quest.QuestType.FRIENDSHIP, t("Interlude")],
    [Quest.QuestType.EVENT, t("Event")],
    [Quest.QuestType.HERO_BALLAD, t("Hero Ballad")],
    [Quest.QuestType.WAR_BOARD, t("War Board")],
]);

export const QuestTypeDescription = ({ questType }: { questType: Quest.QuestType }) => {
    const { t } = useTranslation();

    switch (questType) {
        case Quest.QuestType.MAIN:
            return <>{t("Main")}</>;
        case Quest.QuestType.FREE:
            return <>{t("Free")}</>;
        case Quest.QuestType.FRIENDSHIP:
            return <>{t("Interlude")}</>;
        case Quest.QuestType.EVENT:
            return <>{t("Event")}</>;
        case Quest.QuestType.HERO_BALLAD:
            return <>{t("Hero Ballad")}</>;
        case Quest.QuestType.WAR_BOARD:
            return <>{t("War Board")}</>;
        default:
            return <>{toTitleCase(questType)}</>;
    }
};

export const QuestFlagDescription = new Map([[Quest.QuestFlag.NONE, "None"]]);
