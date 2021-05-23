import {expect} from 'chai';
import {Battle} from "../../../../src/Battle";
import {BattleRandomType} from "../../../../src/BattleRandom";
import {randomAttack} from "../../../../src/Func/Implementations/getDamageList";

describe('getDamageList randomAttack', () => {
    it('test range', async () => {
        const battle = new Battle(null);

        battle.random().setType(BattleRandomType.LOW);
        expect((await randomAttack(battle)).value()).to.be.closeTo(0.9, 0.0001);

        battle.random().setType(BattleRandomType.AVERAGE);
        expect((await randomAttack(battle)).value()).to.equal(1);

        battle.random().setType(BattleRandomType.HIGH);
        expect((await randomAttack(battle)).value()).to.be.closeTo(1.099, 0.0001);
    });
});
