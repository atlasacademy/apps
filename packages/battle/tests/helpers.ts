import * as fs from "fs";

import { Buff, CraftEssence, DataVal, EnumList, Servant } from "@atlasacademy/api-connector";

import { Battle, BattleTeam } from "../src";
import { BattleActor, BattleActorState } from "../src/Actor/BattleActor";
import { BattleState } from "../src/Battle";
import { BattleBuff, BattleBuffState } from "../src/Buff/BattleBuff";
import createServantActor, { BattleServantActorProps } from "../src/Factory/createServantActor";
import attributeAffinity from "./../test-data/data/NiceAttributeRelation.json";
import buffConstants from "./../test-data/data/NiceBuffList.ActionList.json";
import cards from "./../test-data/data/NiceCard.json";
import classAttackRates from "./../test-data/data/NiceClassAttackRate.json";
import classAffinity from "./../test-data/data/NiceClassRelation.json";
import constants from "./../test-data/data/NiceConstant.json";
import enums from "./../test-data/data/nice_enums.json";

const testDataPath = "./test-data/data",
    buffCache = new Map<number, Buff.Buff>(),
    craftEssenceCache = new Map<number, CraftEssence.CraftEssence>(),
    servantCache = new Map<number, Servant.Servant>();

export function buff(
    id: number,
    dataVal: DataVal.DataVal,
    passive: boolean,
    short: boolean,
    state: BattleBuffState | null
): BattleBuff {
    let data = buffCache.get(id);

    if (data === undefined) {
        const filePath = `${testDataPath}/buffs/${id}.json`;
        if (!fs.existsSync(filePath)) throw new Error("FAILED TO FIND BUFF: " + id);

        const raw = fs.readFileSync(filePath).toString();

        data = <Buff.Buff>JSON.parse(raw);
        buffCache.set(id, data);
    }

    return new BattleBuff(
        {
            buff: <Buff.Buff>data,
            dataVal,
            passive,
            short,
        },
        state
    );
}

export function craftEssence(id: number): CraftEssence.CraftEssence {
    let data = craftEssenceCache.get(id);

    if (data === undefined) {
        const filePath = `${testDataPath}/craft_essences/${id}.json`;
        if (!fs.existsSync(filePath)) throw new Error("FAILED TO FIND CRAFT ESSENCE: " + id);

        const raw = fs.readFileSync(filePath).toString();

        data = <CraftEssence.CraftEssence>JSON.parse(raw);
        craftEssenceCache.set(id, data);
    }

    return data;
}

export function createBattle(state?: Partial<BattleState>): Battle {
    const battle = new Battle(state);
    setupTestData(battle);

    return battle;
}

export function servant(
    id: number,
    team: BattleTeam,
    props?: Partial<BattleServantActorProps>,
    state?: BattleActorState | null
): BattleActor {
    let data = servantCache.get(id);

    if (data === undefined) {
        const filePath = `${testDataPath}/servants/${id}.json`;
        if (!fs.existsSync(filePath)) throw new Error("FAILED TO FIND SERVANT: " + id);

        const raw = fs.readFileSync(filePath).toString();

        data = <Servant.Servant>JSON.parse(raw);
        servantCache.set(id, data);
    }

    const actor = createServantActor(id, 1, {
        servant: <Servant.Servant>data,
        team,
        ...props,
    });

    actor.state = state ?? actor.state;

    return actor;
}

export function setupTestData(battle: Battle) {
    battle
        .constants()
        .initManually(
            constants,
            attributeAffinity,
            <Buff.BuffConstantMap>buffConstants,
            cards,
            classAffinity,
            classAttackRates,
            <EnumList>enums
        );
}
