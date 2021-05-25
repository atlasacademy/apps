import { expect } from "chai";
import { Battle } from "../../../src/Battle";
import { BattleTeam } from "../../../src/Enum/BattleTeam";
import { musashi, moriarty } from "../../helpers";

describe("BattleServantActor traits", () => {
    it("check add trait buff", async () => {
        const servant = moriarty(BattleTeam.PLAYER),
            target = musashi(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        expect(
            target.traits().filter((trait) => trait.id === 304).length === 0
        );

        await servant.skill(4)?.activate(battle);
        expect(
            target.traits().filter((trait) => trait.id === 304).length === 1
        );
    });
});
