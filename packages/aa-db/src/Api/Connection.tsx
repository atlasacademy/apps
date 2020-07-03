import axios from "axios";
import Manager from "../Setting/Manager";
import {LanguageOption} from "../Setting/Option";
import BasicListEntity from "./Data/BasicListEntity";
import Buff from "./Data/Buff";
import CraftEssence from "./Data/CraftEssence";
import Func from "./Data/Func";
import NoblePhantasm from "./Data/NoblePhantasm";
import Quest from "./Data/Quest";
import Region from "./Data/Region";
import Servant from "./Data/Servant";
import Skill from "./Data/Skill";
import TraitMap from "./Data/TraitMap";
import ResultCache from "./ResultCache";

const host = 'https://api.atlasacademy.io',
    cacheDuration = 20 * 1000,
    fetch = async function <T>(endpoint: string): Promise<T> {
        const response = await axios.get<T>(endpoint);

        return response.data;
    },
    cache = {
        buff: new ResultCache<string, Buff>(),
        craftEssence: new ResultCache<string, CraftEssence>(),
        craftEssenceList: new ResultCache<Region, BasicListEntity[]>(),
        func: new ResultCache<string, Func>(),
        noblePhantasm: new ResultCache<string, NoblePhantasm>(),
        quest: new ResultCache<string, Quest>(),
        servant: new ResultCache<string, Servant>(),
        servantList: new ResultCache<Region, BasicListEntity[]>(),
        skill: new ResultCache<string, Skill>(),
        traitMap: new ResultCache<Region, TraitMap>(),
    };

class Connection {
    static buff(region: Region, id: number): Promise<Buff> {
        const language = Manager.language(),
            key = `${region}-${language}-${id}`;

        return cache.buff.get(
            key,
            () => {
                let query = '?reverse=true' + (
                    language === LanguageOption.ENGLISH ? '&lang=en' : ''
                );

                return fetch<Buff>(`${host}/nice/${region}/buff/${id}${query}`);
            },
            cacheDuration
        );
    }

    static craftEssence(region: Region, id: number): Promise<CraftEssence> {
        const language = Manager.language(),
            key = `${region}-${language}-${id}`;

        return cache.craftEssence.get(
            key,
            () => {
                let query = '?lore=true' + (
                    language === LanguageOption.ENGLISH ? '&lang=en' : ''
                );

                return fetch<Servant>(`${host}/nice/${region}/equip/${id}${query}`);
            },
            cacheDuration
        );
    }

    static async craftEssenceList(region: Region): Promise<BasicListEntity[]> {
        if (region === Region.NA) {
            return Connection.getCacheableCraftEssenceList(Region.NA);
        } else if (region === Region.JP && Manager.language() === LanguageOption.DEFAULT) {
            return Connection.getCacheableCraftEssenceList(Region.JP);
        }

        const jp = await Connection.getCacheableCraftEssenceList(Region.JP),
            na = await Connection.getCacheableCraftEssenceList(Region.NA),
            names = new Map<number, string>(na.map(entity => [entity.id, entity.name]));

        return jp.map<BasicListEntity>(entity => {
            return {
                ...entity,
                name: names.get(entity.id) ?? entity.name,
            };
        });
    }

    static func(region: Region, id: number): Promise<Func> {
        const language = Manager.language(),
            key = `${region}-${language}-${id}`;

        return cache.func.get(
            key,
            () => {
                let query = '?reverse=true' + (
                    language === LanguageOption.ENGLISH ? '&lang=en' : ''
                );

                return fetch<Func>(`${host}/nice/${region}/function/${id}${query}`);
            },
            cacheDuration
        );
    }

    static noblePhantasm(region: Region, id: number): Promise<NoblePhantasm> {
        const language = Manager.language(),
            key = `${region}-${language}-${id}`;

        return cache.noblePhantasm.get(
            key,
            () => {
                let query = '?reverse=true' + (
                    language === LanguageOption.ENGLISH ? '&lang=en' : ''
                );

                return fetch<NoblePhantasm>(`${host}/nice/${region}/NP/${id}${query}`);
            },
            cacheDuration
        );
    }

    static quest(region: Region, id: number, phase: number): Promise<Quest> {
        const key = `${region}-${id}-${phase}`;

        return cache.quest.get(
            key,
            () => {
                return fetch<Quest>(`${host}/nice/${region}/quest/${id}/${phase}`);
            },
            cacheDuration
        );
    }

    static servant(region: Region, id: number): Promise<Servant> {
        const language = Manager.language(),
            key = `${region}-${language}-${id}`;

        return cache.servant.get(
            key,
            () => {
                let query = '?lore=true' + (
                    language === LanguageOption.ENGLISH ? '&lang=en' : ''
                );

                return fetch<Servant>(`${host}/nice/${region}/servant/${id}${query}`);
            },
            cacheDuration
        );
    }

    static async servantList(region: Region): Promise<BasicListEntity[]> {
        if (region === Region.NA) {
            return Connection.getCacheableServantList(Region.NA);
        } else if (region === Region.JP && Manager.language() === LanguageOption.DEFAULT) {
            return Connection.getCacheableServantList(Region.JP);
        }

        const jp = await Connection.getCacheableServantList(Region.JP),
            na = await Connection.getCacheableServantList(Region.NA),
            names = new Map<number, string>(na.map(entity => [entity.id, entity.name]));

        return jp.map<BasicListEntity>(entity => {
            return {
                ...entity,
                name: names.get(entity.id) ?? entity.name,
            };
        });
    }

    static skill(region: Region, id: number): Promise<Skill> {
        const language = Manager.language(),
            key = `${region}-${language}-${id}`;

        return cache.skill.get(
            key,
            () => {
                let query = '?reverse=true' + (
                    language === LanguageOption.ENGLISH ? '&lang=en' : ''
                );

                return fetch<Skill>(`${host}/nice/${region}/skill/${id}${query}`);
            },
            cacheDuration
        );
    }

    static traitMap(region: Region): Promise<TraitMap> {
        return cache.traitMap.get(
            region,
            () => {
                return fetch<TraitMap>(`${host}/export/${region}/nice_trait.json`);
            },
            null
        );
    }

    private static async getCacheableCraftEssenceList(region: Region): Promise<BasicListEntity[]> {
        return cache.craftEssenceList.get(
            region,
            () => {
                return fetch<BasicListEntity[]>(`${host}/export/${region}/basic_equip.json`);
            },
            null
        );
    }

    private static async getCacheableServantList(region: Region): Promise<BasicListEntity[]> {
        return cache.servantList.get(
            region,
            () => {
                return fetch<BasicListEntity[]>(`${host}/export/${region}/basic_servant.json`);
            },
            null
        );
    }
}

export default Connection;
