import { Mission } from "./Mission.js";
import { QuestBasic } from "./Quest.js";

export interface MasterMission {
    id: number;
    startedAt: number;
    endedAt: number;
    closedAt: number;
    missions: Mission[];
    quests: QuestBasic[];
}
