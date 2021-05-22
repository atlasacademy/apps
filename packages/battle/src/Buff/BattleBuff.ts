import {Buff, DataVal, Trait} from "@atlasacademy/api-connector";
import {checkAllTrait} from "../Trait/checkAllTrait";
import {checkTrait} from "../Trait/checkTrait";

export interface BattleBuffProps {
    buff: Buff.BasicBuff,
    dataVal: DataVal.DataVal,
    short: boolean,
}

export interface BattleBuffState {
    count: number,
    phases: number,
    turns: number,
}

export class BattleBuff {
    public state: BattleBuffState;

    constructor(public props: BattleBuffProps,
                state: BattleBuffState | null) {
        const turns = props.dataVal.Turn ?? -1,
            phases = turns === -1 ? -1 : ((turns * 2) + (props.short ? -1 : 0));

        this.state = state ?? {
            count: props.dataVal.Count ?? -1,
            phases, turns,
        };
    }

    clone(): BattleBuff {
        return new BattleBuff(this.props, {...this.state});
    }

    description(): string {
        return this.props.buff.name;
    }

    checkBuffTrait(self: Trait.Trait[], target: Trait.Trait[]): boolean {
        switch (this.props.buff.script.checkIndvType) {
            case undefined:
                return checkTrait(self, target)
            case 1:
                checkAllTrait(self, target);
            // case 2:
            // case 3:
            default:
                throw new Error('Unknown buff checkIndvType');
        }
    }

    checkTrait(self: Trait.Trait[], target: Trait.Trait[]): boolean {
        return this.checkBuffTrait(self, this.props.buff.ckSelfIndv) && checkTrait(target, this.props.buff.ckOpIndv);
    }

    value(self: Trait.Trait[], target: Trait.Trait[]): number {
        if (this.checkTrait(self, target))
            return this.props.dataVal.Value ?? 0;

        return 0;
    }
}
