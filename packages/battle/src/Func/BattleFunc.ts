import { DataVal, Func } from "@atlasacademy/api-connector";

import { BattleAttackAction } from "../Action/BattleAttackAction";
import { BattleActor, BattleActorLogic } from "../Actor/BattleActor";
import { Battle } from "../Battle";
import { BattleTeam } from "../Enum/BattleTeam";
import BattleEvent from "../Event/BattleEvent";
import BattleUnhandledEffectEvent from "../Event/BattleUnhandledEffectEvent";
import BattleNoblePhantasm from "../NoblePhantasm/BattleNoblePhantasm";
import BattleSkill from "../Skill/BattleSkill";
import BattleSkillPassive from "../Skill/BattleSkillPassive";
import { checkTrait } from "../Trait/checkTrait";
import addStateFunc from "./Implementations/addStateFunc";
import adjustNpFunc from "./Implementations/adjustNpFunc";
import getDamageList from "./Implementations/getDamageList";
import subStateFunc from "./Implementations/subStateFunc";

export type BattleFuncParent = BattleSkill | BattleSkillPassive | BattleNoblePhantasm;

export interface BattleFuncProps {
    actorId: number;
    func: Func.Func;
    level: number;
    passive: boolean;
}

export interface BattleFuncState {
    dataVal: DataVal.DataVal;
    overcharge: number;
}

export default abstract class BattleFunc {
    constructor(public props: BattleFuncProps, public state: BattleFuncState, public parent: BattleFuncParent) {
        //
    }

    abstract clone(parent: BattleFuncParent): BattleFunc;

    async execute(battle: Battle): Promise<BattleEvent[]> {
        const actor = battle.getActor(this.props.actorId);
        if (!actor) throw new Error("ACTOR DOES NOT EXIST");

        if (this.props.func.funcTargetTeam === Func.FuncTargetTeam.PLAYER && actor.props.team !== BattleTeam.PLAYER)
            return [];
        if (this.props.func.funcTargetTeam === Func.FuncTargetTeam.ENEMY && actor.props.team !== BattleTeam.ENEMY)
            return [];

        const events = [];
        if (this.isSpecialSelectFunc()) {
            // TODO
        } else {
            const targets = battle.getTargets(actor, this.props.func.funcTargetType);
            for (let i = 0; i < targets.length; i++) {
                events.push(...(await this.executeStandardFunc(battle, actor, targets[i])));
            }
        }

        return events;
    }

    protected cloneState(): BattleFuncState {
        return {
            ...this.state,
        };
    }

    protected static dataVal(func: Func.Func, level: number, overcharge: number): DataVal.DataVal {
        let sval: DataVal.DataVal[];

        if (overcharge === 5 && func.svals5 && func.svals5.length) sval = func.svals5;
        else if (overcharge === 4 && func.svals4 && func.svals4.length) sval = func.svals4;
        else if (overcharge === 3 && func.svals3 && func.svals3.length) sval = func.svals3;
        else if (overcharge === 2 && func.svals2 && func.svals2.length) sval = func.svals2;
        else sval = func.svals;

        return sval[level - 1] ?? sval[sval.length - 1] ?? {};
    }

    private async executeStandardFunc(battle: Battle, actor: BattleActor, target: BattleActor): Promise<BattleEvent[]> {
        switch (this.props.func.funcType) {
            case Func.FuncType.ADD_STATE:
                return addStateFunc(battle, this, actor, target, false, this.props.passive);
            case Func.FuncType.ADD_STATE_SHORT:
                return addStateFunc(battle, this, actor, target, true, this.props.passive);
            case Func.FuncType.DAMAGE_NP:
            case Func.FuncType.DAMAGE_NP_AND_CHECK_INDIVIDUALITY:
            case Func.FuncType.DAMAGE_NP_COUNTER:
            case Func.FuncType.DAMAGE_NP_HPRATIO_HIGH:
            case Func.FuncType.DAMAGE_NP_INDIVIDUAL:
            case Func.FuncType.DAMAGE_NP_PIERCE:
            case Func.FuncType.DAMAGE_NP_RARE:
            case Func.FuncType.DAMAGE_NP_SAFE:
            case Func.FuncType.DAMAGE_NP_STATE_INDIVIDUAL:
            case Func.FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX:
                return getDamageList(battle, actor.noblePhantasm().action(actor), actor, target, this);
            case Func.FuncType.GAIN_NP:
            case Func.FuncType.LOSS_NP:
                return adjustNpFunc(battle, this, actor, target);
            case Func.FuncType.SUB_STATE:
                return subStateFunc(battle, this, actor, target);
            case Func.FuncType.EVENT_DROP_UP:
            case Func.FuncType.EVENT_POINT_UP:
            case Func.FuncType.SERVANT_FRIENDSHIP_UP:
            case Func.FuncType.NONE:
                // DO NOTHING
                return [];
            default:
                const event = new BattleUnhandledEffectEvent(actor, target, false, this.props.func.funcType);
                battle.addEvent(event);

                return [event];
        }
    }

    private isSpecialSelectFunc(): boolean {
        switch (this.props.func.funcTargetType) {
            case Func.FuncTargetType.COMMAND_TYPE_SELF_TREASURE_DEVICE:
                return true;
        }

        return false;
    }

    applicableToTarget(target: BattleActor): boolean {
        switch (target.logic()) {
            case BattleActorLogic.PERFECT:
                return true;
            case BattleActorLogic.NEUTRAL:
                return false;
        }

        const functvals = this.props.func.functvals ?? [];
        if (functvals.length) {
            const traits = target.traits(target.buffs().traits(true)),
                isApplicable = checkTrait(functvals, traits);

            if (!isApplicable) return false;
        }

        const funcquestTvals = this.props.func.funcquestTvals ?? [];
        if (funcquestTvals.length) {
            // checkTrait will return true if target trait list (ie: Battle Traits) is empty
            // in the actual game, you can't enter a quest with no quest traits
            // however in our sandbox, this is possible because the user might not set the battle traits explicitly
            // therefore, if the user does not set traits, isApplicable should be false
            const isApplicable =
                target.battle().traits().length > 0
                    ? checkTrait(
                          funcquestTvals,
                          target
                              .battle()
                              .traits()
                              .map((trait) => trait.id)
                      )
                    : false;

            if (!isApplicable) return false;
        }

        return true;
    }
}
