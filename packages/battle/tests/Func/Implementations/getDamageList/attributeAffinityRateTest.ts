import {Servant} from "@atlasacademy/api-connector";
import {Attribute} from "@atlasacademy/api-connector/dist/Schema/Attribute";
import {expect} from 'chai';
import BattleServantActor from "../../../../src/Actor/BattleServantActor";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {attributeAffinityRate} from "../../../../src/Func/Implementations/getDamageList";

import artoriaData from "../../../samples/servant/artoria.json";
import cuData from "../../../samples/servant/cu.json";

describe('getDamageList attributeAffinityRate', () => {
    it('defined', () => {
        const servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>artoriaData,
                team: BattleTeam.PLAYER,
            }, null),
            target = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>cuData,
                team: BattleTeam.ENEMY,
            }, null);

        expect(attributeAffinityRate(servant, servant).value()).to.equal(1);
        expect(attributeAffinityRate(servant, target).value()).to.be.closeTo(0.9, 0.0001);
        expect(attributeAffinityRate(target, servant).value()).to.be.closeTo(1.1, 0.0001);
        expect(attributeAffinityRate(target, target).value()).to.equal(1);
    });

    it('not defined', () => {
        const servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>artoriaData,
                team: BattleTeam.PLAYER,
            }, null),
            target = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>cuData,
                team: BattleTeam.ENEMY,
            }, null);

        target.props.attribute = Attribute.VOID;

        expect(attributeAffinityRate(servant, target).value()).to.equal(1);
    });
});
