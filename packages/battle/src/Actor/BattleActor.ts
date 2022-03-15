import { Attribute, Buff, Card, ClassName, QuestEnemy, Trait } from "@atlasacademy/api-connector";

import { BattleAttackAction } from "../Action/BattleAttackAction";
import { Battle } from "../Battle";
import { BattleBuff } from "../Buff/BattleBuff";
import BattleBuffManager from "../Buff/BattleBuffManager";
import { BattleTeam } from "../Enum/BattleTeam";
import BattleEvent from "../Event/BattleEvent";
import getDamageList from "../Func/Implementations/getDamageList";
import GameConstantManager from "../Game/GameConstantManager";
import { Variable } from "../Game/Variable";
import BattleNoblePhantasm from "../NoblePhantasm/BattleNoblePhantasm";
import BattleSkill from "../Skill/BattleSkill";
import BattleSkillPassive from "../Skill/BattleSkillPassive";

export enum BattleActorLogic {
    NORMAL,
    NEUTRAL,
    PERFECT,
}

export interface BattleActorHitDistribution {
    buster?: number[];
    arts?: number[];
    quick?: number[];
    extra?: number[];
}

export interface BattleActorProps {
    attribute: Attribute.Attribute;
    baseAttack: number;
    baseHealth: number;
    baseStarGen: number;
    className: ClassName;
    face?: string;
    gaugeLineCount: number;
    gaugeLineMax: number;
    hits: BattleActorHitDistribution;
    id: number;
    level: number;
    logic: BattleActorLogic;
    name: string;
    passives: BattleSkillPassive[];
    phase: number;
    serverMod: QuestEnemy.EnemyServerMod;
    team: BattleTeam;
    traits: Trait.Trait[];
}

export interface BattleActorState {
    battle?: Battle;
    buffs: BattleBuffManager;
    damageDone: number;
    gauge: number;
    health: number;
    maxHealth: number;
    noblePhantasm: BattleNoblePhantasm;
    position: number;
    skills: BattleSkill[];
}

export class BattleActor {
    constructor(public props: BattleActorProps, public state: BattleActorState) {
        this.buffs().logic = this.props.logic;
    }

    clone(): BattleActor {
        return new BattleActor(this.props, this.cloneState());
    }

    addBuff(buff: BattleBuff) {
        this.state.buffs.add(buff);
    }

    adjustGauge(value: number) {
        value = Math.floor(value);

        this.state.gauge += value;

        // 99% round up. ref: BattleServantData.addNp
        if (this.team() === BattleTeam.PLAYER) {
            const ninetyNine = Variable.double(this.props.gaugeLineMax).multiply(Variable.double(0.99)).value(),
                gaugeDouble = Variable.double(this.state.gauge).value();
            if (value > 0 && ninetyNine <= gaugeDouble && this.state.gauge < this.props.gaugeLineMax) {
                this.state.gauge = this.props.gaugeLineMax;
            }
        }

        const maxGauge = this.props.gaugeLineMax * this.props.gaugeLineCount;
        if (this.state.gauge > maxGauge) this.state.gauge = maxGauge;

        if (this.state.gauge < 0) this.state.gauge = 0;
    }

    adjustHealth(value: number) {
        // TODO
        this.state.health += value;
        if (this.state.health < 0) this.state.health = 0;
    }

    attack(target?: BattleActor): number {
        const traits = this.traits(),
            targetTraits = target?.traits() ?? [];

        let attack = this.props.baseAttack;
        attack *= Math.fround(this.state.buffs.netBuffs(Buff.BuffAction.ATK, traits, targetTraits) / 1000);

        return Math.round(attack);
    }

    attribute(): Attribute.Attribute {
        return this.props.attribute;
    }

    async autoAttack(attack: BattleAttackAction): Promise<BattleEvent[]> {
        const target = this.battle().actors().getActiveTarget(this);
        if (!target) {
            throw new Error("No valid attack target");
        }

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

    baseStarGen(): number {
        return this.props.baseStarGen;
    }

    battle(): Battle {
        if (this.state.battle === undefined) throw new Error("BATTLE NOT SET");

        return this.state.battle;
    }

    buffs(): BattleBuffManager {
        return this.state.buffs;
    }

    className(attack?: BattleAttackAction, target?: BattleActor, actor: boolean = true): ClassName {
        const traits = this.traits(actor ? attack?.traits() : undefined),
            targetTraits = target?.traits(actor ? undefined : attack?.traits()) ?? [],
            classId = this.state.buffs.getValue(Buff.BuffAction.OVERWRITE_BATTLECLASS, traits, targetTraits);

        let className;
        if (classId !== undefined) className = this.battle().constants().className(classId);

        return className ?? this.baseClassName();
    }

    face(): string | undefined {
        return this.props.face;
    }

    gauge(): number {
        return this.state.gauge % this.props.gaugeLineMax;
    }

    gaugeLevel(): number {
        return Math.floor(this.state.gauge / this.props.gaugeLineMax);
    }

    gaugeMax(): number {
        return this.props.gaugeLineMax;
    }

    gaugePercent(): number {
        return this.gauge() / this.gaugeMax();
    }

    hasTrait(trait: Trait.Trait | number, additional?: Trait.Trait[]): boolean {
        switch (this.props.logic) {
            case BattleActorLogic.PERFECT:
                return true;
            case BattleActorLogic.NEUTRAL:
                return false;
        }

        const traitId: number = typeof trait === "number" ? trait : trait.id,
            traits = this.traits(additional);

        return traits.filter((_trait) => _trait.id === traitId).length > 0;
    }

    health(): number {
        const traits = this.traits(),
            targetTraits: Trait.Trait[] = [];

        return this.props.baseHealth + this.state.buffs.netBuffs(Buff.BuffAction.MAXHP_VALUE, traits, targetTraits);
    }

    hits(attack: BattleAttackAction, target?: BattleActor): number[] {
        if (attack.np) return this.noblePhantasm().hits();

        const hits = this.baseHits(attack);
        const multiHit = this.multihit(attack, target);
        if (multiHit > 1) {
            return hits.map((hit) => new Array(multiHit).fill(hit)).flat();
        }
        return hits;
    }

    id(): number {
        return this.props.id;
    }

    isAlive(): boolean {
        return this.state.health > 0;
    }

    logic(): BattleActorLogic {
        return this.props.logic;
    }

    multihit(attack: BattleAttackAction, target?: BattleActor): number {
        const multiHitBuffValue = this.state.buffs.getValue(
            Buff.BuffAction.MULTIATTACK,
            this.traits(attack.traits()),
            target?.traits() ?? []
        );

        return multiHitBuffValue ?? 1;
    }

    name(): string {
        return this.props.name;
    }

    noblePhantasm(): BattleNoblePhantasm {
        return this.state.noblePhantasm;
    }

    /**
     * Returns if damage should overkill target (with consideration for overkill bug)
     */
    overkill(damage: number): boolean {
        return this.state.damageDone + damage >= this.state.health;
    }

    passives(): BattleSkillPassive[] {
        return this.props.passives;
    }

    position(): number {
        return this.state.position;
    }

    recordDamageForOverkill(damage: number) {
        this.state.damageDone += damage;
    }

    serverMod(): QuestEnemy.EnemyServerMod {
        return this.props.serverMod;
    }

    setBattle(battle: Battle) {
        this.state.battle = battle;
        this.state.buffs.setBattle(battle);
    }

    skill(num: number): BattleSkill | undefined {
        return this.state.skills.filter((skill) => skill.props.id === num).shift();
    }

    team(): BattleTeam {
        return this.props.team;
    }

    traits(additional?: Trait.Trait[]): Trait.Trait[] {
        const traits: Trait.Trait[] = [];

        traits.push(...this.props.traits);
        traits.push(...this.battle().traits());
        if (additional && additional.length) traits.push(...additional);

        const addTraitIds = this.state.buffs.getAllValues(Buff.BuffAction.INDIVIDUALITY_ADD, [], []);
        for (let traitId of addTraitIds) traits.push({ id: traitId, name: `Trait ${traitId}` });

        const subTraitIds = this.state.buffs.getAllValues(Buff.BuffAction.INDIVIDUALITY_SUB, [], []);
        if (subTraitIds.length > 0) return traits.filter((trait) => !subTraitIds.includes(trait.id));

        return traits;
    }

    protected cloneState(): BattleActorState {
        return {
            ...this.state,
            buffs: this.state.buffs.clone(),
            noblePhantasm: this.state.noblePhantasm.clone(),
            skills: this.state.skills.map((skill) => skill.clone()),
        };
    }
}
