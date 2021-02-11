import axios from 'axios';
import ClassName from "./Enum/ClassName";
import Language from "./Enum/Language";
import Region from "./Enum/Region";
import ResultCache from "./ResultCache";
import {BasicBuff, Buff, BuffType} from "./Schema/Buff";
import {CommandCode, CommandCodeBasic} from "./Schema/CommandCode";
import {Change} from "./Schema/Change";
import {CraftEssence, CraftEssenceBasic} from "./Schema/CraftEssence";
import {Enemy} from "./Schema/Enemy";
import {Attribute, EntityBasic, EntityType, Gender} from "./Schema/Entity";
import {Event, EventBasic} from "./Schema/Event";
import {BasicFunc, Func, FuncTargetTeam, FuncTargetType, FuncType} from "./Schema/Func";
import {Item, ItemType, ItemBackgroundType, ItemUse} from "./Schema/Item";
import {MysticCode, MysticCodeBasic} from "./Schema/MysticCode";
import {NoblePhantasm} from "./Schema/NoblePhantasm";
import {QuestPhase} from "./Schema/Quest";
import {Servant, ServantBasic} from "./Schema/Servant";
import {Skill} from "./Schema/Skill";
import {Trait} from "./Schema/Trait";
import {AiType, AiCollection} from "./Schema/Ai";

interface BuffSearchOptions {
    name?: string;
    type?: BuffType;
}

interface EntitySearchOptions {
    name?: string;
    type?: EntityType;
    className?: ClassName;
    gender?: Gender;
    attribute?: Attribute;
    traits?: number[];
    voiceCondSvt?: number;
}

interface FuncSearchOptions {
    text?: string;
    type?: FuncType;
    target?: FuncTargetType;
    team?: FuncTargetTeam;
}

interface ItemSearchOptions {
    name?: string;
    individuality?: number[];
    type?: ItemType[];
    background?: ItemBackgroundType[];
    use?: ItemUse[];
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
        buffBasic: new ResultCache<number, BasicBuff>(),
        commandCode: new ResultCache<number, CommandCode>(),
        commandCodeList: new ResultCache<null, CommandCodeBasic[]>(),
        craftEssence: new ResultCache<number, CraftEssence>(),
        craftEssenceBasic: new ResultCache<number, CraftEssenceBasic>(),
        craftEssenceList: new ResultCache<null, CraftEssenceBasic[]>(),
        enemy: new ResultCache<number, Enemy>(),
        event: new ResultCache<number, Event>(),
        eventBasic: new ResultCache<number, EventBasic>(),
        func: new ResultCache<number, Func>(),
        item: new ResultCache<number, Item>(),
        itemList: new ResultCache<null, Item[]>(),
        searchItem: new ResultCache<string, Item[]>(),
        mysticCode: new ResultCache<number, MysticCode>(),
        mysticCodeList: new ResultCache<null, MysticCodeBasic[]>(),
        noblePhantasm: new ResultCache<number, NoblePhantasm>(),
        questPhase: new ResultCache<{ id: number, phase: number }, QuestPhase>(),
        entityBasic: new ResultCache<number, EntityBasic>(),
        servant: new ResultCache<number, Servant>(),
        servantList: new ResultCache<null, ServantBasic[]>(),
        servantListNice: new ResultCache<null, Servant[]>(),
        skill: new ResultCache<number, Skill>(),
        traitList: new ResultCache<null, Trait[]>(),
        ai: new ResultCache<{ type: AiType, id: number }, AiCollection>(),
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
        const query = '?reverse=true&reverseDepth=skillNp&reverseData=basic' + (
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

    buffBasic(id: number, cacheDuration?: number): Promise<BasicBuff> {
        const fetch = () => {
                return ApiConnector.fetch<BasicBuff>(
                    `${this.host}/basic/${this.region}/buff/${id}`
                );
            };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.buffBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    async changelog(): Promise<Change[]> {
        return ApiConnector.fetch<string>(
            `${this.host}/changes/${this.region}.log`
        ).then(raw => raw.split('\n').filter(Boolean).map(change => JSON.parse(change)));
    }

    commandCode(id: number, cacheDuration?: number): Promise<CommandCode> {
        const query = (this.language === Language.ENGLISH ? '?lang=en' : '');
        const fetch = () => {
            return ApiConnector.fetch<CommandCode>(
                `${this.host}/nice/${this.region}/CC/${id}${query}`
            );
        };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.commandCode.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    async commandCodeList(cacheDuration?: number): Promise<CommandCodeBasic[]> {
        let source: string;

        if (this.region === Region.JP && this.language === Language.ENGLISH) {
            source = `${this.host}/export/JP/basic_command_code_lang_en.json`;
        } else {
            source = `${this.host}/export/${this.region}/basic_command_code.json`;
        }

        const fetch = () => {
            return ApiConnector.fetch<CommandCodeBasic[]>(source);
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

    craftEssenceBasic(id: number, cacheDuration?: number): Promise<CraftEssenceBasic> {
        const query = this.language === Language.ENGLISH ? '?lang=en' : '',
            fetch = () => {
                return ApiConnector.fetch<CraftEssenceBasic>(`${this.host}/basic/${this.region}/equip/${id}${query}`);
            };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.craftEssenceBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    craftEssenceList(cacheDuration?: number): Promise<CraftEssenceBasic[]> {
        let source: string;

        if (this.region === Region.NA) {
            source = `${this.host}/export/NA/basic_equip.json`;
        } else if (this.region === Region.JP && this.language === Language.DEFAULT) {
            source = `${this.host}/export/JP/basic_equip.json`;
        } else {
            source = `${this.host}/export/JP/basic_equip_lang_en.json`;
        }

        const fetch = () => {
            return ApiConnector.fetch<CraftEssenceBasic[]>(source);
        };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.craftEssenceList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    enemy(id: number, cacheDuration?: number): Promise<Enemy> {
        const fetch = () => {
            return ApiConnector.fetch<Enemy>(
                `${this.host}/nice/${this.region}/svt/${id}?lore=true`
            );
        };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.enemy.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    event(id: number, cacheDuration?: number): Promise<Event> {
        const fetch = () => {
            return ApiConnector.fetch<Event>(
                `${this.host}/nice/${this.region}/event/${id}`
            );
        };
        if (cacheDuration === undefined)
            return fetch();
        return this.cache.event.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    eventBasic(id: number, cacheDuration?: number): Promise<EventBasic> {
        const fetch = () => {
            return ApiConnector.fetch<Event>(
                `${this.host}/basic/${this.region}/event/${id}`
            );
        };
        if (cacheDuration === undefined)
            return fetch();
        return this.cache.eventBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    func(id: number, cacheDuration?: number): Promise<Func> {
        const query = '?reverse=true&reverseDepth=servant&reverseData=basic' + (
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

    item(id: number, cacheDuration?: number): Promise<Item> {
        const fetch = () => {
            return ApiConnector.fetch<Item>(
                `${this.host}/nice/${this.region}/item/${id}`
            );
        }

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.item.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    itemList(cacheDuration?: number): Promise<Item[]> {
        const fetch = () => {
            return ApiConnector.fetch<Item[]>(
                `${this.host}/export/${this.region}/nice_item.json`
            );
        }

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.itemList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    searchItem(options: ItemSearchOptions, cacheDuration?: number): Promise<Item[]> {
        let queryParts: string[] = []

        if (options.name)
            queryParts.push("name=" + encodeURI(options.name));

        let urlParameterMap = [
            ["individuality", options.individuality],
            ["type", options.type],
            ["background", options.background],
            ["use", options.use],
        ]

        for (let [queryParameter, queryValues] of urlParameterMap) {
            if (queryValues && queryValues.length > 0) {
                for (let queryValue of queryValues) {
                    queryParts.push(`${queryParameter}=${queryValue}`);
                }
            }
        }

        let query = '?' + queryParts.join('&');

        const fetch = () => {
            return ApiConnector.fetch<Item[]>(
                `${this.host}/nice/${this.region}/item/search${query}`
            );
        }

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.searchItem.get(query, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    mysticCode(id: number, cacheDuration?: number): Promise<MysticCode> {
        const query = this.language === Language.ENGLISH ? '?lang=en' : '';

        const fetch = () => {
            return ApiConnector.fetch<MysticCode>(
                `${this.host}/nice/${this.region}/MC/${id}${query}`
            );
        }

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.mysticCode.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    mysticCodeList(cacheDuration?: number): Promise<MysticCodeBasic[]> {
        let source: string;

        if (this.region === Region.NA) {
            source = `${this.host}/export/NA/basic_mystic_code.json`;
        } else if (this.region === Region.JP && this.language === Language.DEFAULT) {
            source = `${this.host}/export/JP/basic_mystic_code.json`;
        } else {
            source = `${this.host}/export/JP/basic_mystic_code_lang_en.json`;
        }

        const fetch = () => {
            return ApiConnector.fetch<MysticCodeBasic[]>(source);
        };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.mysticCodeList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    noblePhantasm(id: number, cacheDuration?: number): Promise<NoblePhantasm> {
        const query = '?reverse=true&reverseData=basic' + (
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

    ai(type: AiType, id: number, cacheDuration?: number): Promise<AiCollection> {
        const fetch = () => {
            return ApiConnector.fetch<AiCollection>(
                `${this.host}/nice/${this.region}/ai/${type}/${id}`
            );
        }

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.ai.get({ type: type, id: id }, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    entityBasic(id: number, cacheDuration?: number): Promise<EntityBasic> {
        const query = this.language === Language.ENGLISH ? '?lang=en' : '';
        const fetch = () => {
            return ApiConnector.fetch<EntityBasic>(
                `${this.host}/basic/${this.region}/svt/${id}${query}`
            );
        };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.entityBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
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

    servantListNice(cacheDuration?: number): Promise<Servant[]> {
        let source: string;

        if (this.region === Region.NA) {
            source = `${this.host}/export/NA/nice_servant.json`;
        } else if (this.region === Region.JP && this.language === Language.DEFAULT) {
            source = `${this.host}/export/JP/nice_servant.json`;
        } else {
            source = `${this.host}/export/JP/nice_servant_lang_en.json`;
        }

        const fetch = () => {
            return ApiConnector.fetch<Servant[]>(source);
        };

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.servantListNice.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    skill(id: number, cacheDuration?: number): Promise<Skill> {
        const query = '?reverse=true&reverseData=basic' + (
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

    searchBuff(options: BuffSearchOptions): Promise<BasicBuff[]> {
        let query = "?reverse=true&reverseDepth=function";

        if (this.language === Language.ENGLISH)
            query += "&lang=en";
        if (options.name)
            query += "&name=" + encodeURI(options.name);
        if (options.type)
            query += "&type=" + options.type;

        return ApiConnector.fetch<BasicBuff[]>(
            `${this.host}/basic/${this.region}/buff/search${query}`
        );
    }

    searchEntity(options: EntitySearchOptions): Promise<EntityBasic[]> {
        const queryParts: string[] = [];

        if (this.language === Language.ENGLISH)
            queryParts.push('lang=en');
        if (options.name)
            queryParts.push('name=' + encodeURI(options.name));
        if (options.type)
            queryParts.push('type=' + options.type);
        if (options.className)
            queryParts.push('className=' + options.className);
        if (options.gender)
            queryParts.push('gender=' + options.gender);
        if (options.attribute)
            queryParts.push('attribute=' + options.attribute);
        if (options.traits && options.traits.length > 0)
            queryParts.push(...options.traits.map(trait => 'trait=' + trait));
        if (options.voiceCondSvt)
            queryParts.push('voiceCondSvt=' + options.voiceCondSvt);

        const query = '?' + queryParts.join('&');

        return ApiConnector.fetch<EntityBasic[]>(
            `${this.host}/basic/${this.region}/svt/search${query}`
        );
    }

    searchFunc(options: FuncSearchOptions): Promise<BasicFunc[]> {
        let query = "?reverse=true&reverseDepth=servant";

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

        return ApiConnector.fetch<BasicFunc[]>(
            `${this.host}/basic/${this.region}/function/search${query}`
        );
    }

    private static async fetch<T>(endpoint: string): Promise<T> {
        const response = await axios.get<T>(endpoint);

        return response.data;
    }

}

export default ApiConnector;
