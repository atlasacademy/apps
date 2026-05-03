import { expect } from "chai";

import { Card } from "@atlasacademy/api-connector";

import { BattleAttackAction } from "../../../../src/Action/BattleAttackAction.js";
import { npMagnification } from "../../../../src/Func/Implementations/getDamageList.js";
import { BattleTeam } from "../../../../src/index.js";
import { createBattle, servant } from "../../../helpers.js";

describe("getDamageList npMagnification", () => {
    it("check np buff", async () => {
        const actor = servant(65, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        const attack = new BattleAttackAction(actor, Card.BUSTER, false, Card.BUSTER, false, true, 1);

        expect(npMagnification(attack, actor, target).value()).to.equal(0);

        await actor.skill(1)?.activate(battle);
        expect(npMagnification(attack, actor, target).value()).to.be.closeTo(0.17, 0.0001);
    });
});
