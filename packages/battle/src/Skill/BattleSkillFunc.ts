import BattleFunc, {BattleFuncProps, BattleFuncState} from "../Func/BattleFunc";

export default class BattleSkillFunc extends BattleFunc {

    constructor(props: BattleFuncProps,
                state: BattleFuncState | null) {
        super(props, state ?? {
            dataVal: BattleFunc.dataVal(props.func, props.level, 1),
            overcharge: 1
        });
    }

    clone(): BattleSkillFunc {
        return new BattleSkillFunc(this.props, this.cloneState());
    }

}
