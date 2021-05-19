import {NoblePhantasm} from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";

export interface BattleNoblePhantasmProps {
    np: NoblePhantasm,
    level: number,
}

export interface BattleNoblePhantasmState {

}

export default class BattleNoblePhantasm {

    public state: BattleNoblePhantasmState;

    constructor(public props: BattleNoblePhantasmProps,
                state: BattleNoblePhantasmState | null) {
        this.state = state ?? {

        };
    }

    clone(): BattleNoblePhantasm {
        return new BattleNoblePhantasm(this.props, {
            ...this.state
        });
    }

    hits(): number[] {
        return this.props.np.npDistribution;
    }

}
