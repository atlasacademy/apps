import {ClassName} from "@atlasacademy/api-connector";

type GameClassAttackRates = {
    [key in ClassName]?: number
}

export default GameClassAttackRates;
