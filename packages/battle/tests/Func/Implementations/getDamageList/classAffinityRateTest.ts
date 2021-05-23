import {Card, ClassName} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {classAffinityRate} from "../../../../src/Func/Implementations/getDamageList";
import {artoria, cu, hijikata, reines} from "../../../helpers";

describe('getDamageList classAffinityRate', () => {
    it('defined', () => {
        const servant = artoria(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(classAffinityRate(actions.get(1), servant, target).value()).to.equal(2);
        expect(classAffinityRate(actions.get(1), target, servant).value()).to.equal(0.5);
    });

    it('not defined', () => {
        const servant = artoria(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);
        target.props.className = ClassName.UNKNOWN;

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(classAffinityRate(actions.get(1), servant, target).value()).to.equal(1);
        expect(classAffinityRate(actions.get(1), target, servant).value()).to.equal(1);
    });

    it('handles overrides', async () => {
        const servant = hijikata(BattleTeam.PLAYER),
            target = reines(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        // without NP
        expect(classAffinityRate(actions.get(1), servant, target).value()).to.equal(1.5);

        // with NP
        await target.noblePhantasm().activate(battle);
        expect(classAffinityRate(actions.get(1), servant, target).value()).to.equal(1);
    });
});
