import {Card} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackAction} from "../../../../src/Action/BattleAttackAction";
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {npMagnification} from "../../../../src/Func/Implementations/getDamageList";
import {cu, drake} from "../../../helpers";

describe('getDamageList npMagnification', () => {
    it('check np buff', async () => {
        const servant = drake(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        const attack = new BattleAttackAction(servant, Card.BUSTER, false, Card.BUSTER, false, true, 1);

        expect(npMagnification(attack, servant, target).value()).to.equal(0);

        await servant.skill(1)?.activate(battle);
        expect(npMagnification(attack, servant, target).value()).to.be.closeTo(0.17, 0.0001);
    });
});
