import { expect } from "chai";

import { ClassName } from "@atlasacademy/api-connector";

import { classAttackRate } from "../../../../src/Func/Implementations/getDamageList";
import { createBattle } from "../../../helpers";

describe("getDamageList classAttackRate", () => {
    it("class defined", () => {
        const battle = createBattle();

        expect(classAttackRate(battle, ClassName.SABER).value()).to.equal(1);
        expect(classAttackRate(battle, ClassName.LANCER).value()).to.be.closeTo(1.05, 0.0001);
        expect(classAttackRate(battle, ClassName.CASTER).value()).to.be.closeTo(0.9, 0.0001);
    });

    it("class not defined", () => {
        expect(() => {
            const battle = createBattle();

            classAttackRate(battle, ClassName.EXTRA);
        }).to.throw(Error);
    });
});
