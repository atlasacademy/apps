import {DataVal} from "@atlasacademy/api-connector/dist/Schema/DataVal";
import {Func, FuncTargetTeam, FuncType} from "@atlasacademy/api-connector/dist/Schema/Func";
import {BattleActor} from "../Actor/BattleActor";
import {Battle} from "../Battle";
import {BattleTeam} from "../Enum/BattleTeam";
import BattleEvent from "../Event/BattleEvent";
import addStateFunc from "./Implementations/addStateFunc";

export interface BattleFuncProps {
    actorId: number,
    func: Func,
    level: number,
}

export interface BattleFuncState {
    dataVal: DataVal,
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

        if (this.props.func.funcTargetTeam === FuncTargetTeam.PLAYER && actor.props.team !== BattleTeam.PLAYER)
            return [];
        if (this.props.func.funcTargetTeam === FuncTargetTeam.ENEMY && actor.props.team !== BattleTeam.ENEMY)
            return [];

        const events = [];
        if (this.isSpecialSelectFunc()) {

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

    protected static dataVal(func: Func, level: number, overcharge: number): DataVal {
        let sval : DataVal[];

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

    private executeStandardFunc(battle: Battle, actor: BattleActor, target: BattleActor) {
        switch (this.props.func.funcType) {
            case FuncType.ADD_STATE:
                return addStateFunc(battle, this, actor, target, false);
            case FuncType.ADD_STATE_SHORT:
                return addStateFunc(battle, this, actor, target, true);
            default:
                throw new Error('UNSUPPORTED FUNC TYPE: ' + this.props.func.funcType);
        }
    }

    private isSpecialSelectFunc(): boolean {
        return false;
    }

}
