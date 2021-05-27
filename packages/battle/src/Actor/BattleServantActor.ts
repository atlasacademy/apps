import {CommandCode, Constant, CraftEssence, Servant, Skill} from "@atlasacademy/api-connector";
import BattleBuffManager from "../Buff/BattleBuffManager";
import {BattleTeam} from "../Enum/BattleTeam";
import GameConstantManager from "../Game/GameConstantManager";
import BattleNoblePhantasm from "../NoblePhantasm/BattleNoblePhantasm";
import BattleSkill from "../Skill/BattleSkill";
import BattleSkillPassive from "../Skill/BattleSkillPassive";
import {BattleActor, BattleActorProps, BattleActorState} from "./BattleActor";

export interface BattleServantActorProps {
    servant: Servant.Servant,
    id: number,
    phase: number,
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
    skill1Level?: number,
    skill2Level?: number,
    skill3Level?: number,
}

function castProps(servantProps: BattleServantActorProps): BattleActorProps {
    const level = servantProps.level ?? servantProps.servant.lvMax,
        form = servantProps.ascensionOrCostumeId ?? 4,
        traits = servantProps.servant.traits,
        np = getNoblePhantasm(servantProps);

    let gaugeLineCount = 0;
    if (np.level() >= 5)
        gaugeLineCount = 3;
    else if (np.level() > 1)
        gaugeLineCount = 2;
    else if (np.level() === 1)
        gaugeLineCount = 1;

    traits.push(...servantProps.servant.ascensionAdd.individuality.ascension[form] ?? []);
    traits.push(...servantProps.servant.ascensionAdd.individuality.costume[form] ?? []);

    return {
        attribute: servantProps.servant.attribute,
        baseAttack: servantProps.servant.atkGrowth[level - 1] + (servantProps.fouAttack ?? 1000),
        baseHealth: servantProps.servant.hpGrowth[level - 1] + (servantProps.fouHealth ?? 1000),
        baseStarGen: servantProps.servant.starGen,
        className: servantProps.servant.className,
        gaugeLineCount,
        gaugeLineMax: GameConstantManager.getValue(Constant.Constant.FULL_TD_POINT),
        hits: servantProps.servant.hitsDistribution,
        id: servantProps.id,
        level,
        name: servantProps.servant.ruby,
        passives: [servantProps.servant.classPassive, servantProps.servant.extraPassive].flat().map(skill => {
            return new BattleSkillPassive({
                actorId: servantProps.id,
                id: 0,
                skill: skill,
                level: 1,
            }, null);
        }),
        phase: servantProps.phase,
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

function getNoblePhantasm(servantProps: BattleServantActorProps): BattleNoblePhantasm {
    const questIds = servantProps.questIds ?? servantProps.servant.relateQuestIds,
        noblePhantasm = servantProps.servant.noblePhantasms
            .filter(noblePhantasm => !noblePhantasm.condQuestId || questIds.includes(noblePhantasm.condQuestId))
            .sort((a, b) => b.id - a.id)
            .shift();

    if (!noblePhantasm)
        throw new Error('FAILED TO FIND NOBLE PHANTASM');

    return new BattleNoblePhantasm({
        actorId: servantProps.id,
        level: servantProps.noblePhantasmLevel ?? 1,
        np: noblePhantasm,
    }, null);
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
            damageDone: 0,
            gauge: 0,
            health: 0,
            maxHealth: 0,
            noblePhantasm: getNoblePhantasm(servantProps),
            position: 0,
            skills: getSkills(servantProps),
        });

        this.state.health = this.props.baseHealth;
        this.state.maxHealth = this.props.baseHealth;
    }

    clone(): BattleServantActor {
        return new BattleServantActor(this.servantProps, this.cloneState());
    }
}
