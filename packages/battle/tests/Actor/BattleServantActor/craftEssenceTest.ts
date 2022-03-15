import { expect } from "chai";

import { BattleTeam } from "../../../src";
import { craftEssence, createBattle, servant } from "../../helpers";

describe("BattleServantActor craftEssence", () => {
    it("effects are added on init", async () => {
        let battle = createBattle(),
            actor = servant(2, BattleTeam.PLAYER, {
                craftEssence: craftEssence(34),
                craftEssenceLimitBreak: 0,
            });

        battle.addActor(actor);
        await battle.init();

        expect(actor.gaugeLevel()).to.equal(0);
        expect(actor.gaugePercent()).to.equal(0.8);
    });

    it("effects use limit break conditions", async () => {
        let battle = createBattle(),
            actor = servant(2, BattleTeam.PLAYER, {
                craftEssence: craftEssence(34),
                craftEssenceLimitBreak: 4,
            });

        battle.addActor(actor);
        await battle.init();

        expect(actor.gaugeLevel()).to.equal(1);
        expect(actor.gaugePercent()).to.equal(0);
    });

    it("stats are added to servant", async () => {
        let battle = createBattle(),
            artoria = servant(2, BattleTeam.PLAYER, {
                craftEssence: craftEssence(34),
                craftEssenceLevel: 100,
                craftEssenceLimitBreak: 4,
                fouAttack: 1000,
                fouHealth: 1000,
            }),
            gilgamesh = servant(12, BattleTeam.PLAYER, {
                craftEssence: craftEssence(40),
                craftEssenceLevel: undefined,
                craftEssenceLimitBreak: undefined,
                fouAttack: 1000,
                fouHealth: 1000,
            });

        battle.addActor(artoria);
        battle.addActor(gilgamesh);
        await battle.init();

        expect(artoria.baseAttack()).to.equal(14221);
        expect(artoria.props.baseHealth).to.equal(16150);
        expect(gilgamesh.baseAttack()).to.equal(13530);
        expect(gilgamesh.props.baseHealth).to.equal(14472);
    });
});
