import {Buff, EnumList} from "@atlasacademy/api-connector";
import GameConstantManager from "../src/Game/GameConstantManager";

import attributeAffinity from "./../test-data/data/NiceAttributeRelation.json";
import buffConstants from "./../test-data/data/NiceBuffList.ActionList.json";
import cards from "./../test-data/data/NiceCard.json";
import classAffinity from "./../test-data/data/NiceClassRelation.json";
import classAttackRates from "./../test-data/data/NiceClassAttackRate.json";
import constants from "./../test-data/data/NiceConstant.json";
import enums from "./../test-data/data/nice_enums.json";

before(() => {
    GameConstantManager.initManually(
        constants,
        attributeAffinity,
        <Buff.BuffConstantMap>buffConstants,
        cards,
        classAffinity,
        classAttackRates,
        <EnumList>enums
    );
});

after(() => {
    GameConstantManager.reset();
});
