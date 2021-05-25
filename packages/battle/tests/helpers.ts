import {Servant} from "@atlasacademy/api-connector";
import {BattleActor} from "../src/Actor/BattleActor";
import BattleServantActor from "../src/Actor/BattleServantActor";
import {BattleTeam} from "../src/Enum/BattleTeam";

import artoriaData from "./samples/servant/artoria.json";
import cuData from "./samples/servant/cu.json";
import drakeData from "./samples/servant/drake.json";
import emiyaData from "./samples/servant/emiya.json";
import gilgameshData from "./samples/servant/gilgamesh.json";
import hijikataData from "./samples/servant/hijikata.json";
import merlinData from "./samples/servant/merlin.json";
import moriartyData from "./samples/servant/moriarty.json";
import musashiData from "./samples/servant/musashi.json";
import musashiSummerData from "./samples/servant/musashi-summer.json";
import orionData from "./samples/servant/orion.json";
import reinesData from "./samples/servant/reines.json";
import robinHoodData from "./samples/servant/robin-hood.json";
import waverData from "./samples/servant/waver.json";

function makeActor(data: Servant.Servant, team: BattleTeam): BattleActor {
    return new BattleServantActor({
        id: data.collectionNo,
        phase: 1,
        servant: data,
        team
    }, null);
}

export function artoria(team: BattleTeam): BattleActor {
    return makeActor(<Servant.Servant>artoriaData, team);
}

export function cu(team: BattleTeam): BattleActor {
    return makeActor(<Servant.Servant>cuData, team);
}

export function drake(team: BattleTeam): BattleActor {
    return makeActor(<Servant.Servant>drakeData, team);
}

export function emiya(team: BattleTeam): BattleActor {
    return makeActor(<Servant.Servant>emiyaData, team);
}

export function gilgamesh(team: BattleTeam): BattleActor {
    return makeActor(<Servant.Servant>gilgameshData, team);
}

export function hijikata(team: BattleTeam): BattleActor {
    return makeActor(<Servant.Servant>hijikataData, team);
}

export function merlin(team: BattleTeam): BattleActor {
    return makeActor(<Servant.Servant>merlinData, team);
}

export function moriarty(team: BattleTeam): BattleActor {
    return makeActor(<Servant.Servant>moriartyData, team);
}

export function musashi(team: BattleTeam): BattleActor {
    return makeActor(<Servant.Servant>musashiData, team);
}

export function musashiSummer(team: BattleTeam): BattleActor {
    return makeActor(<Servant.Servant>musashiSummerData, team);
}

export function orion(team: BattleTeam): BattleActor {
    return makeActor(<Servant.Servant>orionData, team);
}

export function reines(team: BattleTeam): BattleActor {
    return makeActor(<Servant.Servant>reinesData, team);
}

export function robinHood(team: BattleTeam): BattleActor {
    return makeActor(<Servant.Servant>robinHoodData, team);
}

export function waver(team: BattleTeam): BattleActor {
    return makeActor(<Servant.Servant>waverData, team);
}
