import BattleSkill, { BattleSkillProps, BattleSkillState } from "./BattleSkill";
import BattleSkillFunc from "./BattleSkillFunc";

export default class BattleSkillPassive extends BattleSkill {
    constructor(public props: BattleSkillProps, state: BattleSkillState | null) {
        super(props, state);

        const propState = state ?? {
            cooldown: 0,
            funcs: props.skill.functions.map((func, _i) => {
                return new BattleSkillFunc(
                    {
                        actorId: props.actorId,
                        func,
                        level: props.level,
                        passive: true,
                    },
                    null,
                    this
                );
            }),
        };

        this.state = propState;
        this.state.funcs.forEach((func) => (func.parent = this));
    }

    clone(): BattleSkillPassive {
        return new BattleSkillPassive(this.props, {
            ...this.state,
            funcs: this.state.funcs.map((func) => func.clone(this)),
        });
    }
}
