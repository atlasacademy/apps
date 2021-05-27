import {Card} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {attackMagnification} from "../../../../src/Func/Implementations/getDamageList";
import {buff, servant} from "../../../helpers";

describe('getDamageList attackMagnification', () => {
    it('attack and defense up', async () => {
        const actor = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(actor);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        // no buffs
        expect(attackMagnification(actions.get(1), actor, target, undefined).value()).to.equal(1);

        // charisma
        await actor.skill(1)?.activate(battle);
        expect(attackMagnification(actions.get(1), actor, target, undefined).value()).to.be.closeTo(1.18, 0.0001);

        // charisma + defense up
        await target.skill(2)?.activate(battle);
        expect(attackMagnification(actions.get(1), actor, target, undefined).value()).to.be.closeTo(1.02, 0.0001);

        // charisma + defense up + defense pierce
        actor.addBuff(buff(
            510,
            {},
            false,
            true,
            null
        ));
        expect(attackMagnification(actions.get(1), actor, target, undefined).value()).to.be.closeTo(1.18, 0.0001);
    });
});
