import {Servant} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import BattleServantActor from "../../../../src/Actor/BattleServantActor";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {npDamageBonus} from "../../../../src/Func/Implementations/getDamageList";
import {Variable} from "../../../../src/Game/Variable";
import BattleNoblePhantasmFunc from "../../../../src/NoblePhantasm/BattleNoblePhantasmFunc";

import artoriaData from "../../../samples/servant/artoria.json";
import hijikataData from "../../../samples/servant/hijikata.json";

describe('getDamageList npDamageBonus', () => {
    it('no bonus', () => {
        const servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>artoriaData,
                team: BattleTeam.PLAYER,
            }, null),
            func = servant.noblePhantasm().func(1);

        expect(func).to.instanceof(BattleNoblePhantasmFunc);

        const bonus = npDamageBonus(servant, <BattleNoblePhantasmFunc>func);
        expect(bonus.value()).to.equal(0);
    });

    it('low hp bonus - hijikata overcharge 1', () => {
        let servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>hijikataData,
                team: BattleTeam.PLAYER,
            }, null),
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
        let servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>hijikataData,
                team: BattleTeam.PLAYER,
            }, null),
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
        let servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>hijikataData,
                team: BattleTeam.PLAYER,
            }, null),
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
