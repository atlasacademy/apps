import {Card} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {powerMagnification} from "../../../../src/Func/Implementations/getDamageList";
import {cu, orion} from "../../../helpers";

describe('getDamageList powerMagnification', () => {
    it('special damage up', async () => {
        const battle = new Battle(null),
            servant = orion(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(powerMagnification(actions.get(1), servant, target).value()).to.equal(0);

        await servant.skill(2)?.activate(battle);
        expect(powerMagnification(actions.get(1), servant, target).value()).to.equal(1);
    });
});
