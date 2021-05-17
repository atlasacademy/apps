import BattleFunc from "../Func/BattleFunc";

export default class BattleSkillFunc extends BattleFunc {

    clone(): BattleSkillFunc {
        return new BattleSkillFunc(this.props, {
            ...this.state,
        });
    }

}
