import { BattleActor } from "../Actor/BattleActor";

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
