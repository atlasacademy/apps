import {NoblePhantasm} from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import BattleNoblePhantasmFunc from "./BattleNoblePhantasmFunc";

export interface BattleNoblePhantasmProps {
    actorId: number,
    np: NoblePhantasm,
    level: number,
}

export interface BattleNoblePhantasmState {
    funcs: BattleNoblePhantasmFunc[],
}

export default class BattleNoblePhantasm {

    public state: BattleNoblePhantasmState;

    constructor(public props: BattleNoblePhantasmProps,
                state: BattleNoblePhantasmState | null) {
        this.state = state ?? {
            funcs: this.props.np.functions.map(func => {
                return new BattleNoblePhantasmFunc({
                    actorId: this.props.actorId,
                    func,
                    level: this.props.level,
                }, null);
            }),
        };
    }

    clone(): BattleNoblePhantasm {
        return new BattleNoblePhantasm(this.props, {
            ...this.state
        });
    }

    hits(): number[] {
        return this.props.np.npDistribution;
    }

}
