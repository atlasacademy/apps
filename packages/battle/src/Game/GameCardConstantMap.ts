import { Card } from "@atlasacademy/api-connector";
import {Trait} from "@atlasacademy/api-connector/dist/Schema/Trait";

export interface GameCardConstant {
    individuality: Trait[],
    adjustAtk: number,
    adjustTdGauge: number,
    adjustCritical: number,
    addAtk: number,
    addTdGauge: number,
    addCritical: number,
}

type GameCardConstantMap = {
    [key in Card]?: {
        [key in number]: GameCardConstant;
    }
}

export default GameCardConstantMap;
