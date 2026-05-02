import { BattleActor } from "../Actor/BattleActor.js";
import BattleEvent from "./BattleEvent.js";

export default class BattleAdjustNpEvent extends BattleEvent {
    constructor(
        public actor: BattleActor,
        public target: BattleActor,
        public success: boolean,
        public reference?: number,
    ) {
        super(actor, target, success, reference);
    }
}
