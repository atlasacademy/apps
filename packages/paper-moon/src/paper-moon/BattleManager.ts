import { Language, Region } from "@atlasacademy/api-connector";
import { BattleActor, BattleAttackActionList, BattleFactory, BattleTeam } from "@atlasacademy/battle";
import type { BattleServantActorProps } from "@atlasacademy/battle";

import { BattleQueuedAttack } from "../app/battle/types";

let factory = new BattleFactory(),
    battle = factory.battle;

const BattleManager = {
    battle: () => battle,
    factory: () => factory,
    setup: async () => {
        await factory.setRegion(Region.JP, Language.ENGLISH);
    },
    start: async () => {
        await factory.load();
        await battle.init();
    },
    addServant: (props: BattleServantActorProps): BattleActor => {
        return factory.addServant(props);
    },
    attack: async (attacks: BattleQueuedAttack[]) => {
        const actions = new BattleAttackActionList();

        for (let i in attacks) {
            const attack = attacks[i],
                actor = battle.getActor(attack.actorId);

            if (!actor) {
                throw new Error("FAILED TO FIND ACTOR");
            }

            actions.add(actor, attack.card, false);
        }

        const enemyCount = battle.actors().aliveActorsByTeam(BattleTeam.ENEMY).length;
        if (!enemyCount) {
            throw new Error("NO ENEMIES AVAILABLE");
        }

        for (let i in actions.actions) {
            const action = actions.actions[i];

            await action.actor.autoAttack(action);
        }
    },
};

export default BattleManager;
