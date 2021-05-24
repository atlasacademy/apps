import {Buff, Card} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import {Battle} from "../../../../src/Battle";
import {BattleBuff} from "../../../../src/Buff/BattleBuff";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {specialDefence} from "../../../../src/Func/Implementations/getDamageList";
import {artoria, cu} from "../../../helpers";

import specialDefenceData from "../../../samples/buff/specialDefence.json";

describe('getDamageList specialDefense', () => {
    it('test buff', async () => {
        const battle = new Battle(null),
            servant = artoria(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(specialDefence(actions.get(1), servant, target).value()).to.equal(1);

        target.addBuff(new BattleBuff({
            buff: <Buff.Buff><unknown>specialDefenceData,
            dataVal: {
                Value: 500,
            },
            short: false,
        }, null));
        expect(specialDefence(actions.get(1), servant, target).value()).to.equal(0.5);
    });
});
