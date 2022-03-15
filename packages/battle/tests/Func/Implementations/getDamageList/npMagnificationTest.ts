import { expect } from "chai";

import { Card } from "@atlasacademy/api-connector";

import { BattleTeam } from "../../../../src";
import { BattleAttackAction } from "../../../../src/Action/BattleAttackAction";
import { npMagnification } from "../../../../src/Func/Implementations/getDamageList";
import { createBattle, servant } from "../../../helpers";

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
