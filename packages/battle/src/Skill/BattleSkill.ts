import { Skill } from "@atlasacademy/api-connector";

import { Battle } from "../Battle";
import BattleEvent from "../Event/BattleEvent";
import BattleSkillFunc from "./BattleSkillFunc";

export interface BattleSkillProps {
    actorId: number;
    id: number;
    skill: Skill.Skill;
    level: number;
}

export interface BattleSkillState {
    cooldown: number;
    funcs: BattleSkillFunc[];
}

export default class BattleSkill {
    public state: BattleSkillState;

    constructor(public props: BattleSkillProps, state: BattleSkillState | null) {
        this.state = state ?? {
            cooldown: 0,
            funcs: props.skill.functions.map((func, i) => {
                return new BattleSkillFunc(
                    {
                        actorId: props.actorId,
                        func,
                        level: props.level,
                        passive: false,
                    },
                    null,
                    this
                );
            }),
        };

        this.state.funcs.forEach((func) => (func.parent = this));
    }

    async activate(battle: Battle): Promise<BattleEvent[]> {
        this.state.cooldown = this.props.skill.coolDown[this.props.level - 1] ?? 0;

        const events = [];
        for (let i = 0; i < this.state.funcs.length; i++) {
            const func = this.state.funcs[i];

            events.push(...(await func.execute(battle)));
        }

        return events;
    }

    available(): boolean {
        return this.state.cooldown <= 0;
    }

    clone(): BattleSkill {
        const skill = new BattleSkill(this.props, { ...this.state });
        skill.state.funcs = skill.state.funcs.map((func) => func.clone(skill));

        return skill;
    }

    cooldown(): number {
        return this.state.cooldown;
    }

    func(num: number): BattleSkillFunc | undefined {
        return this.state.funcs[num - 1];
    }

    icon(): string | undefined {
        return this.props.skill.icon;
    }

    level(): number {
        return this.props.level;
    }

    name(): string {
        return this.props.skill.name;
    }
}
