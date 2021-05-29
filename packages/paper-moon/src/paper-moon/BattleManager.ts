import {Servant} from "@atlasacademy/api-connector";
import BattleServantActor from "@atlasacademy/battle/dist/Actor/BattleServantActor";
import {Battle} from "@atlasacademy/battle/dist/Battle";
import {BattleTeam} from "@atlasacademy/battle/dist/Enum/BattleTeam";
import {BattleActor} from "@atlasacademy/battle/dist/Actor/BattleActor";
import {battleSyncThunk} from "../app/battle/thunks";
import {store} from "../app/store";

let battle = new Battle(null),
    nextActorId = 1;

const BattleManager = {
    battle: () => battle,
    addActor: (servant: Servant.Servant, team: BattleTeam): BattleActor => {
        const actor = new BattleServantActor({
            servant,
            id: nextActorId,
            phase: 1,
            team,
        }, null);

        battle.addActor(actor);
        nextActorId++;

        store.dispatch(battleSyncThunk());

        return actor;
    }
};

export default BattleManager;
