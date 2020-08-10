import axios from 'axios';
import BuffType from "./Enum/BuffType";
import FuncTargetTeam from "./Enum/FuncTargetTeam";
import FuncTargetType from "./Enum/FuncTargetType";
import FuncType from "./Enum/FuncType";
import Language from "./Enum/Language";
import Region from "./Enum/Region";
import ResultCache from "./ResultCache";
import Buff from "./Schema/Buff";
import CommandCode from "./Schema/CommandCode";
import CraftEssence from "./Schema/CraftEssence";
import CraftEssenceBasic from "./Schema/CraftEssenceBasic";
import Func from "./Schema/Func";
import MysticCode from "./Schema/MysticCode";
import NoblePhantasm from "./Schema/NoblePhantasm";
import QuestPhase from "./Schema/QuestPhase";
import Servant from "./Schema/Servant";
import ServantBasic from "./Schema/ServantBasic";
import Skill from "./Schema/Skill";
import Trait from "./Schema/Trait";

interface BuffSearchOptions {
    name?: string;
    type?: BuffType;
}

interface FuncSearchOptions {
    text?: string;
    type?: FuncType;
    target?: FuncTargetType;
    team?: FuncTargetTeam;
}

interface ApiConnectorProperties {
    host?: string;
    region?: Region;
    language?: Language;
}

class ApiConnector {
    private host: string;
    private region: Region;
    private language: Language;
    private cache = {
        buff: new ResultCache<number, Buff>(),
        commandCode: new ResultCache<number, CommandCode>(),
        commandCodeList: new ResultCache<null, CommandCode[]>(),
        craftEssence: new ResultCache<number, CraftEssence>(),
        craftEssenceList: new ResultCache<null, CraftEssenceBasic[]>(),
        func: new ResultCache<number, Func>(),
        mysticCode: new ResultCache<number, MysticCode>(),
        mysticCodeList: new ResultCache<null, MysticCode[]>(),
        noblePhantasm: new ResultCache<number, NoblePhantasm>(),
        questPhase: new ResultCache<{ id: number, phase: number }, QuestPhase>(),
        servant: new ResultCache<number, Servant>(),
        servantList: new ResultCache<null, ServantBasic[]>(),
        skill: new ResultCache<number, Skill>(),
        traitList: new ResultCache<null, Trait[]>(),
    };

    constructor(props?: ApiConnectorProperties) {
        const settings = Object.assign({
            host: 'https://api.atlasacademy.io',
            region: Region.JP,
            language: Language.DEFAULT,
        }, props);

        this.host = settings.host;
        this.region = settings.region;
        this.language = settings.language;
    }

    buff(id: number, cacheDuration?: number): Promise<Buff> {
        const query = '?reverse=true&reverseDepth=skillNp' + (
                this.language === Language.ENGLISH ? '&lang=en' : ''
            ),
            fetch = () => {
                return ApiConnector.fetch<Buff>(
                    `${this.host}/nice/${this.region}/buff/${id}${query}`
                );
            };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.buff.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    commandCode(id: number, cacheDuration?: number): Promise<CommandCode> {
        const fetch = () => {
            return ApiConnector.fetch<CommandCode>(
                `${this.host}/nice/${this.region}/CC/${id}`
            );
        };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.commandCode.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    async commandCodeList(cacheDuration?: number): Promise<CommandCode[]> {
        const fetch = () => {
            return ApiConnector.fetch<CommandCode[]>(
                `${this.host}/export/${this.region}/nice_command_code.json`
            );
        };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.commandCodeList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    craftEssence(id: number, cacheDuration?: number): Promise<CraftEssence> {
        const query = '?lore=true' + (
                this.language === Language.ENGLISH ? '&lang=en' : ''
            ),
            fetch = () => {
                return ApiConnector.fetch<CraftEssence>(`${this.host}/nice/${this.region}/equip/${id}${query}`);
            };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.craftEssence.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    craftEssenceList(cacheDuration?: number): Promise<CraftEssenceBasic[]> {
        const fetch = () => {
            return ApiConnector.fetch<CraftEssenceBasic[]>(
                `${this.host}/export/${this.region}/basic_equip.json`
            );
        };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.craftEssenceList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    func(id: number, cacheDuration?: number): Promise<Func> {
        const query = '?reverse=true&reverseDepth=servant' + (
                this.language === Language.ENGLISH ? '&lang=en' : ''
            ),
            fetch = () => {
                return ApiConnector.fetch<Func>(
                    `${this.host}/nice/${this.region}/function/${id}${query}`
                );
            }

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.func.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    mysticCode(id: number, cacheDuration?: number): Promise<MysticCode> {
        const fetch = () => {
            return ApiConnector.fetch<MysticCode>(
                `${this.host}/nice/${this.region}/MC/${id}`
            );
        }

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.mysticCode.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    mysticCodeList(cacheDuration?: number): Promise<MysticCode[]> {
        const fetch = () => {
            return ApiConnector.fetch<MysticCode[]>(
                `${this.host}/export/${this.region}/nice_mystic_code.json`
            );
        }

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.mysticCodeList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    noblePhantasm(id: number, cacheDuration?: number): Promise<NoblePhantasm> {
        const query = '?reverse=true' + (
                this.language === Language.ENGLISH ? '&lang=en' : ''
            ),
            fetch = () => {
                return ApiConnector.fetch<NoblePhantasm>(
                    `${this.host}/nice/${this.region}/NP/${id}${query}`
                );
            }

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.noblePhantasm.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    questPhase(id: number, phase: number, cacheDuration?: number): Promise<QuestPhase> {
        const fetch = () => {
            return ApiConnector.fetch<QuestPhase>(
                `${this.host}/nice/${this.region}/quest/${id}/${phase}`
            );
        }

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.questPhase.get(
            {id, phase},
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    servant(id: number, cacheDuration?: number): Promise<Servant> {
        const query = '?lore=true' + (
                this.language === Language.ENGLISH ? '&lang=en' : ''
            ),
            fetch = () => {
                return ApiConnector.fetch<Servant>(
                    `${this.host}/nice/${this.region}/servant/${id}${query}`
                );
            };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.servant.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    servantList(cacheDuration?: number): Promise<ServantBasic[]> {
        let source: string;

        if (this.region === Region.NA) {
            source = `${this.host}/export/NA/basic_servant.json`;
        } else if (this.region === Region.JP && this.language === Language.DEFAULT) {
            source = `${this.host}/export/JP/basic_servant.json`;
        } else {
            source = `${this.host}/export/JP/basic_servant_lang_en.json`;
        }

        const fetch = () => {
            return ApiConnector.fetch<ServantBasic[]>(source);
        };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.servantList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    skill(id: number, cacheDuration?: number): Promise<Skill> {
        const query = '?reverse=true' + (
                this.language === Language.ENGLISH ? '&lang=en' : ''
            ),
            fetch = () => {
                return ApiConnector.fetch<Skill>(
                    `${this.host}/nice/${this.region}/skill/${id}${query}`
                );
            };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.skill.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    traitList(cacheDuration?: number): Promise<Trait[]> {
        const fetch = async () => {
            const traitMap = await ApiConnector.fetch<{ [key: number]: string }>(
                `${this.host}/export/${this.region}/nice_trait.json`
            );

            return Object.keys(traitMap).map((key) => {
                const id = parseInt(key);

                return {
                    id: id,
                    name: traitMap[id]
                };
            });
        };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.traitList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    searchBuff(options: BuffSearchOptions): Promise<Buff[]> {
        let query = "?reverse=true";

        if (this.language === Language.ENGLISH)
            query += "&lang=en";
        if (options.name)
            query += "&name=" + encodeURI(options.name);
        if (options.type)
            query += "&type=" + options.type;

        return ApiConnector.fetch<Buff[]>(
            `${this.host}/nice/${this.region}/buff/search${query}`
        );
    }

    searchFunc(options: FuncSearchOptions): Promise<Func[]> {
        let query = "?reverse=true";

        if (this.language === Language.ENGLISH)
            query += "&lang=en";
        if (options.text)
            query += "&popupText=" + encodeURI(options.text);
        if (options.type)
            query += "&type=" + options.type;
        if (options.target)
            query += "&targetType=" + options.target;
        if (options.team)
            query += "&targetTeam=" + options.team;

        return ApiConnector.fetch<Func[]>(
            `${this.host}/nice/${this.region}/function/search${query}`
        );
    }

    private static async fetch<T>(endpoint: string): Promise<T> {
        const response = await axios.get<T>(endpoint);

        return response.data;
    }

}

export default ApiConnector;
