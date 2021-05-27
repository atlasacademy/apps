import {Card} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {criticalMagnification} from "../../../../src/Func/Implementations/getDamageList";
import {servant} from "../../../helpers";

describe('getDamageList criticalMagnification', () => {
    it('check crit buff', async () => {
        const actor = servant(150, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(actor);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(criticalMagnification(actions.get(1), actor, target).value()).to.equal(0);

        await actor.skill(3)?.activate(battle);
        expect(criticalMagnification(actions.get(1), actor, target).value()).to.equal(1);
    });
});
