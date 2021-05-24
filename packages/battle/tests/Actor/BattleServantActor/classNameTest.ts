import {Buff, Card, ClassName} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../../src/Action/BattleAttackAction";
import {Battle} from "../../../src/Battle";
import {BattleBuff} from "../../../src/Buff/BattleBuff";
import {BattleTeam} from "../../../src/Enum/BattleTeam";
import {artoria, cu} from "../../helpers";
import overrideClassData from "../../samples/buff/overrideBattleClass.json";

describe('BattleServantActor className', () => {
    it('normal', () => {
        let battle = new Battle(null),
            servant = artoria(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            actions: BattleAttackActionList;

        battle.addActor(servant);
        battle.addActor(target);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(servant.baseClassName()).to.equal(ClassName.SABER);
        expect(servant.className(actions.get(1), target)).to.equal(ClassName.SABER);
    });

    it('override', () => {
        let battle = new Battle(null),
            servant = artoria(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            actions: BattleAttackActionList,
            buff = new BattleBuff({
                buff: <Buff.Buff><unknown>overrideClassData,
                dataVal: {Value: 5},
                passive: false,
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
        expect(servant.className(actions.get(1), target)).to.equal(ClassName.CASTER);
    });
});
