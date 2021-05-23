import {ClassAffinityMap, ClassAttackRateMap} from "@atlasacademy/api-connector/dist/Enum/ClassName";
import {
    ApiConnector,
    Buff,
    Card,
    ClassName,
    Constant,
    EnumList,
    Region,
} from "@atlasacademy/api-connector";
import {
    CardConstant,
    CardConstantMap,
} from "@atlasacademy/api-connector/dist/Enum/Card";

class GameConstantManager {
    private host: string = "https://api.atlasacademy.io";
    private loaded: boolean = false;
    private region: Region = Region.JP;
    private buffConstantMap?: Buff.BuffConstantMap = undefined;
    private cardConstantMap?: CardConstantMap = undefined;
    private classAffinityMap?: ClassAffinityMap = undefined;
    private classAttackRates?: ClassAttackRateMap = undefined;
    private constants?: Constant.Constants = undefined;
    private enumMap?: EnumList = undefined;

    public initManually(
        constants?: Constant.Constants,
        buffConstantMap?: Buff.BuffConstantMap,
        cardConstantMap?: CardConstantMap,
        classAffinityMap?: ClassAffinityMap,
        classAttackRates?: ClassAttackRateMap,
        enumMap?: EnumList
    ) {
        this.buffConstantMap = buffConstantMap;
        this.cardConstantMap = cardConstantMap;
        this.classAffinityMap = classAffinityMap;
        this.classAttackRates = classAttackRates;
        this.constants = constants;
        this.enumMap = enumMap;

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

        const api = new ApiConnector({
            host: this.host,
            region: this.region,
        });

        await Promise.all([
            async () => this.buffConstantMap = await api.buffConstant(),
            async () => this.cardConstantMap = await api.cardConstant(),
            async () => this.classAffinityMap = await api.classAffinityConstant(),
            async () => this.classAttackRates = await api.classAttackConstant(),
            async () => this.constants = await api.constant(),
            async () => this.enumMap = await api.enumList(),
        ]);

        this.loaded = true;
    }

    reset() {
        this.buffConstantMap = undefined;
        this.cardConstantMap = undefined;
        this.classAffinityMap = undefined;
        this.classAttackRates = undefined;
        this.constants = undefined;
        this.loaded = false;
    }

    buffConstants(group: Buff.BuffAction): Buff.BuffConstant | undefined {
        if (!this.loaded) return undefined;

        if (!this.buffConstantMap) return undefined;

        return this.buffConstantMap[group];
    }

    cardConstants(card: Card, num: number): CardConstant | undefined {
        if (!this.loaded) return undefined;

        if (!this.cardConstantMap) return undefined;

        return (this.cardConstantMap[card] ?? {})[num];
    }

    classAffinityRate(attacker: ClassName, defender: ClassName): number | undefined {
        if (!this.loaded) return undefined;
        if (!this.classAffinityMap) return undefined;

        return (this.classAffinityMap[attacker] ?? {})[defender];
    }

    classAttackRate(className: ClassName): number | undefined {
        if (!this.loaded) return undefined;

        if (!this.classAttackRates) return undefined;

        return this.classAttackRates[className];
    }

    getRateValue(key: Constant.Constant): number {
        return Math.fround(this.getValue(key) / 1000);
    }

    className(classId: number): ClassName | undefined {
        return this.enumMap?.SvtClass[classId.toString()]
    }

    getValue(key: Constant.Constant): number {
        if (!this.loaded) return -1;

        if (!this.constants) return -1;

        return this.constants[key] ?? -1;
    }
}

const manager = new GameConstantManager();

export default manager;
