import {expect} from "chai";
import {Battle} from "../../../src/Battle";
import {BattleTeam} from "../../../src/Enum/BattleTeam";
import {servant} from "../../helpers";

describe("BattleServantActor traits", () => {
    it("check add trait buff", async () => {
        const actor = servant(156, BattleTeam.PLAYER),
            target = servant(153, BattleTeam.PLAYER),
            battle = new Battle(null);

        battle.addActor(actor);
        battle.addActor(target);

        expect(
            target.traits().filter((trait) => trait.id === 304).length === 0
        );

        await actor.skill(4)?.activate(battle);
        expect(
            target.traits().filter((trait) => trait.id === 304).length === 1
        );
    });
});
