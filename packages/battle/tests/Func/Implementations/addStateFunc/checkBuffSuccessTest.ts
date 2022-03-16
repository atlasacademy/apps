import { expect } from "chai";

import { Battle, BattleTeam } from "../../../../src";
import { BattleRandomType } from "../../../../src/BattleRandom";
import { checkBuffSuccess, createBuffFromFunc } from "../../../../src/Func/Implementations/addStateFunc";
import BattleSkillFunc from "../../../../src/Skill/BattleSkillFunc";
import { createBattle, servant } from "../../../helpers";

describe("addStateFunc checkBuffSuccess", () => {
    it("ozy imperial privilege", async () => {
        const actor = servant(118, BattleTeam.PLAYER),
            battle = createBattle(),
            func = <BattleSkillFunc>actor.skill(2)?.func(1),
            buff = createBuffFromFunc(func, 0, false, true);

        battle.addActor(actor);

        battle.random().setType(BattleRandomType.LOW);
        expect(await checkBuffSuccess(battle, func, buff, actor, actor)).to.be.false;
        battle.random().setType(BattleRandomType.AVERAGE);
        expect(await checkBuffSuccess(battle, func, buff, actor, actor)).to.be.true;
        battle.random().setType(BattleRandomType.HIGH);
        expect(await checkBuffSuccess(battle, func, buff, actor, actor)).to.be.true;

        battle.random().setManualType([0.39]);
        expect(await checkBuffSuccess(battle, func, buff, actor, actor)).to.be.false;
        battle.random().setManualType([0.4]);
        expect(await checkBuffSuccess(battle, func, buff, actor, actor)).to.be.true;
        battle.random().setManualType([0.41]);
        expect(await checkBuffSuccess(battle, func, buff, actor, actor)).to.be.true;
    });

    it("oxy imperial privilege after buff chance", async () => {
        const actor = servant(118, BattleTeam.PLAYER),
            battle = createBattle(),
            func = <BattleSkillFunc>actor.skill(2)?.func(1),
            buff = createBuffFromFunc(func, 0, false, true);

        battle.addActor(actor);
        await actor.skill(3)?.activate(battle);

        battle.random().setType(BattleRandomType.LOW);
        expect(await checkBuffSuccess(battle, func, buff, actor, actor)).to.be.true;
        battle.random().setType(BattleRandomType.AVERAGE);
        expect(await checkBuffSuccess(battle, func, buff, actor, actor)).to.be.true;
        battle.random().setType(BattleRandomType.HIGH);
        expect(await checkBuffSuccess(battle, func, buff, actor, actor)).to.be.true;
    });

    it("robin poison interacts with buff resist", async () => {
        const actor = servant(13, BattleTeam.PLAYER),
            target = servant(2, BattleTeam.ENEMY),
            battle = createBattle(),
            func = <BattleSkillFunc>actor.skill(1)?.func(2),
            buff = createBuffFromFunc(func, 0, false, true);

        battle.addActor(actor);
        battle.addActor(target);
        await battle.init();

        battle.random().setType(BattleRandomType.LOW);
        expect(await checkBuffSuccess(battle, func, buff, actor, target)).to.be.false;
        battle.random().setType(BattleRandomType.AVERAGE);
        expect(await checkBuffSuccess(battle, func, buff, actor, target)).to.be.true;
        battle.random().setType(BattleRandomType.HIGH);
        expect(await checkBuffSuccess(battle, func, buff, actor, target)).to.be.true;

        battle.random().setManualType([0.123]);
        expect(await checkBuffSuccess(battle, func, buff, actor, actor)).to.be.false;
        battle.random().setManualType([0.124]);
        expect(await checkBuffSuccess(battle, func, buff, actor, actor)).to.be.true;
        battle.random().setManualType([0.125]);
        expect(await checkBuffSuccess(battle, func, buff, actor, actor)).to.be.true;
    });

    it("debuff resist should not affect buffs", async () => {
        const actor = servant(2, BattleTeam.PLAYER),
            battle = createBattle(),
            func = <BattleSkillFunc>actor.skill(1)?.func(1),
            buff = createBuffFromFunc(func, 0, false, true);

        battle.addActor(actor);
        await battle.init();

        battle.random().setType(BattleRandomType.LOW);
        expect(await checkBuffSuccess(battle, func, buff, actor, actor)).to.be.true;
        battle.random().setType(BattleRandomType.AVERAGE);
        expect(await checkBuffSuccess(battle, func, buff, actor, actor)).to.be.true;
        battle.random().setType(BattleRandomType.HIGH);
        expect(await checkBuffSuccess(battle, func, buff, actor, actor)).to.be.true;
    });
});
