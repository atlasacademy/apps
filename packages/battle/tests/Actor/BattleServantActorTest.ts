import {Card, ClassName} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../src/Action/BattleAttackAction";
import BattleServantActor from "../../src/Actor/BattleServantActor";
import {Battle} from "../../src/Battle";
import {BattleTeam} from "../../src/Enum/BattleTeam";
import {artoria, cu} from "../helpers";

describe('BattleServantActor', () => {
    it('defaults', () => {
        const servant = artoria(BattleTeam.PLAYER),
            battle = new Battle(null);

        battle.addActor(servant);

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

        servant.skill(1)?.activate(battle);
        expect(servant.attack()).to.equal(14421);
    });

    it('autoAttack', () => {
        const battle = new Battle(null),
            servant = artoria(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        // servant.autoAttack(<BattleAttackAction>actions.get(1), battle, target);
        // servant.autoAttack(<BattleAttackAction>actions.get(2), battle, target);
        // servant.autoAttack(<BattleAttackAction>actions.get(3), battle, target);
        // servant.autoAttack(<BattleAttackAction>actions.get(4), battle, target);
        // servant.autoAttack(battle, target, actions, 2);
        // servant.autoAttack(battle, target, actions, 3);
        // servant.autoAttack(battle, target, actions, 4);

    });
});
