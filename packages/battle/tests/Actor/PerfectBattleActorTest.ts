import { expect } from "chai";

import { BattleActorLogic } from "../../dist/Actor/BattleActor";
import { BattleTeam } from "../../src";
import { createBattle, servant } from "../helpers";

describe("PerfectBattleActor", () => {
    it("func target trait", async () => {
        const setup = async (logic: BattleActorLogic) => {
            const actor = servant(15, BattleTeam.PLAYER), // euryale,
                target = servant(2, BattleTeam.ENEMY, { logic }), // artoria
                battle = createBattle();

            battle.addActor(actor);
            battle.addActor(target);

            await actor.skill(2)?.activate(battle);

            return target;
        };

        expect((await setup(BattleActorLogic.NORMAL)).buffs().hasTrait(3012, true)).to.be.false;

        expect((await setup(BattleActorLogic.PERFECT)).buffs().hasTrait(3012, true)).to.be.true;
    });
});
