import {Region, Servant} from "@atlasacademy/api-connector";
import {BattleAttackActionList} from "@atlasacademy/battle/dist/Action/BattleAttackAction";
import {BattleActor} from "@atlasacademy/battle/dist/Actor/BattleActor";
import BattleServantActor from "@atlasacademy/battle/dist/Actor/BattleServantActor";
import {Battle} from "@atlasacademy/battle/dist/Battle";
import {BattleTeam} from "@atlasacademy/battle/dist/Enum/BattleTeam";
import {BattleQueuedAttack} from "../app/battle/types";

let battle = new Battle(null),
    nextActorId = 1;

const BattleManager = {
    battle: () => battle,
    setup: async () => {
        await Battle.loadConstants(Region.JP);
    },
    start: async () => {
        await battle.init();
    },

    addActor: (servant: Servant.Servant, team: BattleTeam): BattleActor => {
        const actor = new BattleServantActor({
            servant,
            id: nextActorId,
            phase: 1,
            team,
        }, null);

        battle.addActor(actor);
        nextActorId++;

        return actor;
    },
    attack: async (attacks: BattleQueuedAttack[]) => {
        const actions = new BattleAttackActionList();

        for (let i in attacks) {
            const attack = attacks[i],
                actor = battle.getActor(attack.actorId);

            if (!actor) {
                throw new Error('FAILED TO FIND ACTOR');
            }

            actions.add(actor, attack.card, false);
        }

        const target = battle.actors().actorByPosition(BattleTeam.ENEMY, 1);
        if (!target) {
            throw new Error('FAILED TO FIND TARGET');
        }

        for (let i in actions.actions) {
            const action = actions.actions[i];

            await action.actor.autoAttack(action, target);
        }
    }
};

export default BattleManager;
