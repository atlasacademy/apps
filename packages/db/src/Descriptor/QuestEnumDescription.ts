import { Quest } from "@atlasacademy/api-connector";

import { t } from "../i18n";

export const QuestTypeDescription = new Map([
    [Quest.QuestType.MAIN, t("Main")],
    [Quest.QuestType.FREE, t("Free")],
    [Quest.QuestType.FRIENDSHIP, t("Interlude")],
    [Quest.QuestType.EVENT, t("Event")],
    [Quest.QuestType.HERO_BALLAD, t("Hero Ballad")],
    [Quest.QuestType.WAR_BOARD, t("War Board")],
]);

export const QuestFlagDescription = new Map([[Quest.QuestFlag.NONE, "None"]]);
