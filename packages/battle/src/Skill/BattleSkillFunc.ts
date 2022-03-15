import BattleFunc, { BattleFuncProps, BattleFuncState } from "../Func/BattleFunc";
import BattleSkill from "./BattleSkill";

export default class BattleSkillFunc extends BattleFunc {
    constructor(props: BattleFuncProps, state: BattleFuncState | null, parent: BattleSkill) {
        super(
            props,
            state ?? {
                dataVal: BattleFunc.dataVal(props.func, props.level, 1),
                overcharge: 1,
            },
            parent
        );
    }

    clone(skill: BattleSkill): BattleSkillFunc {
        return new BattleSkillFunc(this.props, this.cloneState(), skill);
    }
}
