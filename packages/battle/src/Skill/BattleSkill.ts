import {Skill} from "@atlasacademy/api-connector";
import {Battle} from "../Battle";
import BattleEvent from "../Event/BattleEvent";
import BattleSkillFunc from "./BattleSkillFunc";

export interface BattleSkillProps {
    actorId: number,
    id: number,
    skill: Skill.Skill,
    level: number,
}

export interface BattleSkillState {
    cooldown: number,
    funcs: BattleSkillFunc[],
}

export default class BattleSkill {
    public state: BattleSkillState;

    constructor(public props: BattleSkillProps, state: BattleSkillState | null) {
        this.state = state ?? {
            cooldown: 0,
            funcs: props.skill.functions.map((func, i) => {
                return new BattleSkillFunc({
                    actorId: props.actorId,
                    func,
                    level: props.level,
                    passive: false,
                }, null);
            })
        };
    }

    async activate(battle: Battle): Promise<BattleEvent[]> {
        const events = [];
        for (let i = 0; i < this.state.funcs.length; i++) {
            const func = this.state.funcs[i];

            events.push(...await func.execute(battle));
        }

        return events;
    }

    clone(): BattleSkill {
        return new BattleSkill(this.props, {
            ...this.state,
            funcs: this.state.funcs.map(func => func.clone()),
        });
    }

    func(num: number): BattleSkillFunc | undefined {
        return this.state.funcs[num - 1];
    }

}
