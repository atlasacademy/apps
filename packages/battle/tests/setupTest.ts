import GameBuffConstantMap from "../src/Game/GameBuffConstantMap";
import GameCardConstantMap from "../src/Game/GameCardConstantMap";
import GameConstantManager from "../src/Game/GameConstantManager";
import GameConstants from "../src/Game/GameConstants";

import buffConstants from "./samples/game/buffs.json";
import cards from "./samples/game/cards.json";
import constants from "./samples/game/constants.json";

before(() => {
    GameConstantManager.initManually(
        <GameConstants>constants,
        <GameBuffConstantMap>buffConstants,
        <GameCardConstantMap>cards
    );
});

after(() => {
    GameConstantManager.reset();
});
