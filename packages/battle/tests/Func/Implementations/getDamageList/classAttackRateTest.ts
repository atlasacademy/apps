import {ClassName} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {classAttackRate} from "../../../../src/Func/Implementations/getDamageList";

describe('getDamageList classAttackRate', () => {
    it('class defined', () => {
        expect(classAttackRate(ClassName.SABER).value()).to.equal(1);
        expect(classAttackRate(ClassName.LANCER).value()).to.be.closeTo(1.05, 0.0001);
        expect(classAttackRate(ClassName.CASTER).value()).to.be.closeTo(0.9, 0.0001);
    });

    it('class not defined', () => {
        expect(() => {
            classAttackRate(ClassName.EXTRA);
        }).to.throw(Error);
    });
});
