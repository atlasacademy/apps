import { BattleAttackAction } from "../Action/BattleAttackAction";
import { BattleActor } from "../Actor/BattleActor";
import BattleEvent from "./BattleEvent";

export interface BattleDamageEventData {
    attack: BattleAttackAction;
    damage: number;
    npGainedOnAttack: number;
    npGainedOnDefence: number;
    stars: number;
}

export default class BattleDamageEvent extends BattleEvent {
    constructor(
        public actor: BattleActor,
        public target: BattleActor,
        public success: boolean,
        public reference: BattleDamageEventData
    ) {
        super(actor, target, success, reference);
    }
}
