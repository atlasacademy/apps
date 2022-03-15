import { expect } from "chai";

import { Card } from "@atlasacademy/api-connector";

import { BattleTeam } from "../../../../src";
import { BattleAttackActionList } from "../../../../src/Action/BattleAttackAction";
import { checkAbleToHit } from "../../../../src/Func/Implementations/getDamageList";
import { createBattle, servant } from "../../../helpers";

describe("getDamageList checkAbleToHit", () => {
    it("no buffs", async () => {
        const actor = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(checkAbleToHit(actions.get(1), actor, target)).to.be.true;
    });

    it("evade", async () => {
        const actor = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(checkAbleToHit(actions.get(1), actor, target)).to.be.true;

        await target.skill(2)?.activate(battle);
        expect(checkAbleToHit(actions.get(1), actor, target)).to.be.false;
    });

    it("sure hit", async () => {
        const actor = servant(17, BattleTeam.PLAYER),
            target = servant(11, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        // no buffs
        expect(checkAbleToHit(actions.get(1), actor, target)).to.be.true;

        // target pops evade
        await target.skill(1)?.activate(battle);
        expect(checkAbleToHit(actions.get(1), actor, target)).to.be.false;

        // servant pops np for the sure hit
        await actor.noblePhantasm().activate(battle);
        expect(checkAbleToHit(actions.get(1), actor, target)).to.be.true;
    });

    it("invincibility", async () => {
        const actor = servant(17, BattleTeam.PLAYER),
            target = servant(150, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        // no buffs
        expect(checkAbleToHit(actions.get(1), actor, target)).to.be.true;

        // target pops invincibility
        await target.skill(2)?.activate(battle);
        expect(checkAbleToHit(actions.get(1), actor, target)).to.be.false;

        // servant pops np for the sure hit
        await actor.noblePhantasm().activate(battle);
        expect(checkAbleToHit(actions.get(1), actor, target)).to.be.false;
    });

    it("pierce invincibility", async () => {
        const actor = servant(65, BattleTeam.PLAYER),
            cuTarget = servant(17, BattleTeam.ENEMY),
            merlinTarget = servant(150, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(cuTarget);
        battle.addActor(merlinTarget);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        // no buffs
        expect(checkAbleToHit(actions.get(1), actor, cuTarget)).to.be.true;
        expect(checkAbleToHit(actions.get(1), actor, merlinTarget)).to.be.true;

        // servant pops pierce
        await actor.skill(3)?.activate(battle);
        expect(checkAbleToHit(actions.get(1), actor, cuTarget)).to.be.true;
        expect(checkAbleToHit(actions.get(1), actor, merlinTarget)).to.be.true;

        // cu pops evade
        await cuTarget.skill(2)?.activate(battle);
        expect(checkAbleToHit(actions.get(1), actor, cuTarget)).to.be.true;

        // merlin pops invincibility
        await merlinTarget.skill(2)?.activate(battle);
        expect(checkAbleToHit(actions.get(1), actor, merlinTarget)).to.be.true;
    });
});
