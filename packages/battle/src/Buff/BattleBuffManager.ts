import { Buff, Trait } from "@atlasacademy/api-connector";

import { BattleActorLogic } from "../Actor/BattleActor";
import { Battle } from "../Battle";
import { BattleBuff } from "./BattleBuff";

export default class BattleBuffManager {
    public logic: BattleActorLogic = BattleActorLogic.NORMAL;
    private _battle?: Battle;

    constructor(public list: BattleBuff[]) {
        //
    }

    public clone(): BattleBuffManager {
        return new BattleBuffManager(this.list.map((buff) => buff.clone()));
    }

    add(buff: BattleBuff) {
        this.list.push(buff);
    }

    all(activeOnly: boolean): BattleBuff[] {
        return this.list.filter((buff) => !activeOnly || !buff.props.passive);
    }

    battle(): Battle {
        if (this._battle === undefined) throw new Error("BATTLE NOT SET");

        return this._battle;
    }

    /**
     * `BattleBuffData.getBuffList`: returns the list of buffs matching the buff action.
     * If `checkTrait` is set to `true`, trait and BuffRate are checked.
     * @param group Buff Action group
     * @param traits Self traits
     * @param targetTraits Target traits
     * @param plus Get `plusTypes` buffs or `minusTypes` buffs
     * @param checkTrait Whether to filter for buffs matching `traits` and `targetTraits`.
     *     Most buffs' trait check runs at `buff.value()` but for some buffs like FUNCTION_COMMANDATTACK,
     *     FUNCTION_DEADATTACK, FUNCTION_DAMAGE, there's no `value()` call so the check here is needed.
     * @returns All applicable buffs
     */
    getBuffs(
        group: Buff.BuffAction,
        traits: Trait.Trait[],
        targetTraits: Trait.Trait[],
        plus: boolean,
        checkTrait: boolean = false
    ): BattleBuff[] {
        const buffConstant = this.battle().constants().buffConstants(group);
        if (!buffConstant) throw new Error(`UNKNOWN BUFF GROUP ${group}`);

        const buffs = [],
            applicableTypes = plus ? buffConstant.plusTypes : buffConstant.minusTypes;

        for (let i in applicableTypes) {
            const type = applicableTypes[i];

            buffs.push(...this.getType(type, traits, targetTraits, checkTrait));
        }

        return buffs;
    }

    /**
     * `BattleBuffData.confirmationBuff`: returns the value of the first applicable buffs
     */
    getValue(group: Buff.BuffAction, traits: Trait.Trait[], targetTraits: Trait.Trait[]): number | undefined {
        const buffs = this.getBuffs(group, traits, targetTraits, true);
        for (let buff of buffs) {
            const buffValue = buff.value(traits, targetTraits);
            if (buffValue !== undefined) return buffValue;
        }

        return undefined;
    }

    /**
     * `BattleBuffData.getBuffParamList`: returns the list of values of applicable buffs
     */
    getAllValues(group: Buff.BuffAction, traits: Trait.Trait[], targetTraits: Trait.Trait[]): number[] {
        const buffValues = [];
        const buffs = this.getBuffs(group, traits, targetTraits, true);
        for (let buff of buffs) {
            const buffValue = buff.value(traits, targetTraits);
            if (buffValue !== undefined) buffValues.push(buffValue);
        }

        return buffValues;
    }

    hasTrait(trait: Trait.Trait | number, activeOnly: boolean) {
        const traitId: number = typeof trait === "number" ? trait : trait.id,
            traits = this.traits(activeOnly);

        return traits.filter((_trait) => _trait.id === traitId).length > 0;
    }

    /**
     * `BattleBuffData.getActValue` or `BattleBuffData.getActMag`: returns the net value of all applicable buffs
     */
    netBuffs(group: Buff.BuffAction, traits: Trait.Trait[], targetTraits: Trait.Trait[]): number {
        const buffConstant = this.battle().constants().buffConstants(group);
        if (!buffConstant) throw new Error(`UNKNOWN BUFF GROUP ${group}`);

        let value = buffConstant.baseParam,
            upperLimit = buffConstant.baseParam;

        this.getBuffs(group, traits, targetTraits, true, true).forEach((buff) => {
            if (upperLimit < buff.props.buff.maxRate) upperLimit = buff.props.buff.maxRate;

            value += Math.floor(buff.value(traits, targetTraits) ?? 0);
        });

        this.getBuffs(group, traits, targetTraits, false, true).forEach((buff) => {
            if (upperLimit < buff.props.buff.maxRate) upperLimit = buff.props.buff.maxRate;

            value -= Math.floor(buff.value(traits, targetTraits) ?? 0);
        });

        if ([Buff.BuffLimit.LOWER, Buff.BuffLimit.NORMAL].includes(buffConstant.limit)) value = Math.max(value, 0);

        value -= buffConstant.baseValue;

        if ([Buff.BuffLimit.UPPER, Buff.BuffLimit.NORMAL].includes(buffConstant.limit))
            value = Math.min(value, upperLimit);

        return value;
    }

    netBuffsRate(group: Buff.BuffAction, traits: Trait.Trait[], targetTraits: Trait.Trait[]): number {
        let value = this.netBuffs(group, traits, targetTraits) / 1000;
        value = Math.fround(value);

        return value;
    }

    setBattle(battle: Battle) {
        this._battle = battle;
    }

    traits(activeOnly: boolean) {
        const traits: Trait.Trait[] = [];

        this.list
            .filter((buff) => !activeOnly || !buff.passive())
            .forEach((buff) => {
                traits.push(...buff.traits());
            });

        return traits;
    }

    updateList(callback: (buff: BattleBuff) => boolean, reverse: boolean = false) {
        let list = this.list;
        if (reverse) list = list.reverse();

        list = list.filter(callback);
        if (reverse) list = list.reverse();

        this.list = list;
    }

    private getType(
        type: Buff.BuffType,
        traits: Trait.Trait[],
        targetTraits: Trait.Trait[],
        checkTrait: boolean = false
    ): BattleBuff[] {
        return this.list.filter((buff) => {
            if (buff.props.buff.type !== type) return false;

            if (!checkTrait) return true;

            switch (this.logic) {
                case BattleActorLogic.PERFECT:
                    return true;
                case BattleActorLogic.NEUTRAL:
                    return false;
            }

            return buff.checkTrait(traits, targetTraits) && buff.checkSuccessful();
        });
    }
}
