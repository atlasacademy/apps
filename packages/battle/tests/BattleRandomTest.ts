import {expect} from 'chai';
import {BattleRandom, BattleRandomType} from "../src/BattleRandom";

describe('BattleRandom', () => {
    it('generate', () => {
        const random = new BattleRandom(BattleRandomType.LOW);
        expect(random.generate(0, 1000)).to.equal(0);
        expect(random.generate(-1000, 1000)).to.equal(-1000);

        random.setType(BattleRandomType.HIGH);
        expect(random.generate(0, 1000)).to.equal(999);
        expect(random.generate(-1000, 1000)).to.equal(999);

        random.setType(BattleRandomType.AVERAGE);
        expect(random.generate(0, 1000)).to.equal(500);
        expect(random.generate(-1000, 1000)).to.equal(0);
        expect(random.generate(0, 3)).to.equal(1);

        random.setType(BattleRandomType.MANUAL, [0, 0.9999, 0.5]);
        expect(random.generate(0, 1000)).to.equal(0);
        expect(random.generate(0, 1000)).to.equal(999);
        expect(random.generate(0, 1000)).to.equal(500);
    });
});
