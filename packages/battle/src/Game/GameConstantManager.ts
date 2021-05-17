import {Region} from "@atlasacademy/api-connector";
import axios from "axios";
import GameBuffConstantMap, {GameBuffConstant, GameBuffGroup} from "./GameBuffConstantMap";

class GameConstantManager {
    private host: string = "https://api.atlasacademy.io";
    private loaded: boolean = false;
    private region: Region = Region.JP;
    private buffConstantMap?: GameBuffConstantMap = undefined;

    public initManually(buffConstantMap?: GameBuffConstantMap) {
        this.buffConstantMap = buffConstantMap;

        this.loaded = true;
    }

    public async initRegion(region: Region) {
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

        this.loaded = true;
    }

    public reset() {
        this.buffConstantMap = undefined;
        this.loaded = false;
    }

    public buffConstants(group: GameBuffGroup): GameBuffConstant | undefined {
        if (!this.loaded)
            return undefined;

        if (!this.buffConstantMap)
            return undefined;

        return this.buffConstantMap[group];
    }
}

const manager = new GameConstantManager();

export default manager;
