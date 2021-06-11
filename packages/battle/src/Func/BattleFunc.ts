import {DataVal, Func} from "@atlasacademy/api-connector";
import {BattleActor} from "../Actor/BattleActor";
import {Battle} from "../Battle";
import {BattleTeam} from "../Enum/BattleTeam";
import BattleEvent from "../Event/BattleEvent";
import BattleUnhandledEffectEvent from "../Event/BattleUnhandledEffectEvent";
import {checkTrait} from "../Trait/checkTrait";
import addStateFunc from "./Implementations/addStateFunc";
import subStateFunc from "./Implementations/subStateFunc";

export interface BattleFuncProps {
    actorId: number,
    func: Func.Func,
    level: number,
    passive: boolean,
}

export interface BattleFuncState {
    dataVal: DataVal.DataVal,
    overcharge: number,
}

export default abstract class BattleFunc {

    constructor(public props: BattleFuncProps,
                public state: BattleFuncState) {
        //
    }

    async execute(battle: Battle): Promise<BattleEvent[]> {
        const actor = battle.getActor(this.props.actorId);
        if (!actor)
            throw new Error('ACTOR DOES NOT EXIST');

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
                events.push(...await this.executeStandardFunc(battle, actor, targets[i]));
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

        if (overcharge === 5 && func.svals5 && func.svals5.length)
            sval = func.svals5;
        else if (overcharge === 4 && func.svals4 && func.svals4.length)
            sval = func.svals4;
        else if (overcharge === 3 && func.svals3 && func.svals3.length)
            sval = func.svals3;
        else if (overcharge === 2 && func.svals2 && func.svals2.length)
            sval = func.svals2;
        else
            sval = func.svals;

        return sval[level - 1] ?? sval[sval.length - 1] ?? {};
    }

    private async executeStandardFunc(battle: Battle, actor: BattleActor, target: BattleActor): Promise<BattleEvent[]> {
        switch (this.props.func.funcType) {
            case Func.FuncType.ADD_STATE:
                return addStateFunc(battle, this, actor, target, false, this.props.passive);
            case Func.FuncType.ADD_STATE_SHORT:
                return addStateFunc(battle, this, actor, target, true, this.props.passive);
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
        if (!this.props.func.functvals || !this.props.func.functvals.length)
            return true;

        const traits = target.traits(target.buffs().traits(true));

        return checkTrait(this.props.func.functvals, traits)
    }
}
