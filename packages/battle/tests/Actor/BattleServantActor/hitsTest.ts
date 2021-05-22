import {Card, Servant} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackAction, BattleAttackActionList} from "../../../src/Action/BattleAttackAction";
import BattleServantActor from "../../../src/Actor/BattleServantActor";
import {Battle} from "../../../src/Battle";
import {BattleTeam} from "../../../src/Enum/BattleTeam";

import artoriaData from "../../samples/servant/artoria.json";
import musashiData from "../../samples/servant/musashi.json";

describe('BattleServantActor hits', () => {
    it('artoria normal', () => {
        let battle = new Battle(null),
            servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>artoriaData,
                team: BattleTeam.PLAYER,
            }, null),
            actions: BattleAttackActionList;

        battle.addActor(servant);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(servant.hits(<BattleAttackAction>actions.get(1))).to.eql([100]);
        expect(servant.hits(<BattleAttackAction>actions.get(2))).to.eql([33, 67]);
        expect(servant.hits(<BattleAttackAction>actions.get(3))).to.eql([33, 67]);
        expect(servant.hits(<BattleAttackAction>actions.get(4))).to.eql([12, 25, 63]);
    });

    it('musashi normal', () => {
        let battle = new Battle(null),
            musashi = new BattleServantActor({
                id: 2,
                phase: 1,
                servant: <Servant.Servant>musashiData,
                team: BattleTeam.PLAYER,
            }, null),
            actions: BattleAttackActionList;

        battle.addActor(musashi);

        actions = new BattleAttackActionList();
        actions.add(musashi, Card.BUSTER, false);
        actions.add(musashi, Card.QUICK, false);
        actions.add(musashi, Card.ARTS, false);
        expect(musashi.hits(<BattleAttackAction>actions.get(1))).to.eql([33, 67]);
        expect(musashi.hits(<BattleAttackAction>actions.get(2))).to.eql([16, 33, 51]);
        expect(musashi.hits(<BattleAttackAction>actions.get(3))).to.eql([16, 33, 51]);
        expect(musashi.hits(<BattleAttackAction>actions.get(4))).to.eql([10, 20, 30, 40]);
    });

    it('musashi skill 1', () => {
        let battle = new Battle(null),
            servant = new BattleServantActor({
                id: 2,
                phase: 1,
                servant: <Servant.Servant>musashiData,
                team: BattleTeam.PLAYER,
            }, null),
            actions: BattleAttackActionList;

        battle.addActor(servant);

        servant.skill(1)?.activate(battle);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(servant.hits(<BattleAttackAction>actions.get(1))).to.eql([33, 33, 67, 67]);
        expect(servant.hits(<BattleAttackAction>actions.get(2))).to.eql([16, 16, 33, 33, 51, 51]);
        expect(servant.hits(<BattleAttackAction>actions.get(3))).to.eql([16, 16, 33, 33, 51, 51]);
        expect(servant.hits(<BattleAttackAction>actions.get(4))).to.eql([10, 10, 20, 20, 30, 30, 40, 40]);
    });
});
