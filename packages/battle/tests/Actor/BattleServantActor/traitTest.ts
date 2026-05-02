import { expect } from "chai";

import { BattleTeam } from "../../../src/index.js";
import { createBattle, servant } from "../../helpers.js";

describe("BattleServantActor traits", () => {
    it("check add trait buff", async () => {
        const actor = servant(156, BattleTeam.PLAYER),
            target = servant(153, BattleTeam.PLAYER),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        expect(target.traits().filter((trait) => trait.id === 304).length === 0);

        await actor.skill(4)?.activate(battle);
        expect(target.traits().filter((trait) => trait.id === 304).length === 1);
    });
});
