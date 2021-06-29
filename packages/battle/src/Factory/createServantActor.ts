import {CommandCode, CraftEssence, Servant, Skill} from "@atlasacademy/api-connector";
import {BattleActor, BattleActorProps} from "../Actor/BattleActor";
import BattleBuffManager from "../Buff/BattleBuffManager";
import {BattleTeam} from "../Enum/BattleTeam";
import BattleNoblePhantasm from "../NoblePhantasm/BattleNoblePhantasm";
import BattleSkill from "../Skill/BattleSkill";
import BattleSkillPassive from "../Skill/BattleSkillPassive";

export interface BattleServantActorProps {
    servant: Servant.Servant,
    team: BattleTeam,

    ascensionOrCostumeId?: number,
    commandCardBonuses?: Array<number>,
    commandCodes?: Array<CommandCode.CommandCode | null>,
    craftEssence?: CraftEssence.CraftEssence,
    craftEssenceLevel?: number,
    craftEssenceLimitBreak?: boolean,
    fouAttack?: number,
    fouHealth?: number,
    level?: number,
    noblePhantasmLevel?: number,
    questIds?: number[],
    skillLevels?: number[],
}

function castProps(id: number, phase: number, servantProps: BattleServantActorProps): BattleActorProps {
    const level = servantProps.level ?? servantProps.servant.lvMax,
        form = servantProps.ascensionOrCostumeId ?? 4,
        traits = servantProps.servant.traits,
        np = getNoblePhantasm(id, servantProps);

    let gaugeLineCount = 0;
    if (np.level() >= 5)
        gaugeLineCount = 3;
    else if (np.level() > 1)
        gaugeLineCount = 2;
    else if (np.level() === 1)
        gaugeLineCount = 1;

    let face = (servantProps.servant.extraAssets.faces.ascension ?? {})[form];
    if (!face)
        face = (servantProps.servant.extraAssets.faces.costume ?? {})[form]

    traits.push(...servantProps.servant.ascensionAdd.individuality.ascension[form] ?? []);
    traits.push(...servantProps.servant.ascensionAdd.individuality.costume[form] ?? []);

    return {
        attribute: servantProps.servant.attribute,
        baseAttack: servantProps.servant.atkGrowth[level - 1] + (servantProps.fouAttack ?? 1000),
        baseHealth: servantProps.servant.hpGrowth[level - 1] + (servantProps.fouHealth ?? 1000),
        baseStarGen: servantProps.servant.starGen,
        className: servantProps.servant.className,
        face,
        gaugeLineCount,
        gaugeLineMax: 10000,
        hits: servantProps.servant.hitsDistribution,
        id,
        level,
        name: servantProps.servant.ruby,
        passives: [servantProps.servant.classPassive, servantProps.servant.extraPassive].flat().map(skill => {
            return new BattleSkillPassive({
                actorId: id,
                id: 0,
                skill: skill,
                level: 1,
            }, null);
        }),
        phase: phase,
        serverMod: {
            tdAttackRate: 1000,
            tdRate: 1000,
            starRate: 0,
        },
        team: servantProps.team,
        traits: traits,
    };
}

function castSkill(skills: Skill.Skill[], actorId: number, position: number, level: number, questIds: number[]): BattleSkill | undefined {
    const skill = skills
        .filter(skill => skill.num === position)
        .filter(skill => !skill.condQuestId || questIds.includes(skill.condQuestId))
        .sort((a, b) => b.id - a.id)
        .shift();

    if (!skill)
        return undefined;

    return new BattleSkill({actorId, id: position, skill, level}, null);
}

function getNoblePhantasm(id: number, servantProps: BattleServantActorProps): BattleNoblePhantasm {
    const questIds = servantProps.questIds ?? servantProps.servant.relateQuestIds,
        noblePhantasm = servantProps.servant.noblePhantasms
            .filter(noblePhantasm => !noblePhantasm.condQuestId || questIds.includes(noblePhantasm.condQuestId))
            .sort((a, b) => b.id - a.id)
            .shift();

    if (!noblePhantasm)
        throw new Error('FAILED TO FIND NOBLE PHANTASM');

    return new BattleNoblePhantasm({
        actorId: id,
        level: servantProps.noblePhantasmLevel ?? 1,
        np: noblePhantasm,
    }, null);
}

function getSkills(id: number, servantProps: BattleServantActorProps): BattleSkill[] {
    const questIds = servantProps.questIds ?? servantProps.servant.relateQuestIds,
        skills: BattleSkill[] = [];

    for (let i = 1; i <= 3; i++) {
        const level: number = (servantProps.skillLevels ?? [])[i - 1] ?? 10,
            skill = castSkill(servantProps.servant.skills, id, i, level, questIds);

        if (skill)
            skills.push(skill);
    }

    return skills;
}

export default function createServantActor(id: number, phase: number, props: BattleServantActorProps): BattleActor {
    const actor = new BattleActor(castProps(id, phase, props), {
        buffs: new BattleBuffManager([]),
        damageDone: 0,
        gauge: 0,
        health: 0,
        maxHealth: 0,
        noblePhantasm: getNoblePhantasm(id, props),
        position: 0,
        skills: getSkills(id, props),
    });

    actor.state.health = actor.props.baseHealth;
    actor.state.maxHealth = actor.props.baseHealth;

    return actor;
};
