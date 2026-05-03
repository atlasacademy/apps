import { BattleActor } from "../../Actor/BattleActor.js";
import { Battle } from "../../Battle.js";
import BattleEvent from "../../Event/BattleEvent.js";
import BattleRemoveBuffEvent from "../../Event/BattleRemoveBuffEvent.js";
import { checkTrait } from "../../Trait/checkTrait.js";
import BattleFunc from "../BattleFunc.js";
import checkFuncAction from "../checkFuncAction.js";

export default async function subStateFunc(
    battle: Battle,
    func: BattleFunc,
    actor: BattleActor,
    target: BattleActor
): Promise<BattleEvent[]> {
    const events: BattleEvent[] = [];

    if (!func.applicableToTarget(target) || !(await checkFuncAction(battle, func, actor, target))) {
        const event = new BattleRemoveBuffEvent(actor, target, false);
        battle.addEvent(event);

        return [event];
    }

    let fromHead = func.state.dataVal.Value ?? 0,
        fromTail = func.state.dataVal.Value2 ?? 0,
        reverse = fromTail > 0 && fromHead === 0,
        count = fromHead,
        cleansed = 0;

    if (reverse) count = fromTail;

    target.buffs().updateList((buff) => {
        if (count != 0 && cleansed >= count) return true;

        // if (buff.checkState(NOFIELD)) return true;

        if (!checkTrait(func.props.func.traitVals, buff.traits())) return true;

        cleansed++;
        events.push(new BattleRemoveBuffEvent(actor, target, true, buff));

        return false;
    }, reverse);

    if (!events.length) events.push(new BattleRemoveBuffEvent(actor, target, false));

    events.forEach((event) => battle.addEvent(event));

    return events;
}
