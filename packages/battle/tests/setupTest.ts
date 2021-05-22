import { CardConstantMap } from "@atlasacademy/api-connector/dist/Enum/Card";
import { ClassAttackRateMap } from "@atlasacademy/api-connector/dist/Enum/ClassName";
import { BuffConstantMap } from "@atlasacademy/api-connector/dist/Schema/Buff";
import { Constants } from "@atlasacademy/api-connector/dist/Schema/Constant";
import GameConstantManager from "../src/Game/GameConstantManager";

import buffConstants from "./samples/game/buffs.json";
import cards from "./samples/game/cards.json";
import classAttackRates from "./samples/game/classAttackRates.json";
import constants from "./samples/game/constants.json";

before(() => {
    GameConstantManager.initManually(
        <Constants>constants,
        <BuffConstantMap>buffConstants,
        <CardConstantMap>cards,
        <ClassAttackRateMap>classAttackRates
    );
});

after(() => {
    GameConstantManager.reset();
});
