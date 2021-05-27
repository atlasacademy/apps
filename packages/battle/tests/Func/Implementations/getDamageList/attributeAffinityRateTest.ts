import {Attribute} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {attributeAffinityRate} from "../../../../src/Func/Implementations/getDamageList";
import {servant} from "../../../helpers";

describe('getDamageList attributeAffinityRate', () => {
    it('defined', () => {
        const actor = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY);

        expect(attributeAffinityRate(actor, actor).value()).to.equal(1);
        expect(attributeAffinityRate(actor, target).value()).to.be.closeTo(0.9, 0.0001);
        expect(attributeAffinityRate(target, actor).value()).to.be.closeTo(1.1, 0.0001);
        expect(attributeAffinityRate(target, target).value()).to.equal(1);
    });

    it('not defined', () => {
        const actor = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY);

        target.props.attribute = Attribute.Attribute.VOID;

        expect(attributeAffinityRate(actor, target).value()).to.equal(1);
    });
});
