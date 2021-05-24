import BattleFunc, {BattleFuncProps, BattleFuncState} from "../Func/BattleFunc";

export default class BattleNoblePhantasmFunc extends BattleFunc {

    constructor(public props: BattleFuncProps,
                state: BattleFuncState | null) {
        super(props, {
            dataVal: BattleFunc.dataVal(props.func, props.level, 1),
            overcharge: 1,
        });
    }

    clone(): BattleNoblePhantasmFunc {
        return new BattleNoblePhantasmFunc(this.props, this.cloneState());
    }

    setOvercharge(overcharge: number) {
        this.state.overcharge = overcharge;
        this.state.dataVal = BattleFunc.dataVal(this.props.func, this.props.level, overcharge);
    }

}
