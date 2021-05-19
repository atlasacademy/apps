import {NoblePhantasm} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import BattleNoblePhantasm from "../../src/NoblePhantasm/BattleNoblePhantasm";

import emiyaData from "../samples/servant/emiya.json";

describe('BattleNoblePhantasmTest', () => {
    it('hits', () => {
        const noblePhantasm = new BattleNoblePhantasm({
            np: <NoblePhantasm.NoblePhantasm>emiyaData.noblePhantasms.filter(np => np.id === 200102).shift(),
            level: 1
        }, null);

        expect(noblePhantasm.hits()).to.eql([3, 3, 5, 7, 8, 10, 12, 14, 16, 22]);
    });
});
