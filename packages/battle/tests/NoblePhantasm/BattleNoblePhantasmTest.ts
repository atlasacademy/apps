import {expect} from 'chai';
import {BattleTeam} from "../../src/Enum/BattleTeam";
import {servant} from "../helpers";

describe('BattleNoblePhantasmTest', () => {
    it('hits', () => {
        const actor = servant(11, BattleTeam.PLAYER),
            noblePhantasm = actor.noblePhantasm();

        expect(noblePhantasm.hits()).to.eql([3, 3, 5, 7, 8, 10, 12, 14, 16, 22]);
    });
});
