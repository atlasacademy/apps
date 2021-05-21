import GameBuffConstantMap from "../src/Game/GameBuffConstantMap";
import GameCardConstantMap from "../src/Game/GameCardConstantMap";
import GameClassAttackRates from "../src/Game/GameClassAttackRates";
import GameConstantManager from "../src/Game/GameConstantManager";
import GameConstants from "../src/Game/GameConstants";

import buffConstants from "./samples/game/buffs.json";
import cards from "./samples/game/cards.json";
import classAttackRates from "./samples/game/classAttackRates.json";
import constants from "./samples/game/constants.json";

before(() => {
    GameConstantManager.initManually(
        <GameConstants>constants,
        <GameBuffConstantMap>buffConstants,
        <GameCardConstantMap>cards,
        <GameClassAttackRates>classAttackRates
    );
});

after(() => {
    GameConstantManager.reset();
});
