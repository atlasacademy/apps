import {Buff, Card} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import {Battle} from "../../../../src/Battle";
import {BattleBuff} from "../../../../src/Buff/BattleBuff";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {attackMagnification} from "../../../../src/Func/Implementations/getDamageList";
import {artoria, cu} from "../../../helpers";

import pierceDefenceData from "../../../samples/buff/pierceDefence.json";

describe('getDamageList attackMagnification', () => {
    it('attack and defense up', async () => {
        const servant = artoria(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        // no buffs
        expect(attackMagnification(actions.get(1), servant, target, undefined).value()).to.equal(1);

        // charisma
        await servant.skill(1)?.activate(battle);
        expect(attackMagnification(actions.get(1), servant, target, undefined).value()).to.be.closeTo(1.18, 0.0001);

        // charisma + defense up
        await target.skill(2)?.activate(battle);
        expect(attackMagnification(actions.get(1), servant, target, undefined).value()).to.be.closeTo(1.02, 0.0001);

        // charisma + defense up + defense pierce
        servant.addBuff(new BattleBuff({
            buff: <Buff.Buff><unknown>pierceDefenceData,
            dataVal: {},
            passive: false,
            short: true,
        }, null));
        expect(attackMagnification(actions.get(1), servant, target, undefined).value()).to.be.closeTo(1.18, 0.0001);
    });
});
