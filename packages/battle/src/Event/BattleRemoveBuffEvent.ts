import { BattleActor } from "../Actor/BattleActor";
import { BattleBuff } from "../Buff/BattleBuff";
import BattleEvent from "./BattleEvent";

export default class BattleRemoveBuffEvent extends BattleEvent {
    constructor(
        public actor: BattleActor,
        public target: BattleActor,
        public success: boolean,
        public reference?: BattleBuff
    ) {
        super(actor, target, success, reference);
    }
}
