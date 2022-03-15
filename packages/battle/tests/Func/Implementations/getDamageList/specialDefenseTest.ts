import { expect } from "chai";

import { Card } from "@atlasacademy/api-connector";

import { BattleTeam } from "../../../../src";
import { BattleAttackActionList } from "../../../../src/Action/BattleAttackAction";
import { specialDefence } from "../../../../src/Func/Implementations/getDamageList";
import { buff, createBattle, servant } from "../../../helpers";

describe("getDamageList specialDefense", () => {
    it("test buff", async () => {
        const battle = createBattle(),
            actor = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY);

        battle.addActor(actor);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(specialDefence(actions.get(1), actor, target).value()).to.equal(1);

        target.addBuff(buff(315, { Value: 500 }, false, false, null));
        expect(specialDefence(actions.get(1), actor, target).value()).to.equal(0.5);
    });
});
