import {Buff, Card, ClassName, Servant} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackAction, BattleAttackActionList} from "../../../src/Action/BattleAttackAction";
import BattleServantActor from "../../../src/Actor/BattleServantActor";
import {Battle} from "../../../src/Battle";
import {BattleBuff} from "../../../src/Buff/BattleBuff";
import {BattleTeam} from "../../../src/Enum/BattleTeam";

import artoriaData from "../../samples/servant/artoria.json";
import cuData from "../../samples/servant/cu.json";
import overrideClassData from "../../samples/buff/overrideBattleClass.json";

describe('BattleServantActor className', () => {
    it('normal', () => {
        let battle = new Battle(null),
            servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>artoriaData,
                team: BattleTeam.PLAYER,
            }, null),
            target = new BattleServantActor({
                id: 2,
                phase: 1,
                servant: <Servant.Servant>cuData,
                team: BattleTeam.ENEMY,
            }, null),
            actions: BattleAttackActionList;

        battle.addActor(servant);
        battle.addActor(target);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(servant.baseClassName()).to.equal(ClassName.SABER);
        expect(servant.className(<BattleAttackAction>actions.get(1), target)).to.equal(ClassName.SABER);
    });

    it('override', () => {
        let battle = new Battle(null),
            servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>artoriaData,
                team: BattleTeam.PLAYER,
            }, null),
            target = new BattleServantActor({
                id: 2,
                phase: 1,
                servant: <Servant.Servant>cuData,
                team: BattleTeam.ENEMY,
            }, null),
            actions: BattleAttackActionList,
            buff = new BattleBuff({
                buff: <Buff.Buff><unknown>overrideClassData,
                dataVal: { Value: 5},
                short: false,
            }, null);

        battle.addActor(servant);
        battle.addActor(target);
        servant.addBuff(buff);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(servant.baseClassName()).to.equal(ClassName.SABER);
        expect(servant.className(<BattleAttackAction>actions.get(1), target)).to.equal(ClassName.CASTER);
    });
});
