import {Card} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {powerMagnification} from "../../../../src/Func/Implementations/getDamageList";
import {servant} from "../../../helpers";

describe('getDamageList powerMagnification', () => {
    it('special damage up', async () => {
        const battle = new Battle(null),
            actor = servant(60, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY);

        battle.addActor(actor);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(powerMagnification(actions.get(1), actor, target).value()).to.equal(0);

        await actor.skill(2)?.activate(battle);
        expect(powerMagnification(actions.get(1), actor, target).value()).to.equal(1);
    });
});
