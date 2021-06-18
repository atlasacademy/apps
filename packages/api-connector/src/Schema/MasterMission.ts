import { Mission } from "./Mission";
import { QuestBasic } from "./Quest";

export interface MasterMission {
    id: number;
    startedAt: number;
    endedAt: number;
    closedAt: number;
    missions: Mission[];
    quests: QuestBasic[];
}
