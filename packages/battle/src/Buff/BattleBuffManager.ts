import {BuffType} from "@atlasacademy/api-connector/dist/Schema/Buff";
import {Trait} from "@atlasacademy/api-connector/dist/Schema/Trait";
import {GameBuffGroup} from "../Game/GameBuffConstantMap";
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

    netBuffs(group: GameBuffGroup, traits: Trait[], targetTraits: Trait[]) {
        const buffConstant = GameConstantManager.buffConstants(group);
        if (!buffConstant)
            throw new Error(`UNKNOWN BUFF GROUP ${group}`);

        let value = buffConstant.baseValue;

        for (let i in buffConstant.plusTypes) {
            const type = buffConstant.plusTypes[i],
                buffs = this.getType(type);

            for (let j in buffs) {
                value += buffs[j].value(traits, targetTraits);
            }
        }

        return value;
    }

    private getType(type: BuffType): BattleBuff[] {
        return this.list.filter(buff => buff.props.buff.type === type);
    }
}
