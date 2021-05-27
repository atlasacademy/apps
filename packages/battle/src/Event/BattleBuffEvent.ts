import {BattleActor} from "../Actor/BattleActor";
import {BattleBuff} from "../Buff/BattleBuff";
import BattleEvent from "./BattleEvent";

export default class BattleBuffEvent extends BattleEvent {

    constructor(public actor: BattleActor | null,
                public target: BattleActor | null,
                public success: boolean,
                public reference: BattleBuff) {
        super(actor, target, success, reference);
    }

}
