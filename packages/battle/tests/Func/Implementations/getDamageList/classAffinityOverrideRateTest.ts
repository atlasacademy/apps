import {Card, ClassName} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {classAffinityOverrideRate} from "../../../../src/Func/Implementations/getDamageList";
import {emiya, hijikata, reines} from "../../../helpers";

describe('getDamageList classAffinityOverrideRate', () => {
    it('no override', () => {
        const servant = hijikata(BattleTeam.PLAYER),
            target = reines(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(classAffinityOverrideRate(1500, actions.get(1), servant, target, true)).to.equal(1500);
        expect(classAffinityOverrideRate(1500, actions.get(1), servant, target, false)).to.equal(1500);
    });

    it('with override', async () => {
        const servant = hijikata(BattleTeam.PLAYER),
            target = reines(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        await target.noblePhantasm().activate(battle);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(classAffinityOverrideRate(1500, actions.get(1), servant, target, true)).to.equal(1500);
        expect(classAffinityOverrideRate(1500, actions.get(1), servant, target, false)).to.equal(1000);
    });

    it('supports overwrite more than target', async () => {
        const servant = emiya(BattleTeam.PLAYER),
            target = reines(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        await target.noblePhantasm().activate(battle);
        target.props.className = ClassName.LANCER;

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(classAffinityOverrideRate(1500, actions.get(1), servant, target, false)).to.equal(1000);
        expect(classAffinityOverrideRate(500, actions.get(1), servant, target, false)).to.equal(500);
    });
});
