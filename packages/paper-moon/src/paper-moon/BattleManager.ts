import {Servant} from "@atlasacademy/api-connector";
import BattleServantActor from "@atlasacademy/battle/dist/Actor/BattleServantActor";
import {Battle} from "@atlasacademy/battle/dist/Battle";
import {BattleTeam} from "@atlasacademy/battle/dist/Enum/BattleTeam";
import {battleSlice} from "../app/battle/slice";
import {store} from "../app/store";

let battle = new Battle(null),
    nextActorId = 1;

export default {
    battle: () => battle,
    addActor: (servant: Servant.Servant, team: BattleTeam) => {
        const actor = new BattleServantActor({
            servant,
            id: nextActorId,
            phase: 1,
            team,
        }, null);

        battle.addActor(actor);
        nextActorId++;

        switch (team) {
            case BattleTeam.PLAYER:
                store.dispatch(battleSlice.actions.addPlayerActor(actor));
                break;
            case BattleTeam.ENEMY:
                store.dispatch(battleSlice.actions.addEnemyActor(actor));
                break;
        }
    }
}
