import {EnumList} from "@atlasacademy/api-connector";
import {BuffConstantMap} from "@atlasacademy/api-connector/dist/Schema/Buff";
import GameConstantManager from "../src/Game/GameConstantManager";

import attributeAffinity from "./samples/game/attributeAffinity.json";
import buffConstants from "./samples/game/buffs.json";
import cards from "./samples/game/cards.json";
import classAffinity from "./samples/game/classAffinity.json";
import classAttackRates from "./samples/game/classAttackRates.json";
import constants from "./samples/game/constants.json";
import enums from "./samples/game/enums.json";

before(() => {
    GameConstantManager.initManually(
        constants,
        attributeAffinity,
        <BuffConstantMap>buffConstants,
        cards,
        classAffinity,
        classAttackRates,
        <EnumList>enums
    );
});

after(() => {
    GameConstantManager.reset();
});
