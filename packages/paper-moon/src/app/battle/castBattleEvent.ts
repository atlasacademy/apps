import BattleAdjustNpEvent from "@atlasacademy/battle/dist/Event/BattleAdjustNpEvent";
import BattleBuffEvent from "@atlasacademy/battle/dist/Event/BattleBuffEvent";
import BattleDamageEvent from "@atlasacademy/battle/dist/Event/BattleDamageEvent";
import BattleEvent from "@atlasacademy/battle/dist/Event/BattleEvent";

import { BattleEvent as BattleStateEvent } from "./types";

export default function castBattleEvent(event: BattleEvent): BattleStateEvent {
    const actorDescription = event.actor ? `(${event.actor.id()}) ${event.actor.name()}` : "",
        targetDescription = event.target ? `(${event.target.id()}) ${event.target.name()}` : "";

    if (event instanceof BattleAdjustNpEvent) {
        let descriptionParts = [];

        descriptionParts.push(actorDescription);

        if (event.success) {
            descriptionParts.push(`charged NP by ${Math.floor((event.reference ?? 0) / 100)}%`);
        } else {
            descriptionParts.push(`failed to charge NP`);
        }

        if (event.actor.id() !== event.target.id()) {
            descriptionParts.push(`for ${targetDescription}`);
        }

        return {
            actorId: event.actor.id(),
            targetId: event.target.id(),
            description: descriptionParts.join(" "),
        };
    } else if (event instanceof BattleBuffEvent) {
        let descriptionParts = [];

        descriptionParts.push(actorDescription);
        if (!event.success) descriptionParts.push("failed to");
        descriptionParts.push(`applied buff ${event.reference.name()}`);
        if (event.actor.id() !== event.target.id()) {
            descriptionParts.push(`to ${targetDescription}`);
        }

        return {
            actorId: event.actor.id(),
            targetId: event.target.id(),
            description: descriptionParts.join(" "),
        };
    } else if (event instanceof BattleDamageEvent) {
        let descriptionParts = [];

        descriptionParts.push(actorDescription);
        descriptionParts.push(`dealt ${event.reference.damage}`);
        descriptionParts.push(`to ${targetDescription}`);

        if (event.reference.attack.np) descriptionParts.push("with NP");
        else
            descriptionParts.push(
                `with ${event.reference.attack.card.toUpperCase()} Card #${event.reference.attack.num}`
            );

        let gained = [];
        if (event.reference.npGainedOnAttack > 0) gained.push(`${event.reference.npGainedOnAttack / 100}% NP`);
        if (event.reference.stars > 0) gained.push(`${event.reference.stars} star(s)`);

        if (gained.length) descriptionParts.push(`and gained ${gained.join(" and ")}`);

        if (event.reference.npGainedOnDefence > 0)
            descriptionParts.push(`and target gained ${event.reference.npGainedOnDefence / 100}% NP`);

        return {
            actorId: event.actor.id(),
            targetId: event.target.id(),
            description: descriptionParts.join(" "),
        };
    } else {
        return {
            actorId: event.actor?.id(),
            targetId: event.target?.id(),
            description: `${event.constructor.name}`,
        };
    }
}
