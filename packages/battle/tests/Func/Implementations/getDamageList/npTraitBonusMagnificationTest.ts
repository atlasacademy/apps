import { expect } from "chai";

import { BattleTeam } from "../../../../src";
import { npTraitBonusMagnification } from "../../../../src/Func/Implementations/getDamageList";
import { createBattle, servant } from "../../../helpers";

describe("getDamageList npTraitBonusMagnification", () => {
    it("check np with no bonus", async () => {
        const actor = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        expect(npTraitBonusMagnification(actor.noblePhantasm().func(1), actor, target).value()).to.equal(1);
    });

    it("check np with trait bonus", async () => {
        const actor = servant(12, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        expect(npTraitBonusMagnification(actor.noblePhantasm().func(2), actor, target).value()).to.equal(1.5);

        actor.noblePhantasm().setOvercharge(2);
        expect(npTraitBonusMagnification(actor.noblePhantasm().func(2), actor, target).value()).to.equal(1.625);

        actor.noblePhantasm().setOvercharge(3);
        expect(npTraitBonusMagnification(actor.noblePhantasm().func(2), actor, target).value()).to.equal(1.75);

        actor.noblePhantasm().setOvercharge(4);
        expect(npTraitBonusMagnification(actor.noblePhantasm().func(2), actor, target).value()).to.equal(1.875);

        actor.noblePhantasm().setOvercharge(5);
        expect(npTraitBonusMagnification(actor.noblePhantasm().func(2), actor, target).value()).to.equal(2);
    });

    it("check np with buff bonus", async () => {
        const actor = servant(13, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        // no poison
        // expect(npTraitBonusMagnification(servant.noblePhantasm().func(1), servant, target).value()).to.equal(1);

        // with poison
        await actor.skill(1)?.activate(battle);
        expect(npTraitBonusMagnification(actor.noblePhantasm().func(1), actor, target).value()).to.equal(2);

        actor.noblePhantasm().setOvercharge(2);
        expect(npTraitBonusMagnification(actor.noblePhantasm().func(1), actor, target).value()).to.equal(2.125);

        actor.noblePhantasm().setOvercharge(3);
        expect(npTraitBonusMagnification(actor.noblePhantasm().func(1), actor, target).value()).to.equal(2.25);

        actor.noblePhantasm().setOvercharge(4);
        expect(npTraitBonusMagnification(actor.noblePhantasm().func(1), actor, target).value()).to.equal(2.375);

        actor.noblePhantasm().setOvercharge(5);
        expect(npTraitBonusMagnification(actor.noblePhantasm().func(1), actor, target).value()).to.equal(2.5);
    });
});
