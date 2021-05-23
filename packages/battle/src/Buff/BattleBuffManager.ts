import {BuffAction, BuffType} from "@atlasacademy/api-connector/dist/Schema/Buff";
import {Trait} from "@atlasacademy/api-connector/dist/Schema/Trait";
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

    getBuffs(group: BuffAction, traits: Trait[], targetTraits: Trait[], plus: boolean): BattleBuff[] {
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

    getValue(group: BuffAction, traits: Trait[], targetTraits: Trait[]): number | undefined {
        let value: number | undefined = undefined;

        this.getBuffs(group, traits, targetTraits, true).forEach(buff => {
            const buffValue = buff.value(traits, targetTraits);
            if (value === undefined && buffValue !== 0)
                value = buffValue;
        });

        return value;
    }

    netBuffs(group: BuffAction, traits: Trait[], targetTraits: Trait[]): number {
        const buffConstant = GameConstantManager.buffConstants(group);
        if (!buffConstant)
            throw new Error(`UNKNOWN BUFF GROUP ${group}`);

        let value = buffConstant.baseValue;

        this.getBuffs(group, traits, targetTraits, true).forEach(buff => {
            value += buff.value(traits, targetTraits);
        });

        this.getBuffs(group, traits, targetTraits, false).forEach(buff => {
            value -= buff.value(traits, targetTraits);
        });

        return value;
    }

    netBuffsRate(group: BuffAction, traits: Trait[], targetTraits: Trait[]): number {
        let value = this.netBuffs(group, traits, targetTraits) / 1000;
        value = Math.fround(value);

        return value;
    }

    private getType(type: BuffType): BattleBuff[] {
        return this.list.filter(buff => buff.props.buff.type === type);
    }
}
