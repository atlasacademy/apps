import { Buff } from "@atlasacademy/api-connector";

import { BattleActor } from "../../Actor/BattleActor";
import { Battle } from "../../Battle";
import { BattleBuff } from "../../Buff/BattleBuff";
import BattleBuffEvent from "../../Event/BattleBuffEvent";
import BattleEvent from "../../Event/BattleEvent";
import { Variable, VariableType } from "../../Game/Variable";
import BattleFunc from "../BattleFunc";

function checkBuffAvoided(battle: Battle, actor: BattleActor, target: BattleActor): boolean {
    const avoidBuffs = actor.buffs().getBuffs(Buff.BuffAction.AVOID_STATE, actor.traits(), target.traits(), true, true);

    return avoidBuffs.length > 0;
}

async function checkBuffSuccess(
    battle: Battle,
    func: BattleFunc,
    buff: BattleBuff,
    actor: BattleActor,
    target: BattleActor
): Promise<boolean> {
    let baseRate = func.state.dataVal.Rate ?? 0,
        buffResist = target
            .buffs()
            .netBuffs(Buff.BuffAction.RESISTANCE_STATE, target.traits(), actor.traits(buff.traits())),
        buffChanceBonus = actor
            .buffs()
            .netBuffs(Buff.BuffAction.GRANT_STATE, actor.traits(buff.traits()), target.traits()),
        // just to make it more logical with what results people are expecting. low = fail, high = success
        chance = 999 - (await battle.random().generate(0, 1000, "Buff Chance: " + buff.name())),
        resist = Variable.float(chance).add(Variable.float(buffResist)).cast(VariableType.INT).value(),
        rate = Variable.float(baseRate).add(Variable.float(buffChanceBonus)).cast(VariableType.INT).value();

    if (baseRate < 0) rate = -1000;

    return rate >= resist;
}

function createBuffFromFunc(func: BattleFunc, i: number, passive: boolean, short: boolean): BattleBuff {
    return new BattleBuff(
        {
            buff: func.props.func.buffs[i],
            dataVal: func.state.dataVal,
            passive,
            short,
        },
        null
    );
}

export default async function addStateFunc(
    battle: Battle,
    func: BattleFunc,
    actor: BattleActor,
    target: BattleActor,
    short: boolean,
    passive: boolean
): Promise<BattleEvent[]> {
    const events = [];

    for (let i = 0; i < func.props.func.buffs.length; i++) {
        const buff = createBuffFromFunc(func, i, passive, short);

        let success = func.applicableToTarget(target);

        if (success && checkBuffAvoided(battle, actor, target)) success = false;

        if (success && !(await checkBuffSuccess(battle, func, buff, actor, target))) success = false;

        if (success) target.state.buffs.add(buff);

        const event = new BattleBuffEvent(actor, target, success, buff);
        battle.addEvent(event);
        events.push(event);
    }

    return events;
}

export { checkBuffAvoided, checkBuffSuccess, createBuffFromFunc };
