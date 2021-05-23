import { EnumList } from "@atlasacademy/api-connector";
import { CardConstantMap } from "@atlasacademy/api-connector/dist/Enum/Card";
import {ClassAffinityMap, ClassAttackRateMap} from "@atlasacademy/api-connector/dist/Enum/ClassName";
import { BuffConstantMap } from "@atlasacademy/api-connector/dist/Schema/Buff";
import { Constants } from "@atlasacademy/api-connector/dist/Schema/Constant";
import GameConstantManager from "../src/Game/GameConstantManager";

import buffConstants from "./samples/game/buffs.json";
import cards from "./samples/game/cards.json";
import classAffinity from "./samples/game/classAffinity.json";
import classAttackRates from "./samples/game/classAttackRates.json";
import constants from "./samples/game/constants.json";
import enums from "./samples/game/enums.json";

before(() => {
    GameConstantManager.initManually(
        <Constants>constants,
        <BuffConstantMap>buffConstants,
        <CardConstantMap>cards,
        <ClassAffinityMap>classAffinity,
        <ClassAttackRateMap>classAttackRates,
        <EnumList>enums
    );
});

after(() => {
    GameConstantManager.reset();
});
