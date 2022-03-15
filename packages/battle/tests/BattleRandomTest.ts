import { expect } from "chai";

import { BattleRandom, BattleRandomType } from "../src/BattleRandom";

describe("BattleRandom", () => {
    it("generate", async () => {
        const random = new BattleRandom(BattleRandomType.LOW);
        expect(await random.generate(0, 1000)).to.equal(0);
        expect(await random.generate(-1000, 1000)).to.equal(-1000);

        random.setType(BattleRandomType.HIGH);
        expect(await random.generate(0, 1000)).to.equal(999);
        expect(await random.generate(-1000, 1000)).to.equal(999);

        random.setType(BattleRandomType.AVERAGE);
        expect(await random.generate(0, 1000)).to.equal(500);
        expect(await random.generate(-1000, 1000)).to.equal(0);
        expect(await random.generate(0, 3)).to.equal(1);

        random.setManualType([0, 0.9999, 0.5]);
        expect(await random.generate(0, 1000)).to.equal(0);
        expect(await random.generate(0, 1000)).to.equal(999);
        expect(await random.generate(0, 1000)).to.equal(500);

        const randomValue = Math.random(),
            expectedValue = Math.floor(randomValue * 1000),
            callback = async (message: string) => {
                expect(message).to.equal("EXPECTED MESSAGE");
                return randomValue;
            };

        random.setCallbackType(callback);
        expect(await random.generate(0, 1000, "EXPECTED MESSAGE")).to.equal(expectedValue);
    });
});
