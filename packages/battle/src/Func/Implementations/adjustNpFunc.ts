import { Buff, Func } from "@atlasacademy/api-connector";

import { BattleActor } from "../../Actor/BattleActor";
import { Battle } from "../../Battle";
import { BattleTeam } from "../../Enum/BattleTeam";
import BattleAdjustNpEvent from "../../Event/BattleAdjustNpEvent";
import BattleEvent from "../../Event/BattleEvent";
import { Variable } from "../../Game/Variable";
import BattleFunc from "../BattleFunc";
import checkFuncAction from "../checkFuncAction";

export default async function adjustNpFunc(
    battle: Battle,
    func: BattleFunc,
    actor: BattleActor,
    target: BattleActor
): Promise<BattleEvent[]> {
    if (
        !func.applicableToTarget(target) ||
        !(await checkFuncAction(battle, func, actor, target)) ||
        target.team() === BattleTeam.ENEMY ||
        target.buffs().getBuffs(Buff.BuffAction.DONOT_GAINNP, [], target.traits(), true, true).length > 0
    ) {
        const event = new BattleAdjustNpEvent(actor, target, false);
        battle.addEvent(event);

        return [event];
    }

    let plus = func.props.func.funcType === Func.FuncType.GAIN_NP,
        amount = func.state.dataVal.Value ?? 0,
        magnification = target.buffs().netBuffs(Buff.BuffAction.FUNCGAIN_NP, [], target.traits());

    if (!func.state.dataVal.Unaffected) {
        amount = Variable.int(amount).multiply(Variable.int(magnification)).divide(Variable.int(1000)).value();
    }

    amount *= plus ? 1 : -1;
    target.adjustGauge(amount);
    const event = new BattleAdjustNpEvent(actor, target, true, amount);
    battle.addEvent(event);

    return [event];
}
