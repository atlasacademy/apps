import {expect} from 'chai';
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {npTraitBonusMagnification} from "../../../../src/Func/Implementations/getDamageList";
import {artoria, cu, gilgamesh, robinHood} from "../../../helpers";

describe('getDamageList npTraitBonusMagnification', () => {
    it('check np with no bonus', async () => {
        const servant = artoria(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        expect(npTraitBonusMagnification(servant.noblePhantasm().func(1), servant, target).value()).to.equal(1);
    });

    it('check np with trait bonus', async () => {
        const servant = gilgamesh(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        expect(npTraitBonusMagnification(servant.noblePhantasm().func(2), servant, target).value()).to.equal(1.5);

        servant.noblePhantasm().setOvercharge(2);
        expect(npTraitBonusMagnification(servant.noblePhantasm().func(2), servant, target).value()).to.equal(1.625);

        servant.noblePhantasm().setOvercharge(3);
        expect(npTraitBonusMagnification(servant.noblePhantasm().func(2), servant, target).value()).to.equal(1.75);

        servant.noblePhantasm().setOvercharge(4);
        expect(npTraitBonusMagnification(servant.noblePhantasm().func(2), servant, target).value()).to.equal(1.875);

        servant.noblePhantasm().setOvercharge(5);
        expect(npTraitBonusMagnification(servant.noblePhantasm().func(2), servant, target).value()).to.equal(2);
    });

    it('check np with buff bonus', async () => {
        const servant = robinHood(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        // no poison
        // expect(npTraitBonusMagnification(servant.noblePhantasm().func(1), servant, target).value()).to.equal(1);

        // with poison
        await servant.skill(1)?.activate(battle);
        expect(npTraitBonusMagnification(servant.noblePhantasm().func(1), servant, target).value()).to.equal(2);

        servant.noblePhantasm().setOvercharge(2);
        expect(npTraitBonusMagnification(servant.noblePhantasm().func(1), servant, target).value()).to.equal(2.125);

        servant.noblePhantasm().setOvercharge(3);
        expect(npTraitBonusMagnification(servant.noblePhantasm().func(1), servant, target).value()).to.equal(2.25);

        servant.noblePhantasm().setOvercharge(4);
        expect(npTraitBonusMagnification(servant.noblePhantasm().func(1), servant, target).value()).to.equal(2.375);

        servant.noblePhantasm().setOvercharge(5);
        expect(npTraitBonusMagnification(servant.noblePhantasm().func(1), servant, target).value()).to.equal(2.5);
    });
});
