import {Card, ClassName} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../src/Action/BattleAttackAction";
import BattleServantActor from "../../src/Actor/BattleServantActor";
import {Battle} from "../../src/Battle";
import {BattleTeam} from "../../src/Enum/BattleTeam";
import {servant} from "../helpers";

describe('BattleServantActor', () => {
    it('defaults', async () => {
        const actor = servant(2, BattleTeam.PLAYER), // artoria
            battle = new Battle(null);

        battle.addActor(actor);

        expect(actor.props.className).to.equal(ClassName.SABER);
        expect(actor.props.level).to.equal(90);
        expect(actor.props.baseAttack).to.equal(12221);
        expect(actor.props.baseHealth).to.equal(16150);
        expect(actor.hasTrait(1)).to.equal(false);
        expect(actor.hasTrait(2)).to.equal(true);
        expect(actor.hasTrait(2009)).to.equal(true);
        expect(actor.attack()).to.equal(12221);
        expect(actor.health()).to.equal(16150);

        expect(actor.skill(1)?.props.skill.id).to.equal(5450);
        expect(actor.skill(2)?.props.skill.id).to.equal(756450);
        expect(actor.skill(3)?.props.skill.id).to.equal(501650);

        await actor.skill(1)?.activate(battle);
        expect(actor.attack()).to.equal(14421);
    });

    it('mash default', () => {
        const actor = servant(1, BattleTeam.PLAYER), // mash
            battle = new Battle(null);

        battle.addActor(actor);

        expect(actor.baseAttack()).to.equal(8587);
    });

    it('autoAttack', () => {
        const battle = new Battle(null),
            actor = servant(2, BattleTeam.PLAYER), // artoria
            target = servant(17, BattleTeam.ENEMY); // cu

        battle.addActor(actor);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        // actor.autoAttack(<BattleAttackAction>actions.get(1), battle, target);
        // actor.autoAttack(<BattleAttackAction>actions.get(2), battle, target);
        // actor.autoAttack(<BattleAttackAction>actions.get(3), battle, target);
        // actor.autoAttack(<BattleAttackAction>actions.get(4), battle, target);
        // actor.autoAttack(battle, target, actions, 2);
        // actor.autoAttack(battle, target, actions, 3);
        // actor.autoAttack(battle, target, actions, 4);

    });
});
