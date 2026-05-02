import { BattleActor } from "../Actor/BattleActor.js";
import { BattleBuff } from "../Buff/BattleBuff.js";
import BattleEvent from "./BattleEvent.js";

export default class BattleBuffEvent extends BattleEvent {
    constructor(
        public actor: BattleActor,
        public target: BattleActor,
        public success: boolean,
        public reference: BattleBuff,
    ) {
        super(actor, target, success, reference);
    }
}
