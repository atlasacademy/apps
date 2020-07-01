import axios from "axios";
import Manager from "../Setting/Manager";
import {LanguageOption} from "../Setting/Option";
import Buff from "./Data/Buff";
import Func from "./Data/Func";
import NoblePhantasm from "./Data/NoblePhantasm";
import Quest from "./Data/Quest";
import Region from "./Data/Region";
import ServantEntity from "./Data/ServantEntity";
import ServantListEntity from "./Data/ServantListEntity";
import Skill from "./Data/Skill";
import TraitMap from "./Data/TraitMap";

const host = 'https://api.atlasacademy.io';
const fetch = async function <T>(endpoint: string): Promise<T> {
    const response = await axios.get<T>(endpoint);

    return response.data;
}
const servantListCache = new Map<Region, ServantListEntity[]>(),
    traitMapCache = new Map<Region, TraitMap>();

class Connection {
    static buff(region: Region, id: number): Promise<Buff> {
        let query = '?' + (
            Manager.language() === LanguageOption.ENGLISH ? '&lang=en' : ''
        );

        return fetch<Buff>(`${host}/nice/${region}/buff/${id}${query}`);
    }

    static func(region: Region, id: number): Promise<Func> {
        let query = '?' + (
            Manager.language() === LanguageOption.ENGLISH ? '&lang=en' : ''
        );

        return fetch<Func>(`${host}/nice/${region}/function/${id}${query}`);
    }

    static noblePhantasm(region: Region, id: number): Promise<NoblePhantasm> {
        let query = '?' + (
            Manager.language() === LanguageOption.ENGLISH ? '&lang=en' : ''
        );

        return fetch<NoblePhantasm>(`${host}/nice/${region}/NP/${id}${query}`);
    }

    static quest(region: Region, id: number, phase: number): Promise<Quest> {
        return fetch<Quest>(`${host}/nice/${region}/quest/${id}/${phase}`);
    }

    static servant(region: Region, id: number): Promise<ServantEntity> {
        let query = '?lore=true' + (
            Manager.language() === LanguageOption.ENGLISH ? '&lang=en' : ''
        );

        return fetch<ServantEntity>(`${host}/nice/${region}/servant/${id}${query}`);
    }

    static async servantList(region: Region): Promise<ServantListEntity[]> {
        if (region === Region.NA) {
            return Connection.getCacheableServantList(Region.NA);
        } else if (region === Region.JP && Manager.language() === LanguageOption.DEFAULT) {
            return Connection.getCacheableServantList(Region.JP);
        }

        const jp = await Connection.getCacheableServantList(Region.JP),
            na = await Connection.getCacheableServantList(Region.NA),
            names = new Map<number, string>(na.map(entity => [entity.id, entity.name]));

        return jp.map<ServantListEntity>(entity => {
            return {
                ...entity,
                name: names.get(entity.id) ?? entity.name,
            };
        });
    }

    static skill(region: Region, id: number): Promise<Skill> {
        let query = '?reverse=true' + (
            Manager.language() === LanguageOption.ENGLISH ? '&lang=en' : ''
        );

        return fetch<Skill>(`${host}/nice/${region}/skill/${id}${query}`);
    }

    static traitMap(region: Region): Promise<TraitMap> {
        return Connection.getCacheableTraitMap(region);
    }

    private static async getCacheableServantList(region: Region): Promise<ServantListEntity[]> {
        let list = servantListCache.get(region);
        if (list !== undefined)
            return list;

        list = await fetch<ServantListEntity[]>(`${host}/export/${region}/basic_servant.json`);
        servantListCache.set(region, list);

        return list;
    }

    private static async getCacheableTraitMap(region: Region): Promise<TraitMap> {
        let list = traitMapCache.get(region);
        if (list !== undefined)
            return list;

        list = await fetch<TraitMap>(`${host}/export/${region}/nice_trait.json`);
        traitMapCache.set(region, list);

        return list;
    }
}

export default Connection;
