import {Card, ClassName} from "@atlasacademy/api-connector";
import {Servant} from "@atlasacademy/api-connector/dist/Schema/Servant";
import {expect} from 'chai';
import BattleAttackAction from "../../src/Action/BattleAttackAction";
import BattleServantActor from "../../src/Actor/BattleServantActor";
import {Battle} from "../../src/Battle";
import {BattleTeam} from "../../src/Enum/BattleTeam";
import GameBuffConstantMap from "../../src/Game/GameBuffConstantMap";
import GameConstantManager from "../../src/Game/GameConstantManager";
import buffConstants from "../samples/game/buffs.json";
import artoria from "../samples/servant/artoria.json";
import cu from "../samples/servant/cu.json";

before(() => {
    GameConstantManager.initManually(<GameBuffConstantMap>buffConstants);
});

after(() => {
    GameConstantManager.reset();
});

describe('BattleServantActor', () => {
    it('infers default servant settings', () => {
        const servant = new BattleServantActor({
            id: 1,
            phase: 1,
            servant: <Servant>artoria,
            team: BattleTeam.PLAYER,
        }, null);

        expect(servant.props.className).to.equal(ClassName.SABER);
        expect(servant.props.level).to.equal(90);
        expect(servant.props.baseAttack).to.equal(12221);
        expect(servant.props.baseHealth).to.equal(16150);
        expect(servant.hasTrait(1)).to.equal(false);
        expect(servant.hasTrait(2)).to.equal(true);
        expect(servant.hasTrait(2009)).to.equal(true);
        expect(servant.attack()).to.equal(12221);
        expect(servant.health()).to.equal(16150);

        expect(servant.skill(1)?.props.skill.id).to.equal(5450);
        expect(servant.skill(2)?.props.skill.id).to.equal(756450);
        expect(servant.skill(3)?.props.skill.id).to.equal(501650);

        const battle = new Battle(null);
        battle.addActor(servant);

        servant.skill(1)?.activate(battle);
        expect(servant.attack()).to.equal(14421);
    });

    it('autoAttack', () => {
        const battle = new Battle(null),
            servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant>artoria,
                team: BattleTeam.PLAYER,
            }, null),
            target = new BattleServantActor({
                id: 2,
                phase: 1,
                servant: <Servant>cu,
                team: BattleTeam.ENEMY,
            }, null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackAction();
        actions.add(servant, Card.BUSTER);
        actions.add(servant, Card.QUICK);
        actions.add(servant, Card.ARTS);

        servant.autoAttack(battle, target, actions, 1);
        // servant.autoAttack(battle, target, actions, 2);
        // servant.autoAttack(battle, target, actions, 3);
        // servant.autoAttack(battle, target, actions, 4);

    });
});
