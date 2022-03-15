import { Card, NoblePhantasm, Trait } from "@atlasacademy/api-connector";

import { BattleAttackAction } from "../Action/BattleAttackAction";
import { BattleActor } from "../Actor/BattleActor";
import { Battle } from "../Battle";
import BattleEvent from "../Event/BattleEvent";
import BattleNoblePhantasmFunc from "./BattleNoblePhantasmFunc";

export interface BattleNoblePhantasmProps {
    actorId: number;
    np: NoblePhantasm.NoblePhantasm;
    level: number;
}

export interface BattleNoblePhantasmState {
    funcs: BattleNoblePhantasmFunc[];
}

export default class BattleNoblePhantasm {
    public state: BattleNoblePhantasmState;

    constructor(public props: BattleNoblePhantasmProps, state: BattleNoblePhantasmState | null) {
        this.state = state ?? {
            funcs: this.props.np.functions.map((func) => {
                return new BattleNoblePhantasmFunc(
                    {
                        actorId: this.props.actorId,
                        func,
                        level: this.props.level,
                        passive: false,
                    },
                    null,
                    this
                );
            }),
        };
    }

    clone(): BattleNoblePhantasm {
        return new BattleNoblePhantasm(this.props, {
            ...this.state,
        });
    }

    async activate(battle: Battle): Promise<BattleEvent[]> {
        const events = [];
        for (let i = 0; i < this.state.funcs.length; i++) {
            const func = this.state.funcs[i];

            events.push(...(await func.execute(battle)));
        }

        return events;
    }

    func(id: number): BattleNoblePhantasmFunc {
        return this.state.funcs[id - 1];
    }

    hits(): number[] {
        return this.props.np.npDistribution;
    }

    name(): string {
        return this.props.np.name;
    }

    traits(): Trait.Trait[] {
        return this.props.np.individuality;
    }

    setOvercharge(overcharge: number) {
        for (let i = 0; i < this.state.funcs.length; i++) {
            this.state.funcs[i].setOvercharge(overcharge);
        }
    }

    gainForCard(card: Card): number {
        let gains: number[] = [];
        switch (card) {
            case Card.BUSTER:
                gains = this.props.np.npGain.buster;
                break;
            case Card.ARTS:
                gains = this.props.np.npGain.arts;
                break;
            case Card.QUICK:
                gains = this.props.np.npGain.quick;
                break;
            case Card.EXTRA:
                gains = this.props.np.npGain.extra;
                break;
        }

        return gains[this.props.level - 1] ?? 0;
    }

    gainForDefense(): number {
        return this.props.np.npGain.defence[this.props.level - 1] ?? 0;
    }

    gainForNp(): number {
        return this.props.np.npGain.np[this.props.level - 1] ?? 0;
    }

    level(): number {
        return this.props.level;
    }

    action(actor: BattleActor): BattleAttackAction {
        return new BattleAttackAction(actor, this.props.np.card, false, Card.NONE, false, true, 1);
    }
}
