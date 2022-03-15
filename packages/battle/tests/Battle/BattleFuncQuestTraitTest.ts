import { expect } from "chai";

import { BattleTeam } from "../../src";
import { createBattle, servant } from "../helpers";

describe("BattleFuncQuestTraitTest", () => {
    it("event bonus will not trigger if battle does not have trait", async () => {
        const actor = servant(1, BattleTeam.PLAYER), // mash
            battle = createBattle();

        battle.addActor(actor);
        await battle.init();

        expect(
            actor
                .buffs()
                .all(false)
                .filter((buff) => buff.props.buff.id === 2846)
        ).to.be.of.length(0);
    });

    it("event bonus will trigger if battle has trait", async () => {
        const actor = servant(1, BattleTeam.PLAYER), // mash
            battle = createBattle({
                traits: [{ id: 94000104, name: "Event" }],
            });

        battle.addActor(actor);
        await battle.init();

        expect(
            actor
                .buffs()
                .all(false)
                .filter((buff) => buff.props.buff.id === 2846)
        ).to.be.of.length(1);
    });
});
