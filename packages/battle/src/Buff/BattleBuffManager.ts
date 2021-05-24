import {Buff, Trait} from "@atlasacademy/api-connector";
import GameConstantManager from "../Game/GameConstantManager";
import {BattleBuff} from "./BattleBuff";

export default class BattleBuffManager {

    constructor(public list: BattleBuff[]) {
        //
    }

    public clone(): BattleBuffManager {
        return new BattleBuffManager(this.list.map(buff => buff.clone()));
    }

    add(buff: BattleBuff) {
        this.list.push(buff);
    }

    getBuffs(group: Buff.BuffAction, traits: Trait.Trait[], targetTraits: Trait.Trait[], plus: boolean): BattleBuff[] {
        const buffConstant = GameConstantManager.buffConstants(group);
        if (!buffConstant)
            throw new Error(`UNKNOWN BUFF GROUP ${group}`);

        const buffs = [],
            applicableTypes = plus ? buffConstant.plusTypes : buffConstant.minusTypes;

        for (let i in applicableTypes) {
            const type = applicableTypes[i];

            buffs.push(...this.getType(type));
        }

        return buffs;
    }

    getValue(group: Buff.BuffAction, traits: Trait.Trait[], targetTraits: Trait.Trait[]): number | undefined {
        let value: number | undefined = undefined;

        this.getBuffs(group, traits, targetTraits, true).forEach(buff => {
            const buffValue = buff.value(traits, targetTraits);
            if (value === undefined && buffValue !== 0)
                value = buffValue;
        });

        return value;
    }

    netBuffs(group: Buff.BuffAction, traits: Trait.Trait[], targetTraits: Trait.Trait[]): number {
        const buffConstant = GameConstantManager.buffConstants(group);
        if (!buffConstant)
            throw new Error(`UNKNOWN BUFF GROUP ${group}`);

        let value = buffConstant.baseParam,
            upperLimit = buffConstant.baseParam;

        this.getBuffs(group, traits, targetTraits, true).forEach(buff => {
            if (upperLimit < buff.props.buff.maxRate)
                upperLimit = buff.props.buff.maxRate;

            value += Math.floor(buff.value(traits, targetTraits));
        });

        this.getBuffs(group, traits, targetTraits, false).forEach(buff => {
            if (upperLimit < buff.props.buff.maxRate)
                upperLimit = buff.props.buff.maxRate;

            value -= Math.floor(buff.value(traits, targetTraits));
        });

        if (buffConstant.limit === Buff.BuffLimit.LOWER)
            value = Math.max(value, 0);

        value -= buffConstant.baseValue;

        if (buffConstant.limit === Buff.BuffLimit.UPPER)
            value = Math.min(value, upperLimit);

        return value;
    }

    netBuffsRate(group: Buff.BuffAction, traits: Trait.Trait[], targetTraits: Trait.Trait[]): number {
        let value = this.netBuffs(group, traits, targetTraits) / 1000;
        value = Math.fround(value);

        return value;
    }

    traits(passive: boolean) {
        const traits: Trait.Trait[] = [];

        this.list
            .filter(buff => buff.passive() === passive)
            .forEach(buff => {
                traits.push(...buff.traits());
            });

        return traits;
    }

    private getType(type: Buff.BuffType): BattleBuff[] {
        return this.list.filter(buff => buff.props.buff.type === type);
    }
}
