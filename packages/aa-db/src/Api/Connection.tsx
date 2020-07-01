import axios from "axios";
import Manager from "../Setting/Manager";
import {LanguageOption, RegionOption} from "../Setting/Option";
import Buff from "./Data/Buff";
import Func from "./Data/Func";
import NoblePhantasm from "./Data/NoblePhantasm";
import Quest from "./Data/Quest";
import ServantEntity from "./Data/ServantEntity";
import ServantListEntity from "./Data/ServantListEntity";
import Skill from "./Data/Skill";
import TraitMap from "./Data/TraitMap";

const host = 'https://api.atlasacademy.io';
const fetch = async function <T>(endpoint: string): Promise<T> {
    const response = await axios.get<T>(endpoint);

    return response.data;
}
const region = function (option?: RegionOption): string {
    option = option ?? Manager.region();

    if (option === RegionOption.NA)
        return 'NA';

    return 'JP';
}
const servantListCache = new Map<RegionOption, ServantListEntity[]>(),
    traitMapCache = new Map<RegionOption, TraitMap>();

class Connection {

    static buff(id: number): Promise<Buff> {
        let query = '?' + (
            Manager.language() === LanguageOption.ENGLISH ? '&lang=en' : ''
        );

        return fetch<Buff>(`${host}/nice/${region()}/buff/${id}${query}`);
    }

    static func(id: number): Promise<Func> {
        let query = '?' + (
            Manager.language() === LanguageOption.ENGLISH ? '&lang=en' : ''
        );

        return fetch<Func>(`${host}/nice/${region()}/function/${id}${query}`);
    }

    static noblePhantasm(id: number): Promise<NoblePhantasm> {
        let query = '?' + (
            Manager.language() === LanguageOption.ENGLISH ? '&lang=en' : ''
        );

        return fetch<NoblePhantasm>(`${host}/nice/${region()}/NP/${id}${query}`);
    }

    static quest(id: number, phase: number): Promise<Quest> {
        return fetch<Quest>(`${host}/nice/${region()}/quest/${id}/${phase}`);
    }

    static servant(id: number): Promise<ServantEntity> {
        let query = '?lore=true' + (
            Manager.language() === LanguageOption.ENGLISH ? '&lang=en' : ''
        );

        return fetch<ServantEntity>(`${host}/nice/${region()}/servant/${id}${query}`);
    }

    static async servantList(): Promise<ServantListEntity[]> {
        if (Manager.region() === RegionOption.NA) {
            return Connection.getCacheableServantList(RegionOption.NA);
        } else if (Manager.region() === RegionOption.JP && Manager.language() === LanguageOption.DEFAULT) {
            return Connection.getCacheableServantList(RegionOption.JP);
        }

        const jp = await Connection.getCacheableServantList(RegionOption.JP),
            na = await Connection.getCacheableServantList(RegionOption.NA),
            names = new Map<number, string>(na.map(entity => [entity.id, entity.name]));

        return jp.map<ServantListEntity>(entity => {
            return {
                ...entity,
                name: names.get(entity.id) ?? entity.name,
            };
        });
    }

    static skill(id: number): Promise<Skill> {
        let query = '?reverse=true' + (
            Manager.language() === LanguageOption.ENGLISH ? '&lang=en' : ''
        );

        return fetch<Skill>(`${host}/nice/${region()}/skill/${id}${query}`);
    }

    static traitMap(): Promise<TraitMap> {
        return Connection.getCacheableTraitMap(RegionOption.NA);
    }

    private static async getCacheableServantList(option: RegionOption): Promise<ServantListEntity[]> {
        let list = servantListCache.get(option);
        if (list !== undefined)
            return list;

        list = await fetch<ServantListEntity[]>(`${host}/export/${region(option)}/basic_servant.json`);
        servantListCache.set(option, list);

        return list;
    }

    private static async getCacheableTraitMap(option: RegionOption): Promise<TraitMap> {
        let list = traitMapCache.get(option);
        if (list !== undefined)
            return list;

        list = await fetch<TraitMap>(`${host}/export/${region(option)}/nice_trait.json`);
        traitMapCache.set(option, list);

        return list;
    }
}

export default Connection;
