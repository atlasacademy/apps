import { expect } from "chai";

import { BattleTeam } from "../../../../src";
import { npDamageBonus } from "../../../../src/Func/Implementations/getDamageList";
import { Variable } from "../../../../src/Game/Variable";
import BattleNoblePhantasmFunc from "../../../../src/NoblePhantasm/BattleNoblePhantasmFunc";
import { servant } from "../../../helpers";

describe("getDamageList npDamageBonus", () => {
    it("no bonus", () => {
        const actor = servant(2, BattleTeam.PLAYER),
            func = actor.noblePhantasm().func(1);

        expect(func).to.instanceof(BattleNoblePhantasmFunc);

        const bonus = npDamageBonus(actor, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(0);
    });

    it("low hp bonus - hijikata overcharge 1", () => {
        let actor = servant(161, BattleTeam.PLAYER),
            func = actor.noblePhantasm().func(1),
            bonus: Variable;

        expect(func).to.instanceof(BattleNoblePhantasmFunc);

        // Full HP
        bonus = npDamageBonus(actor, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(0);

        // Half HP
        actor.state.health = Math.floor(actor.state.maxHealth / 2);
        bonus = npDamageBonus(actor, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(4000);

        // Quarter HP
        actor.state.health = Math.floor(actor.state.maxHealth / 4);
        bonus = npDamageBonus(actor, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(6000);

        // 1 HP
        actor.state.health = 1;
        bonus = npDamageBonus(actor, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.be.greaterThan(7999);
    });

    it("low hp bonus - hijikata overcharge 2", () => {
        let actor = servant(161, BattleTeam.PLAYER),
            func = actor.noblePhantasm().func(1),
            bonus: Variable;

        actor.noblePhantasm().setOvercharge(2);
        expect(func).to.instanceof(BattleNoblePhantasmFunc);

        // Full HP
        bonus = npDamageBonus(actor, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(0);

        // Half HP
        actor.state.health = Math.floor(actor.state.maxHealth / 2);
        bonus = npDamageBonus(actor, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(4500);

        // Quarter HP
        actor.state.health = Math.floor(actor.state.maxHealth / 4);
        bonus = npDamageBonus(actor, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(6750);

        // 1 HP
        actor.state.health = 1;
        bonus = npDamageBonus(actor, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.be.greaterThan(8999);
    });

    it("low hp bonus - hijikata overcharge 5", () => {
        let actor = servant(161, BattleTeam.PLAYER),
            func = actor.noblePhantasm().func(1),
            bonus: Variable;

        actor.noblePhantasm().setOvercharge(5);
        expect(func).to.instanceof(BattleNoblePhantasmFunc);

        // Full HP
        bonus = npDamageBonus(actor, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(0);

        // Half HP
        actor.state.health = Math.floor(actor.state.maxHealth / 2);
        bonus = npDamageBonus(actor, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(6000);

        // Quarter HP
        actor.state.health = Math.floor(actor.state.maxHealth / 4);
        bonus = npDamageBonus(actor, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(9000);

        // 1 HP
        actor.state.health = 1;
        bonus = npDamageBonus(actor, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.be.greaterThan(11999);
    });
});
