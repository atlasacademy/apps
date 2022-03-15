import { Buff, Func } from "@atlasacademy/api-connector";

import { BattleActor } from "../Actor/BattleActor";
import { Battle } from "../Battle";
import { Variable, VariableType } from "../Game/Variable";
import BattleFunc from "./BattleFunc";

export default async function checkFuncAction(
    battle: Battle,
    func: BattleFunc,
    actor: BattleActor,
    target: BattleActor
): Promise<boolean> {
    let baseRate = func.state.dataVal.Rate ?? 0,
        skillName = func.parent.name(),
        funcType = func.props.func.funcType,
        description = `Func Chance: ${skillName}(${funcType})`,
        // just to make it more logical with what results people are expecting. low = fail, high = success
        rand = 999 - (await battle.random().generate(0, 1000, description)),
        chance = 1000,
        rate = 1000;

    if (baseRate < 0) baseRate = Math.abs(baseRate);

    switch (func.props.func.funcType) {
        case Func.FuncType.ADD_STATE:
            // Do nothing because it's handled by addStateFunc
            break;
        case Func.FuncType.INSTANT_DEATH:
            // TODO
            break;
        case Func.FuncType.SUB_STATE:
            const traits = func.props.func.traitVals,
                resistMagnification = target
                    .buffs()
                    .netBuffsRate(
                        Buff.BuffAction.TOLERANCE_SUBSTATE,
                        target.traits(target.buffs().traits(true)),
                        actor.traits(traits)
                    ),
                successMagnification = actor
                    .buffs()
                    .netBuffsRate(
                        Buff.BuffAction.GRANT_SUBSTATE,
                        actor.traits(traits),
                        target.traits(target.buffs().traits(true))
                    );

            chance = Variable.float(rand).add(Variable.float(resistMagnification)).cast(VariableType.INT).value();
            rate = Variable.float(baseRate).add(Variable.float(successMagnification)).cast(VariableType.INT).value();
            break;
        case Func.FuncType.DELAY_NPTURN:
            // TODO
            break;
        default:
            chance = rand;
            rate = baseRate;
    }

    return rate > chance;
}
