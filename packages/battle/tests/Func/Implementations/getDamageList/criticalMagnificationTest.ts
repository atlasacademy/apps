import {Card} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {criticalMagnification} from "../../../../src/Func/Implementations/getDamageList";
import {cu, merlin} from "../../../helpers";

describe('getDamageList criticalMagnification', () => {
    it('check crit buff', async () => {
        const servant = merlin(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(criticalMagnification(actions.get(1), servant, target).value()).to.equal(0);

        await servant.skill(3)?.activate(battle);
        expect(criticalMagnification(actions.get(1), servant, target).value()).to.equal(1);
    });
});
