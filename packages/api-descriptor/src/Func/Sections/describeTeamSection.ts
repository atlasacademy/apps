import { Func } from "@atlasacademy/api-connector";

import { BasePartial, ParticlePartial, TextPartial } from "../../Descriptor";

export default function (func: Func.Func): BasePartial[] {
    const makePartials = (label: string): BasePartial[] => {
        return [new ParticlePartial("["), new TextPartial(label), new ParticlePartial("]")];
    };

    switch (func.funcTargetTeam) {
        case Func.FuncTargetTeam.PLAYER:
            return makePartials("Player");
        case Func.FuncTargetTeam.ENEMY:
            return makePartials("Enemy");
        default:
            return [];
    }
}
