import {
    ApiConnector,
    Buff,
    BuffType,
    CommandCode,
    CraftEssence, CraftEssenceBasic,
    Func,
    FuncTargetTeam,
    FuncTargetType,
    FuncType,
    Language,
    MysticCode,
    NoblePhantasm, QuestPhase,
    Region,
    Servant, ServantBasic,
    Skill,
    Trait
} from "@atlasacademy/api-connector";
import Manager from "./Setting/Manager";

const host = 'https://api.atlasacademy.io',
    cacheDuration = 20 * 1000;

let apiConnector: ApiConnector = new ApiConnector({
    host,
    region: Region.JP,
    language: Manager.language()
});

class Api {
    static init(region: Region, language: Language) {
        apiConnector = new ApiConnector({host, region, language});
    }

    static buff(id: number): Promise<Buff> {
        return apiConnector.buff(id, cacheDuration);
    }

    static commandCode(id: number): Promise<CommandCode> {
        return apiConnector.commandCode(id, cacheDuration);
    }

    static async commandCodeList(): Promise<CommandCode[]> {
        return apiConnector.commandCodeList(-1);
    }

    static craftEssence(id: number): Promise<CraftEssence> {
        return apiConnector.craftEssence(id, cacheDuration);
    }

    static async craftEssenceList(): Promise<CraftEssenceBasic[]> {
        return apiConnector.craftEssenceList(-1);
    }

    static func(id: number): Promise<Func> {
        return apiConnector.func(id, cacheDuration);
    }

    static mysticCode(id: number): Promise<MysticCode> {
        return apiConnector.mysticCode(id, cacheDuration);
    }

    static async mysticCodeList(): Promise<MysticCode[]> {
        return apiConnector.mysticCodeList(-1);
    }

    static noblePhantasm(id: number): Promise<NoblePhantasm> {
        return apiConnector.noblePhantasm(id, cacheDuration);
    }

    static questPhase(id: number, phase: number): Promise<QuestPhase> {
        return apiConnector.questPhase(id, phase, cacheDuration);
    }

    static servant(id: number): Promise<Servant> {
        return apiConnector.servant(id, cacheDuration);
    }

    static async servantList(): Promise<ServantBasic[]> {
        return apiConnector.servantList(-1);
    }

    static skill(id: number): Promise<Skill> {
        return apiConnector.skill(id, cacheDuration);
    }

    static traitList(): Promise<Trait[]> {
        return apiConnector.traitList(-1);
    }

    static searchBuffs(name?: string, type?: BuffType): Promise<Buff[]> {
        return apiConnector.searchBuff({name, type});
    }

    static searchFuncs(text?: string,
                       type?: FuncType,
                       target?: FuncTargetType,
                       team?: FuncTargetTeam): Promise<Func[]> {
        return apiConnector.searchFunc({text, type, target, team});
    }

}

export default Api;
