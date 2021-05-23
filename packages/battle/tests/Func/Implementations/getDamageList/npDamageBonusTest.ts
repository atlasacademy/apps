import {expect} from 'chai';
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {npDamageBonus} from "../../../../src/Func/Implementations/getDamageList";
import {Variable} from "../../../../src/Game/Variable";
import BattleNoblePhantasmFunc from "../../../../src/NoblePhantasm/BattleNoblePhantasmFunc";
import {artoria, hijikata} from "../../../helpers";

describe('getDamageList npDamageBonus', () => {
    it('no bonus', () => {
        const servant = artoria(BattleTeam.PLAYER),
            func = servant.noblePhantasm().func(1);

        expect(func).to.instanceof(BattleNoblePhantasmFunc);

        const bonus = npDamageBonus(servant, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(0);
    });

    it('low hp bonus - hijikata overcharge 1', () => {
        let servant = hijikata(BattleTeam.PLAYER),
            func = servant.noblePhantasm().func(1),
            bonus: Variable;

        expect(func).to.instanceof(BattleNoblePhantasmFunc);

        // Full HP
        bonus = npDamageBonus(servant, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(0);

        // Half HP
        servant.state.health = Math.floor(servant.state.maxHealth / 2);
        bonus = npDamageBonus(servant, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(4000);

        // Quarter HP
        servant.state.health = Math.floor(servant.state.maxHealth / 4);
        bonus = npDamageBonus(servant, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(6000);

        // 1 HP
        servant.state.health = 1;
        bonus = npDamageBonus(servant, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.be.greaterThan(7999);
    });

    it('low hp bonus - hijikata overcharge 2', () => {
        let servant = hijikata(BattleTeam.PLAYER),
            func = servant.noblePhantasm().func(1),
            bonus: Variable;

        servant.noblePhantasm().setOvercharge(2);
        expect(func).to.instanceof(BattleNoblePhantasmFunc);

        // Full HP
        bonus = npDamageBonus(servant, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(0);

        // Half HP
        servant.state.health = Math.floor(servant.state.maxHealth / 2);
        bonus = npDamageBonus(servant, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(4500);

        // Quarter HP
        servant.state.health = Math.floor(servant.state.maxHealth / 4);
        bonus = npDamageBonus(servant, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(6750);

        // 1 HP
        servant.state.health = 1;
        bonus = npDamageBonus(servant, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.be.greaterThan(8999);
    });

    it('low hp bonus - hijikata overcharge 5', () => {
        let servant = hijikata(BattleTeam.PLAYER),
            func = servant.noblePhantasm().func(1),
            bonus: Variable;

        servant.noblePhantasm().setOvercharge(5);
        expect(func).to.instanceof(BattleNoblePhantasmFunc);

        // Full HP
        bonus = npDamageBonus(servant, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(0);

        // Half HP
        servant.state.health = Math.floor(servant.state.maxHealth / 2);
        bonus = npDamageBonus(servant, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(6000);

        // Quarter HP
        servant.state.health = Math.floor(servant.state.maxHealth / 4);
        bonus = npDamageBonus(servant, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(9000);

        // 1 HP
        servant.state.health = 1;
        bonus = npDamageBonus(servant, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.be.greaterThan(11999);
    });
});
