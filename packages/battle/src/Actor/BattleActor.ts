import {Card, ClassName} from "@atlasacademy/api-connector";
import {Attribute} from "@atlasacademy/api-connector/dist/Schema/Attribute";
import {BuffAction} from "@atlasacademy/api-connector/dist/Schema/Buff";
import {Trait} from "@atlasacademy/api-connector/dist/Schema/Trait";
import {BattleAttackAction} from "../Action/BattleAttackAction";
import {Battle} from "../Battle";
import {BattleBuff} from "../Buff/BattleBuff";
import BattleBuffManager from "../Buff/BattleBuffManager";
import {BattleTeam} from "../Enum/BattleTeam";
import BattleEvent from "../Event/BattleEvent";
import getDamageList from "../Func/Implementations/getDamageList";
import GameConstantManager from "../Game/GameConstantManager";
import BattleNoblePhantasm from "../NoblePhantasm/BattleNoblePhantasm";
import BattleSkill from "../Skill/BattleSkill";

export interface BattleActorHitDistribution {
    buster?: number[],
    arts?: number[];
    quick?: number[];
    extra?: number[];
}

export interface BattleActorProps {
    attribute: Attribute,
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
    battle?: Battle,
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

    addBuff(buff: BattleBuff) {
        this.state.buffs.add(buff);
    }

    attack(target?: BattleActor): number {
        const traits = this.traits(),
            targetTraits = target?.traits() ?? [];

        let attack = this.props.baseAttack;
        attack *= 1 + (this.state.buffs.netBuffs(BuffAction.ATK, traits, targetTraits) / 1000);

        return Math.round(attack);
    }

    attribute(): Attribute {
        return this.props.attribute;
    }

    autoAttack(attack: BattleAttackAction, target: BattleActor): BattleEvent[] {
        return getDamageList(this.battle(), attack, this, target);
    }

    baseAttack(): number {
        return this.props.baseAttack;
    }

    baseClassName(): ClassName {
        return this.props.className;
    }

    baseHits(attack: BattleAttackAction): number[] {
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

    battle(): Battle {
        if (this.state.battle === undefined)
            throw new Error('BATTLE NOT SET');

        return this.state.battle;
    }

    buffsByGroup(group: BuffAction,
                 attack?: BattleAttackAction,
                 target?: BattleActor,
                 actor: boolean = true,
                 plus: boolean = true): BattleBuff[] {
        const traits = this.traits(actor ? attack : undefined),
            targetTraits = target?.traits(actor ? undefined : attack) ?? [];

        return this.state.buffs.getBuffs(group, traits, targetTraits, plus);
    }

    className(attack?: BattleAttackAction, target?: BattleActor, actor: boolean = true): ClassName {
        const traits = this.traits(actor ? attack : undefined),
            targetTraits = target?.traits(actor ? undefined : attack) ?? [],
            classId = this.state.buffs.getValue(BuffAction.OVERWRITE_BATTLECLASS, traits, targetTraits);

        let className;
        if (classId !== undefined)
            className = GameConstantManager.className(classId);

        return className ?? this.baseClassName();
    }

    hasTrait(trait: Trait | number): boolean {
        const traitId: number = typeof trait === "number" ? trait : trait.id;

        return this.props.traits.filter(_trait => _trait.id === traitId).length > 0;
    }

    health(): number {
        const traits = this.traits(),
            targetTraits: Trait[] = [];

        return (
            this.props.baseHealth
            + this.state.buffs.netBuffs(BuffAction.MAXHP_VALUE, traits, targetTraits)
        );
    }

    hits(attack: BattleAttackAction, target?: BattleActor): number[] {
        const hits = this.baseHits(attack);
        const multiHit = this.multihit(attack, target);
        if (multiHit > 1) {
            return hits.map(hit => new Array(multiHit).fill(hit)).flat();
        }
        return hits;
    }

    isAlive(): boolean {
        return this.state.health > 0;
    }

    multihit(attack: BattleAttackAction, target?: BattleActor): number {
        return this.state.buffs.netBuffs( // TODO: use confirmationBuff
            BuffAction.MULTIATTACK,
            this.traits(attack),
            target?.traits() ?? []
        );
    }

    noblePhantasm(): BattleNoblePhantasm {
        return this.state.noblePhantasm;
    }

    setBattle(battle: Battle) {
        this.state.battle = battle;
    }

    skill(num: number): BattleSkill | undefined {
        return this.state.skills.filter(skill => skill.props.id === num).shift();
    }

    traits(attack?: BattleAttackAction): Trait[] {
        const traits: Trait[] = [];

        traits.push(...this.props.traits);
        traits.push(...this.battle().state.traits);
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
