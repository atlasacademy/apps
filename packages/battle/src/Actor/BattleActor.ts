import {ClassName} from "@atlasacademy/api-connector";
import {Trait} from "@atlasacademy/api-connector/dist/Schema/Trait";
import {BattleAttackAction} from "../Action/BattleAttackAction";
import {Battle} from "../Battle";
import BattleBuffManager from "../Buff/BattleBuffManager";
import {BattleTeam} from "../Enum/BattleTeam";
import BattleEvent from "../Event/BattleEvent";
import getDamageList from "../Func/Implementations/getDamageList";
import {GameBuffGroup} from "../Game/GameBuffConstantMap";
import BattleSkill from "../Skill/BattleSkill";

export interface BattleActorHitDistribution {
    buster?: number[],
    arts?: number[];
    quick?: number[];
    extra?: number[];
}

export interface BattleActorProps {
    baseAttack: number,
    baseHealth: number,
    className: ClassName,
    hits: BattleActorHitDistribution,
    id: number,
    level: number,
    name: string,
    phase: number,
    team: BattleTeam,
    traits: Trait[],
}

export interface BattleActorState {
    buffs: BattleBuffManager,
    gauge: number,
    health: number,
    position: number,
    skills: BattleSkill[],
}

export class BattleActor {

    constructor(public props: BattleActorProps,
                public state: BattleActorState) {
        //
    }

    attack(battle: Battle, target?: BattleActor): number {
        const traits = this.traits(battle),
            targetTraits = target?.traits(battle) ?? [];

        let attack = this.props.baseAttack;
        attack *= 1 + (this.state.buffs.netBuffs(GameBuffGroup.ATK, traits, targetTraits) / 1000);

        return Math.round(attack);
    }

    autoAttack(attack: BattleAttackAction, battle: Battle, target: BattleActor): BattleEvent[] {
        return getDamageList(battle, attack, this, target);
    }

    clone(): BattleActor {
        return new BattleActor(this.props, this.cloneState());
    }

    hasTrait(trait: Trait | number): boolean {
        const traitId: number = typeof trait === "number" ? trait : trait.id;

        return this.props.traits.filter(_trait => _trait.id === traitId).length > 0;
    }

    health(battle: Battle): number {
        const traits = this.traits(battle),
            targetTraits: Trait[] = [];

        return (
            this.props.baseHealth
            + this.state.buffs.netBuffs(GameBuffGroup.MAX_HP_VALUE, traits, targetTraits)
        );
    }

    isAlive(): boolean {
        return this.state.health > 0;
    }

    skill(num: number): BattleSkill | undefined {
        return this.state.skills.filter(skill => skill.props.id === num).shift();
    }

    traits(battle: Battle, attack?: BattleAttackAction): Trait[] {
        const traits: Trait[] = [];

        traits.push(...this.props.traits);
        traits.push(...battle.state.traits);
        if (attack)
            traits.push(...attack.traits());

        return traits;
    }

    protected cloneState(): BattleActorState {
        return {
            ...this.state,
            buffs: this.state.buffs.clone(),
            skills: this.state.skills.map(skill => skill.clone()),
        };
    }

}
