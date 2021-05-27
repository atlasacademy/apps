import {Buff, DataVal, Servant} from "@atlasacademy/api-connector";
import * as fs from "fs";
import {BattleActor, BattleActorState} from "../src/Actor/BattleActor";
import BattleServantActor, {BattleServantActorProps} from "../src/Actor/BattleServantActor";
import {BattleBuff, BattleBuffState} from "../src/Buff/BattleBuff";
import {BattleTeam} from "../src/Enum/BattleTeam";

const testDataPath = "./test-data/data",
    buffCache = new Map<number, Buff.Buff>(),
    servantCache = new Map<number, Servant.Servant>();

export function buff(id: number,
                     dataVal: DataVal.DataVal,
                     passive: boolean,
                     short: boolean,
                     state: BattleBuffState | null): BattleBuff {
    let data = buffCache.get(id);

    if (data === undefined) {
        const filePath = `${testDataPath}/buffs/${id}.json`;
        if (!fs.existsSync(filePath))
            throw new Error('FAILED TO FIND BUFF: ' + id);

        const raw = fs.readFileSync(filePath).toString();

        data = <Buff.Buff>JSON.parse(raw);
        buffCache.set(id, data);
    }

    return new BattleBuff({
        buff: <Buff.Buff>data,
        dataVal,
        passive,
        short,
    }, state);
}

export function servant(id: number,
                        team: BattleTeam,
                        props?: Partial<BattleServantActorProps>,
                        state?: BattleActorState | null): BattleActor {
    let data = servantCache.get(id);

    if (data === undefined) {
        const filePath = `${testDataPath}/servants/${id}.json`;
        if (!fs.existsSync(filePath))
            throw new Error('FAILED TO FIND SERVANT: ' + id);

        const raw = fs.readFileSync(filePath).toString();

        data = <Servant.Servant>JSON.parse(raw);
        servantCache.set(id, data);
    }

    return new BattleServantActor({
        id,
        phase: 1,
        servant: <Servant.Servant>data,
        team,
        ...props
    }, state ?? null);
}
