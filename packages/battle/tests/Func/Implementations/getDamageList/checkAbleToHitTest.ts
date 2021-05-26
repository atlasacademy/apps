import {Card} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {checkAbleToHit} from "../../../../src/Func/Implementations/getDamageList";
import {artoria, cu, drake, emiya, merlin} from "../../../helpers";

describe('getDamageList checkAbleToHit', () => {
    it('no buffs', async () => {
        const servant = artoria(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(checkAbleToHit(actions.get(1), servant, target)).to.be.true;
    });

    it('evade', async () => {
        const servant = artoria(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(checkAbleToHit(actions.get(1), servant, target)).to.be.true;

        await target.skill(2)?.activate(battle);
        expect(checkAbleToHit(actions.get(1), servant, target)).to.be.false;
    });

    it('sure hit', async () => {
        const servant = cu(BattleTeam.PLAYER),
            target = emiya(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        // no buffs
        expect(checkAbleToHit(actions.get(1), servant, target)).to.be.true;

        // target pops evade
        await target.skill(1)?.activate(battle);
        expect(checkAbleToHit(actions.get(1), servant, target)).to.be.false;

        // servant pops np for the sure hit
        await servant.noblePhantasm().activate(battle);
        expect(checkAbleToHit(actions.get(1), servant, target)).to.be.true;
    });

    it('invincibility', async () => {
        const servant = cu(BattleTeam.PLAYER),
            target = merlin(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        // no buffs
        expect(checkAbleToHit(actions.get(1), servant, target)).to.be.true;

        // target pops invincibility
        await target.skill(2)?.activate(battle);
        expect(checkAbleToHit(actions.get(1), servant, target)).to.be.false;

        // servant pops np for the sure hit
        await servant.noblePhantasm().activate(battle);
        expect(checkAbleToHit(actions.get(1), servant, target)).to.be.false;
    });

    it('pierce invincibility', async () => {
        const servant = drake(BattleTeam.PLAYER),
            cuTarget = cu(BattleTeam.ENEMY),
            merlinTarget = merlin(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(cuTarget);
        battle.addActor(merlinTarget);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        // no buffs
        expect(checkAbleToHit(actions.get(1), servant, cuTarget)).to.be.true;
        expect(checkAbleToHit(actions.get(1), servant, merlinTarget)).to.be.true;

        // servant pops pierce
        await servant.skill(3)?.activate(battle);
        expect(checkAbleToHit(actions.get(1), servant, cuTarget)).to.be.true;
        expect(checkAbleToHit(actions.get(1), servant, merlinTarget)).to.be.true;

        // cu pops evade
        await cuTarget.skill(2)?.activate(battle);
        expect(checkAbleToHit(actions.get(1), servant, cuTarget)).to.be.true;

        // merlin pops invincibility
        await merlinTarget.skill(2)?.activate(battle);
        expect(checkAbleToHit(actions.get(1), servant, merlinTarget)).to.be.true;
    })
});
