import {Card, Region} from "@atlasacademy/api-connector";
import axios from "axios";
import GameBuffConstantMap, {GameBuffConstant, GameBuffGroup} from "./GameBuffConstantMap";
import GameCardConstantMap, {GameCardConstant} from "./GameCardConstantMap";
import GameConstants, {GameConstantKey} from "./GameConstants";

class GameConstantManager {
    private host: string = "https://api.atlasacademy.io";
    private loaded: boolean = false;
    private region: Region = Region.JP;
    private buffConstantMap?: GameBuffConstantMap = undefined;
    private cardConstantMap?: GameCardConstantMap = undefined;
    private constants?: GameConstants = undefined;

    public initManually(constants?: GameConstants,
                        buffConstantMap?: GameBuffConstantMap,
                        cardConstantMap?: GameCardConstantMap) {
        this.buffConstantMap = buffConstantMap;
        this.cardConstantMap = cardConstantMap;
        this.constants = constants;

        this.loaded = true;
    }

    async initRegion(region: Region) {
        if (this.region !== region) {
            this.region = region;
            this.loaded = false;
        }

        if (this.loaded) {
            return;
        }

        this.buffConstantMap = undefined;

        this.buffConstantMap = (
            await axios.get<GameBuffConstantMap>(`${this.host}/${this.region}/NiceBuffList.ActionList.json`)
        ).data;
        this.cardConstantMap = (
            await axios.get<GameCardConstantMap>(`${this.host}/${this.region}/NiceCard.json`)
        ).data;
        this.constants = (
            await axios.get<GameConstants>(`${this.host}/${this.region}/NiceConstant.json`)
        ).data;

        this.loaded = true;
    }

    reset() {
        this.buffConstantMap = undefined;
        this.constants = undefined;
        this.loaded = false;
    }

    buffConstants(group: GameBuffGroup): GameBuffConstant | undefined {
        if (!this.loaded)
            return undefined;

        if (!this.buffConstantMap)
            return undefined;

        return this.buffConstantMap[group];
    }

    cardConstants(card: Card, num: number): GameCardConstant | undefined {
        if (!this.loaded)
            return undefined;

        if (!this.cardConstantMap)
            return undefined;

        return (this.cardConstantMap[card] ?? {})[num];
    }

    getRateValue(key: GameConstantKey): number {
        return Math.fround(this.getValue(key) / 1000);
    }

    getValue(key: GameConstantKey): number {
        if (!this.loaded)
            return -1;

        if (!this.constants)
            return -1;

        return this.constants[key] ?? -1;
    }
}

const manager = new GameConstantManager();

export default manager;
