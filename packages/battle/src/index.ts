import { BattleCommandAction } from "./Action/BattleCommandAction.js";
import { Battle } from "./Battle.js";
import { BattleTeam } from "./Enum/BattleTeam.js";
import BattleAdjustNpEvent from "./Event/BattleAdjustNpEvent.js";
import BattleBuffEvent from "./Event/BattleBuffEvent.js";
import BattleDamageEvent from "./Event/BattleDamageEvent.js";
import BattleEvent from "./Event/BattleEvent.js";
import BattleRemoveBuffEvent from "./Event/BattleRemoveBuffEvent.js";
import BattleUnhandledEffectEvent from "./Event/BattleUnhandledEffectEvent.js";
import BattleFactory from "./Factory/BattleFactory.js";

const events = {
    BattleAdjustNpEvent,
    BattleBuffEvent,
    BattleDamageEvent,
    BattleRemoveBuffEvent,
    BattleUnhandledEffectEvent,
};

export { BattleAttackActionList } from "./Action/BattleAttackAction.js";
export { BattleActor } from "./Actor/BattleActor.js";
export type { BattleServantActorProps } from "./Factory/createServantActor.js";

export {
    Battle,
    BattleAdjustNpEvent,
    BattleBuffEvent,
    BattleCommandAction,
    BattleDamageEvent,
    BattleEvent,
    BattleFactory,
    BattleRemoveBuffEvent,
    BattleTeam,
    BattleUnhandledEffectEvent,
    events,
};
