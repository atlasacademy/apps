import { expect } from "chai";

import { BattleRandomType } from "../../../../src/BattleRandom";
import { randomAttack } from "../../../../src/Func/Implementations/getDamageList";
import { createBattle } from "../../../helpers";

describe("getDamageList randomAttack", () => {
    it("test range", async () => {
        const battle = createBattle();

        battle.random().setType(BattleRandomType.LOW);
        expect((await randomAttack(battle)).value()).to.be.closeTo(0.9, 0.0001);

        battle.random().setType(BattleRandomType.AVERAGE);
        expect((await randomAttack(battle)).value()).to.equal(1);

        battle.random().setType(BattleRandomType.HIGH);
        expect((await randomAttack(battle)).value()).to.be.closeTo(1.099, 0.0001);
    });
});
