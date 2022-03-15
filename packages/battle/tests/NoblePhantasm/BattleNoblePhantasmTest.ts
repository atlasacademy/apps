import { expect } from "chai";

import { Func } from "../../../api-connector";
import { BattleTeam } from "../../src/Enum/BattleTeam";
import BattleDamageEvent from "../../src/Event/BattleDamageEvent";
import { createBattle, servant } from "../helpers";

describe("BattleNoblePhantasmTest", () => {
    it("hits", () => {
        const actor = servant(11, BattleTeam.PLAYER),
            noblePhantasm = actor.noblePhantasm();

        expect(noblePhantasm.hits()).to.eql([3, 3, 5, 7, 8, 10, 12, 14, 16, 22]);
    });

    it("deals damage", async () => {
        const actor = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        const np = actor.noblePhantasm(),
            func = np.func(1);

        expect(func).to.not.be.undefined;
        expect(func.props.func.funcType).to.equal(Func.FuncType.DAMAGE_NP);

        const events = await func.execute(battle);
        expect(events.length).to.equal(1);

        const event = events[0];
        expect(event).to.be.instanceof(BattleDamageEvent);
        expect(event.reference.damage).to.equal(40475);
    });
});
