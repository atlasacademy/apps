import axios from "axios";
import Manager from "../Setting/Manager";
import {LanguageOption} from "../Setting/Option";
import BasicListEntity from "./Data/BasicListEntity";
import Buff, {BuffType} from "./Data/Buff";
import CommandCode from "./Data/CommandCode";
import CraftEssence from "./Data/CraftEssence";
import Func, {FuncTargetTeam, FuncTargetType, FuncType} from "./Data/Func";
import MysticCode from "./Data/MysticCode";
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
        commandCode: new ResultCache<string, CommandCode>(),
        commandCodes: new ResultCache<Region, CommandCode[]>(),
        craftEssence: new ResultCache<string, CraftEssence>(),
        craftEssenceList: new ResultCache<Region, BasicListEntity[]>(),
        func: new ResultCache<string, Func>(),
        mysticCode: new ResultCache<string, MysticCode>(),
        mysticCodeList: new ResultCache<Region, MysticCode[]>(),
        noblePhantasm: new ResultCache<string, NoblePhantasm>(),
        quest: new ResultCache<string, Quest>(),
        servant: new ResultCache<string, Servant>(),
        servantList: new ResultCache<string, BasicListEntity[]>(),
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

    static commandCode(region: Region, id: number): Promise<CommandCode> {
        const key = `${region}-${id}`;

        return cache.commandCode.get(
            key,
            () => {
                return fetch<CommandCode>(`${host}/nice/${region}/CC/${id}`);
            },
            cacheDuration
        );
    }

    static async commandCodeList(region: Region): Promise<CommandCode[]> {
        if (region === Region.NA) {
            return Connection.getCommandCodeEssenceList(Region.NA);
        } else if (region === Region.JP && Manager.language() === LanguageOption.DEFAULT) {
            return Connection.getCommandCodeEssenceList(Region.JP);
        }

        const jp = await Connection.getCommandCodeEssenceList(Region.JP),
            na = await Connection.getCommandCodeEssenceList(Region.NA),
            names = new Map<number, string>(na.map(entity => [entity.id, entity.name]));

        return jp.map(entity => {
            return {
                ...entity,
                name: names.get(entity.id) ?? entity.name,
            };
        });
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

    static mysticCode(region: Region, id: number): Promise<MysticCode> {
        const key = `${region}-${id}`;

        return cache.mysticCode.get(
            key,
            () => {
                return fetch<MysticCode>(`${host}/nice/${region}/MC/${id}`);
            },
            cacheDuration
        );
    }

    static async mysticCodeList(region: Region): Promise<MysticCode[]> {
        if (region === Region.NA) {
            return Connection.getCacheableMysticCodeList(Region.NA);
        } else if (region === Region.JP && Manager.language() === LanguageOption.DEFAULT) {
            return Connection.getCacheableMysticCodeList(Region.JP);
        }

        const jp = await Connection.getCacheableMysticCodeList(Region.JP),
            na = await Connection.getCacheableMysticCodeList(Region.NA),
            names = new Map<number, string>(na.map(entity => [entity.id, entity.name]));

        return jp.map<MysticCode>(entity => {
            return {
                ...entity,
                name: names.get(entity.id) ?? entity.name,
            };
        });
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
        const language = Manager.language(),
            key = `${region}-${language}`;

        let source: string;

        if (region === Region.NA) {
            source = `${host}/export/NA/basic_servant.json`;
        } else if (region === Region.JP && language === LanguageOption.DEFAULT) {
            source = `${host}/export/JP/basic_servant.json`;
        } else {
            source = `${host}/export/JP/basic_servant_lang_en.json`;
        }

        return cache.servantList.get(
            key,
            () => {
                return fetch<BasicListEntity[]>(source);
            },
            null
        );
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

    static searchBuffs(region: Region, name?: string, type?: BuffType): Promise<Buff[]> {
        const language = Manager.language();

        let query = "?reverse=true";

        if (language === LanguageOption.ENGLISH)
            query += "&lang=en";
        if (name)
            query += "&name=" + encodeURI(name);
        if (type)
            query += "&type=" + type;

        return fetch<Buff[]>(`${host}/nice/${region}/buff/search${query}`);
    }

    static searchFuncs(region: Region,
                       text?: string,
                       type?: FuncType,
                       target?: FuncTargetType,
                       team?: FuncTargetTeam): Promise<Func[]> {
        const language = Manager.language();

        let query = "?reverse=true";

        if (language === LanguageOption.ENGLISH)
            query += "&lang=en";
        if (text)
            query += "&popupText=" + encodeURI(text);
        if (type)
            query += "&type=" + type;
        if (target)
            query += "&targetType=" + target;
        if (team)
            query += "&targetTeam=" + team;

        return fetch<Func[]>(`${host}/nice/${region}/function/search${query}`);
    }

    private static async getCommandCodeEssenceList(region: Region): Promise<CommandCode[]> {
        return cache.commandCodes.get(
            region,
            () => {
                return fetch<CommandCode[]>(`${host}/export/${region}/nice_command_code.json`);
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

    private static async getCacheableMysticCodeList(region: Region): Promise<MysticCode[]> {
        return cache.mysticCodeList.get(
            region,
            () => {
                return fetch<BasicListEntity[]>(`${host}/export/${region}/nice_mystic_code.json`);
            },
            null
        );
    }
}

export default Connection;
