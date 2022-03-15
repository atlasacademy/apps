import { Buff, DataVal, Trait } from "@atlasacademy/api-connector";

import { checkAllTrait } from "../Trait/checkAllTrait";
import { checkTrait } from "../Trait/checkTrait";

export interface BattleBuffProps {
    buff: Buff.Buff;
    dataVal: DataVal.DataVal;
    passive: boolean;
    short: boolean;
}

export interface BattleBuffState {
    count: number;
    phases: number;
    turns: number;
}

export class BattleBuff {
    public state: BattleBuffState;

    constructor(public props: BattleBuffProps, state: BattleBuffState | null) {
        const turns = props.dataVal.Turn ?? -1,
            phases = turns === -1 ? -1 : turns * 2 + (props.short ? -1 : 0);

        this.state = state ?? {
            count: props.dataVal.Count ?? -1,
            phases,
            turns,
        };
    }

    clone(): BattleBuff {
        return new BattleBuff(this.props, { ...this.state });
    }

    checkBuffTrait<T extends Trait.Trait | Buff.BuffType>(self: T[], target: T[]): boolean {
        switch (this.props.buff.script.checkIndvType) {
            case undefined:
                return checkTrait(self, target);
            case 1:
                return checkAllTrait(self, target);
            // case 2:
            // case 3:
            default:
                throw new Error("Unknown buff checkIndvType");
        }
    }

    checkBuffTraitOrType(self: Trait.Trait[], target: Trait.Trait[]): boolean {
        // TODO: Muramasa buff https://apps.atlasacademy.io/db/JP/buff/3313
        // if (this.props.buff.script.CheckOpponentBuffTypes !== undefined) {
        //     const targetBuffTypes = this.props.buff.script.CheckOpponentBuffTypes as Buff.BuffType[];
        //     const selfBuffTypes = enemy.getCurrentBuffs().map(buff => buff.type);
        //     return this.checkBuffTrait(selfBuffTypes, targetBuffTypes);
        // }
        return this.checkBuffTrait(self, target);
    }

    checkTrait(self: Trait.Trait[], target: Trait.Trait[]): boolean {
        return (
            this.checkBuffTrait(self, this.props.buff.ckSelfIndv) &&
            this.checkBuffTraitOrType(target, this.props.buff.ckOpIndv)
        );
    }

    checkSuccessful(): boolean {
        // TODO: BuffRate
        return true;
    }

    description(): string {
        return this.props.buff.name;
    }

    name(): string {
        return this.props.buff.name;
    }

    passive(): boolean {
        return this.props.passive;
    }

    value(self: Trait.Trait[], target: Trait.Trait[]): number | undefined {
        if (this.checkTrait(self, target) && this.checkSuccessful()) return this.props.dataVal.Value;

        return undefined;
    }

    traits(): Trait.Trait[] {
        return this.props.buff.vals;
    }
}
