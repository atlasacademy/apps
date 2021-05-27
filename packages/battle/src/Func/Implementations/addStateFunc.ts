import {BattleActor} from "../../Actor/BattleActor";
import {Battle} from "../../Battle";
import {BattleBuff} from "../../Buff/BattleBuff";
import BattleBuffEvent from "../../Event/BattleBuffEvent";
import BattleEvent from "../../Event/BattleEvent";
import BattleFunc from "../BattleFunc";

export default async function addStateFunc(battle: Battle,
                                           func: BattleFunc,
                                           actor: BattleActor,
                                           target: BattleActor,
                                           short: boolean,
                                           passive: boolean): Promise<BattleEvent[]> {
    const events = [];

    for (let i = 0; i < func.props.func.buffs.length; i++) {
        const buff = new BattleBuff({
            buff: func.props.func.buffs[i],
            dataVal: func.state.dataVal,
            passive,
            short
        }, null);

        const rate = func.state.dataVal.Rate,
            chance = await battle.random().generate(0, 1000, "Buff Chance: " + buff.name());

        if (rate !== undefined && chance >= rate) {
            const event = new BattleBuffEvent(actor, target, false, buff);
            battle.addEvent(event);
            events.push(event);
        } else {
            target.state.buffs.add(buff);
            const event = new BattleBuffEvent(actor, target, true, buff.clone());
            battle.addEvent(event);
            events.push(event);
        }
    }

    return events;
}
