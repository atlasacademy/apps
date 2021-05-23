import {Attribute} from "@atlasacademy/api-connector/dist/Schema/Attribute";
import {expect} from 'chai';
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {attributeAffinityRate} from "../../../../src/Func/Implementations/getDamageList";
import {artoria, cu} from "../../../helpers";

describe('getDamageList attributeAffinityRate', () => {
    it('defined', () => {
        const servant = artoria(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY);

        expect(attributeAffinityRate(servant, servant).value()).to.equal(1);
        expect(attributeAffinityRate(servant, target).value()).to.be.closeTo(0.9, 0.0001);
        expect(attributeAffinityRate(target, servant).value()).to.be.closeTo(1.1, 0.0001);
        expect(attributeAffinityRate(target, target).value()).to.equal(1);
    });

    it('not defined', () => {
        const servant = artoria(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY);

        target.props.attribute = Attribute.VOID;

        expect(attributeAffinityRate(servant, target).value()).to.equal(1);
    });
});
