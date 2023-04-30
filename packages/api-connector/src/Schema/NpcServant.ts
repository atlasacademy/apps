import { EnemySkill } from "./QuestEnemy";
import { ServantBasic } from "./Servant";
import { SupportServantFlag, SupportServantLimit, SupportServantTd } from "./SupportServant";
import { Trait } from "./Trait";

export interface NpcServant {
    npcId: number;
    name: string;
    svt: ServantBasic;
    lv: number;
    atk: number;
    hp: number;
    traits: Trait[];
    skills: EnemySkill;
    noblePhantasm: SupportServantTd;
    limit: SupportServantLimit;
    flags: SupportServantFlag[];
}
