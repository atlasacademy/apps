import BattleFunc, { BattleFuncProps, BattleFuncState } from "../Func/BattleFunc";
import BattleNoblePhantasm from "./BattleNoblePhantasm";

export default class BattleNoblePhantasmFunc extends BattleFunc {
    constructor(public props: BattleFuncProps, state: BattleFuncState | null, parent: BattleNoblePhantasm) {
        super(
            props,
            {
                dataVal: BattleFunc.dataVal(props.func, props.level, 1),
                overcharge: 1,
            },
            parent
        );
    }

    clone(np: BattleNoblePhantasm): BattleNoblePhantasmFunc {
        return new BattleNoblePhantasmFunc(this.props, this.cloneState(), np);
    }

    setOvercharge(overcharge: number) {
        this.state.overcharge = overcharge;
        this.state.dataVal = BattleFunc.dataVal(this.props.func, this.props.level, overcharge);
    }
}
