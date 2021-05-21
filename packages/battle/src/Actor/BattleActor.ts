import {Card, ClassName} from "@atlasacademy/api-connector";
import {Trait} from "@atlasacademy/api-connector/dist/Schema/Trait";
import {BattleAttackAction} from "../Action/BattleAttackAction";
import {Battle} from "../Battle";
import BattleBuffManager from "../Buff/BattleBuffManager";
import {BattleTeam} from "../Enum/BattleTeam";
import BattleEvent from "../Event/BattleEvent";
import getDamageList from "../Func/Implementations/getDamageList";
import {GameBuffGroup} from "../Game/GameBuffConstantMap";
import GameConstantManager from "../Game/GameConstantManager";
import {GameConstantKey} from "../Game/GameConstants";
import BattleNoblePhantasm from "../NoblePhantasm/BattleNoblePhantasm";
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
    maxHealth: number;
    noblePhantasm: BattleNoblePhantasm,
    position: number,
    skills: BattleSkill[],
}

export class BattleActor {

    constructor(public props: BattleActorProps,
                public state: BattleActorState) {
        //
    }

    clone(): BattleActor {
        return new BattleActor(this.props, this.cloneState());
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

    baseHits(attack: BattleAttackAction, battle?: Battle, target?: BattleActor): number[] {
        if (attack.np) return this.noblePhantasm().hits();

        let hits = [100];
        switch (attack.card) {
            case Card.BUSTER:
                hits = this.props.hits.buster ?? [100];
                break;
            case Card.QUICK:
                hits = this.props.hits.quick ?? [100];
                break;
            case Card.ARTS:
                hits = this.props.hits.arts ?? [100];
                break;
            case Card.EXTRA:
                hits = this.props.hits.extra ?? [100];
                break;
        }

        return hits;
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

    hits(attack: BattleAttackAction, battle?: Battle, target?: BattleActor): number[] {
        const hits = this.baseHits(attack, battle, target);
        const multiHit = this.multihit(attack, battle, target);
        if (multiHit > 1) {
            return hits.map(hit => new Array(multiHit).fill(hit)).flat();
        }
        return hits;
    }

    isAlive(): boolean {
        return this.state.health > 0;
    }

    multihit(attack: BattleAttackAction, battle?: Battle, target?: BattleActor): number {
        return this.state.buffs.netBuffs( // TODO: use confirmationBuff
            GameBuffGroup.MULTI_ATTACK,
            this.traits(battle, attack),
            target?.traits(battle) ?? []
        );
    }

    noblePhantasm(): BattleNoblePhantasm {
        return this.state.noblePhantasm;
    }

    skill(num: number): BattleSkill | undefined {
        return this.state.skills.filter(skill => skill.props.id === num).shift();
    }

    traits(battle?: Battle, attack?: BattleAttackAction): Trait[] {
        const traits: Trait[] = [];

        traits.push(...this.props.traits);
        if (battle)
            traits.push(...battle.state.traits);
        if (attack)
            traits.push(...attack.traits());
        // TODO: BuffList.ACTION.INDIVIDUALITY_ADD
        // TODO: BuffList.ACTION.INDIVIDUALITY_SUB
        return traits;
    }

    protected cloneState(): BattleActorState {
        return {
            ...this.state,
            buffs: this.state.buffs.clone(),
            noblePhantasm: this.state.noblePhantasm.clone(),
            skills: this.state.skills.map(skill => skill.clone()),
        };
    }

}
