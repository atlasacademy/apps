import { Func } from "@atlasacademy/api-connector";

import { BattleActor } from "../Actor/BattleActor.js";
import BattleEvent from "./BattleEvent.js";

export default class BattleUnhandledEffectEvent extends BattleEvent {
    constructor(
        public actor: BattleActor,
        public target: BattleActor,
        public success: false,
        public reference: Func.FuncType
    ) {
        super(actor, target, success, reference);
    }
}
