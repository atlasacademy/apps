import { Quest } from "@atlasacademy/api-connector";

export const QuestTypeDescription = new Map([
    [Quest.QuestType.MAIN, "Main"],
    [Quest.QuestType.FREE, "Free"],
    [Quest.QuestType.FRIENDSHIP, "Interlude"],
    [Quest.QuestType.EVENT, "Event"],
    [Quest.QuestType.HERO_BALLAD, "Hero Ballad"],
    [Quest.QuestType.WAR_BOARD, "War Board"],
]);

export const QuestFlagDescription = new Map([[Quest.QuestFlag.NONE, "None"]]);
