import { Trait } from "@atlasacademy/api-connector";
import {NoblePhantasm} from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import {Battle} from "../Battle";
import BattleEvent from "../Event/BattleEvent";
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

    async activate(battle: Battle): Promise<BattleEvent[]> {
        const events = [];
        for (let i = 0; i < this.state.funcs.length; i++) {
            const func = this.state.funcs[i];

            events.push(...await func.execute(battle));
        }

        return events;
    }

    func(id: number): BattleNoblePhantasmFunc | undefined {
        return this.state.funcs[id - 1];
    }

    hits(): number[] {
        return this.props.np.npDistribution;
    }

    traits(): Trait.Trait[] {
        return this.props.np.individuality;
    }

    setOvercharge(overcharge: number) {
        for (let i = 0; i < this.state.funcs.length; i++) {
            this.state.funcs[i].setOvercharge(overcharge);
        }
    }
}
