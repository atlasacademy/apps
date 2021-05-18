import {CommandCode} from "@atlasacademy/api-connector/dist/Schema/CommandCode";
import {CraftEssence} from "@atlasacademy/api-connector/dist/Schema/CraftEssence";
import {Servant} from "@atlasacademy/api-connector/dist/Schema/Servant";
import {Skill} from "@atlasacademy/api-connector/dist/Schema/Skill";
import BattleBuffManager from "../Buff/BattleBuffManager";
import {BattleTeam} from "../Enum/BattleTeam";
import BattleSkill from "../Skill/BattleSkill";
import {BattleActor, BattleActorProps, BattleActorState} from "./BattleActor";

export interface BattleServantActorProps {
    servant: Servant,
    id: number,
    phase: number,
    team: BattleTeam,

    ascensionOrCostumeId?: number,
    commandCardBonuses?: Array<number>,
    commandCodes?: Array<CommandCode | null>,
    craftEssence?: CraftEssence,
    craftEssenceLevel?: number,
    craftEssenceLimitBreak?: boolean,
    fouAttack?: number,
    fouHealth?: number,
    level?: number,
    noblePhantasmLevel?: number,
    questIds?: number[],
    skillLevels?: number[],
    skill1Level?: number,
    skill2Level?: number,
    skill3Level?: number,
}

function castProps(servantProps: BattleServantActorProps): BattleActorProps {
    const level = servantProps.level ?? servantProps.servant.lvMax,
        form = servantProps.ascensionOrCostumeId ?? 4,
        traits = servantProps.servant.traits;

    traits.push(...servantProps.servant.ascensionAdd.individuality.ascension[form] ?? []);
    traits.push(...servantProps.servant.ascensionAdd.individuality.costume[form] ?? []);


    return {
        baseAttack: servantProps.servant.atkGrowth[level - 1] + (servantProps.fouAttack ?? 1000),
        baseHealth: servantProps.servant.hpGrowth[level - 1] + (servantProps.fouHealth ?? 1000),
        className: servantProps.servant.className,
        hits: servantProps.servant.hitsDistribution,
        id: servantProps.id,
        level,
        name: servantProps.servant.ruby,
        phase: servantProps.phase,
        team: servantProps.team,
        traits: traits,
    };
}

function castSkill(skills: Skill[], actorId: number, position: number, level: number, questIds: number[]): BattleSkill | undefined {
    const skill = skills
        .filter(skill => skill.num === position)
        .filter(skill => !skill.condQuestId || questIds.includes(skill.condQuestId))
        .sort((a, b) => b.id - a.id)
        .shift();

    if (!skill)
        return undefined;

    return new BattleSkill({actorId, id: position, skill, level}, null);
}

function getSkills(servantProps: BattleServantActorProps): BattleSkill[] {
    const questIds = servantProps.questIds ?? servantProps.servant.relateQuestIds,
        skills: BattleSkill[] = [];

    for (let i = 1; i <= 3; i++) {
        const level: number = (servantProps.skillLevels ?? [])[i - 1] ?? 10,
            skill = castSkill(servantProps.servant.skills, servantProps.id, i, level, questIds);

        if (skill)
            skills.push(skill);
    }

    return skills;
}

export default class BattleServantActor extends BattleActor {

    constructor(public servantProps: BattleServantActorProps,
                state: BattleActorState | null) {
        super(castProps(servantProps), state ?? {
            buffs: new BattleBuffManager([]),
            gauge: 0,
            health: 0,
            position: 0,
            skills: getSkills(servantProps),
        });

        this.state.health = this.health();
    }

    clone(): BattleServantActor {
        return new BattleServantActor(this.servantProps, this.cloneState());
    }
}
