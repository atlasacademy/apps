import { BattleActor } from "../Actor/BattleActor.js";

export default abstract class BattleEvent {
    constructor(
        public actor: BattleActor | null,
        public target: BattleActor | null,
        public success: boolean,
        public reference?: any
    ) {
        //
    }
}
