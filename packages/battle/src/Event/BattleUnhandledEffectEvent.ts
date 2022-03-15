import { Func } from "@atlasacademy/api-connector";

import { BattleActor } from "../Actor/BattleActor";
import BattleEvent from "./BattleEvent";

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
