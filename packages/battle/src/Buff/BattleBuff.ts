import {Buff} from "@atlasacademy/api-connector/dist/Schema/Buff";
import {DataVal} from "@atlasacademy/api-connector/dist/Schema/DataVal";
import {Trait} from "@atlasacademy/api-connector/dist/Schema/Trait";


export interface BattleBuffProps {
    buff: Buff,
    dataVal: DataVal,
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

    value(traits: Trait[], targetTraits: Trait[]): number {
        return this.props.dataVal.Value ?? 0;
    }
}
