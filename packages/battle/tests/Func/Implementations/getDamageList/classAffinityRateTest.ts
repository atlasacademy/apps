import {Card, ClassName, Servant} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackAction, BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import BattleServantActor from "../../../../src/Actor/BattleServantActor";
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {classAffinityRate} from "../../../../src/Func/Implementations/getDamageList";

import artoriaData from "../../../samples/servant/artoria.json";
import cuData from "../../../samples/servant/cu.json";

describe('getDamageList classAffinityRate', () => {
    it('defined', () => {
        const servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>artoriaData,
                team: BattleTeam.PLAYER,
            }, null),
            target = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>cuData,
                team: BattleTeam.ENEMY,
            }, null),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(classAffinityRate(<BattleAttackAction>actions.get(1), servant, target).value()).to.equal(2);
        expect(classAffinityRate(<BattleAttackAction>actions.get(1), target, servant).value()).to.equal(0.5);
    });

    it('not defined', () => {
        const servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>artoriaData,
                team: BattleTeam.PLAYER,
            }, null),
            target = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>cuData,
                team: BattleTeam.ENEMY,
            }, null),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);
        target.props.className = ClassName.UNKNOWN;

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(classAffinityRate(<BattleAttackAction>actions.get(1), servant, target).value()).to.equal(1);
        expect(classAffinityRate(<BattleAttackAction>actions.get(1), target, servant).value()).to.equal(1);
    });
});
