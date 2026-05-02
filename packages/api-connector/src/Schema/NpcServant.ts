import { EnemySkill } from "./QuestEnemy.js";
import { ServantBasic } from "./Servant.js";
import { SupportServantFlag, SupportServantLimit, SupportServantTd } from "./SupportServant.js";
import { Trait } from "./Trait.js";

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
