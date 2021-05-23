import {expect} from 'chai';
import {BattleTeam} from "../../src/Enum/BattleTeam";
import {emiya} from "../helpers";

describe('BattleNoblePhantasmTest', () => {
    it('hits', () => {
        const servant = emiya(BattleTeam.PLAYER),
            noblePhantasm = servant.noblePhantasm();

        expect(noblePhantasm.hits()).to.eql([3, 3, 5, 7, 8, 10, 12, 14, 16, 22]);
    });
});
