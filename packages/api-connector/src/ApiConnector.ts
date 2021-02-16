import axios from 'axios';
import ClassName from "./Enum/ClassName";
import Language from "./Enum/Language";
import Region from "./Enum/Region";
import Card from "./Enum/Card";
import ResultCache from "./ResultCache";
import {BasicBuff, Buff, BuffType} from "./Schema/Buff";
import {CommandCode, CommandCodeBasic} from "./Schema/CommandCode";
import {Change} from "./Schema/Change";
import {CraftEssence, CraftEssenceBasic} from "./Schema/CraftEssence";
import {Enemy} from "./Schema/Enemy";
import {Attribute, EntityBasic, EntityType, EntityFlag, Gender} from "./Schema/Entity";
import {Event, EventBasic} from "./Schema/Event";
import {BasicFunc, Func, FuncTargetTeam, FuncTargetType, FuncType} from "./Schema/Func";
import {Item, ItemType, ItemBackgroundType, ItemUse} from "./Schema/Item";
import {MysticCode, MysticCodeBasic} from "./Schema/MysticCode";
import {NoblePhantasm, NoblePhantasmBasic} from "./Schema/NoblePhantasm";
import {QuestPhase} from "./Schema/Quest";
import {Servant, ServantBasic} from "./Schema/Servant";
import {Skill, SkillBasic, SkillType} from "./Schema/Skill";
import {Trait} from "./Schema/Trait";
import {AiType, AiCollection} from "./Schema/Ai";
import {War, WarBasic} from "./Schema/War";

enum ReverseData {
    BASIC = "basic",
    NICE = "nice",
}

enum ReverseDepth {
    FUNCTION = "function",
    SKILL_NP = "skillNp",
    SERVANT = "servant",
}

type BuffSearchOptions = {
    name?: string;
    type?: BuffType[];
    buffGroup?: number[];
    vals?: number[];
    tvals?: number[];
    ckSelfIndv?: number[];
    ckOpIndv?: number[];
    reverse?: boolean;
    reverseData?: ReverseData;
    reverseDepth?: ReverseDepth;
}

type FuncSearchOptions = {
    popupText?: string;
    type?: FuncType[];
    targetType?: FuncTargetType[];
    targetTeam?: FuncTargetTeam[];
    vals?: number[];
    tvals?: number[];
    questTvals?: number[];
    reverse?: boolean;
    reverseData?: ReverseData;
    reverseDepth?: ReverseDepth;
}

type SkillSearchOptions = {
    name?: string;
    type?: SkillType[];
    num?: number[];
    priority?: number[];
    strengthStatus?: number[];
    lvl1coolDown?: number[];
    numFunctions?: number[];
    reverse?: boolean;
    reverseData?: ReverseData;
    reverseDepth?: ReverseDepth;
}

type NPSearchOptions = {
    name?: string;
    card?: Card[];
    individuality?: number[];
    hits?: number[];
    strengthStatus?: number[];
    numFunctions?: number[];
    minNpNpGain?: number[];
    maxNpNpGain?: number[];
    reverse?: boolean;
    reverseData?: ReverseData;
    reverseDepth?: ReverseDepth;
}

type EntitySearchOptions = {
    name?: string;
    excludeCollectionNo?: number[];
    type?: EntityType[];
    flag?: EntityFlag[];
    rarity?: number[];
    className?: ClassName[];
    gender?: Gender[];
    attribute?: Attribute[];
    trait?: number[];
    voiceCondSvt?: number[];
}

type ItemSearchOptions = {
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

interface SearchOptions {
    [key: string]: string | string[] | number | number[] | boolean | undefined;
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
        war: new ResultCache<number, War>(),
        warBasic: new ResultCache<number, WarBasic>(),
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

    war(id: number, cacheDuration?: number): Promise<War> {
        const fetch = () => {
            return ApiConnector.fetch<War>(
                `${this.host}/nice/${this.region}/war/${id}`
            );
        };
        if (cacheDuration === undefined)
            return fetch();
        return this.cache.war.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    warBasic(id: number, cacheDuration?: number): Promise<WarBasic> {
        const fetch = () => {
            return ApiConnector.fetch<WarBasic>(
                `${this.host}/basic/${this.region}/war/${id}`
            );
        };
        if (cacheDuration === undefined)
            return fetch();
        return this.cache.warBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
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

    getURLSearchParams(options: SearchOptions) {
        let searchParams = new URLSearchParams();

        for (const [key, value] of Object.entries(options)) {
            if (Array.isArray(value)) {
                for (const item of value) {
                    searchParams.append(key, item.toString());
                }
            } else if (value !== undefined) {
                searchParams.append(key, value.toString())
            }
        }

        if (this.language === Language.ENGLISH)
            searchParams.set("lang", "en")

        return searchParams;
    }

    searchBuff(options: BuffSearchOptions): Promise<BasicBuff[]> {
        if (options.reverse === undefined)
            options.reverse = true;
        if (options.reverseDepth === undefined)
            options.reverseDepth = ReverseDepth.FUNCTION;

        const searchParams = this.getURLSearchParams(options);

        return ApiConnector.fetch<BasicBuff[]>(
            `${this.host}/basic/${this.region}/buff/search?${searchParams.toString()}`
        );
    }

    searchFunc(options: FuncSearchOptions): Promise<BasicFunc[]> {
        if (options.reverse === undefined)
            options.reverse = true;
        if (options.reverseDepth === undefined)
            options.reverseDepth = ReverseDepth.SERVANT;

        const searchParams = this.getURLSearchParams(options);

        return ApiConnector.fetch<BasicFunc[]>(
            `${this.host}/basic/${this.region}/function/search?${searchParams.toString()}`
        );
    }

    searchSkill(options: SkillSearchOptions): Promise<SkillBasic[]> {
        if (options.reverse === undefined)
            options.reverse = true;
        if (options.reverseDepth === undefined)
            options.reverseDepth = ReverseDepth.SERVANT;

        const searchParams = this.getURLSearchParams(options);

        return ApiConnector.fetch<SkillBasic[]>(
            `${this.host}/basic/${this.region}/skill/search?${searchParams.toString()}`
        );
    }

    searchNP(options: NPSearchOptions): Promise<NoblePhantasmBasic[]> {
        if (options.reverse === undefined)
            options.reverse = true;
        if (options.reverseDepth === undefined)
            options.reverseDepth = ReverseDepth.SERVANT;

        const searchParams = this.getURLSearchParams(options);

        return ApiConnector.fetch<SkillBasic[]>(
            `${this.host}/basic/${this.region}/NP/search?${searchParams.toString()}`
        );
    }

    searchEntity(options: EntitySearchOptions): Promise<EntityBasic[]> {
        const searchParams = this.getURLSearchParams(options);

        return ApiConnector.fetch<EntityBasic[]>(
            `${this.host}/basic/${this.region}/svt/search?${searchParams.toString()}`
        );
    }

    searchItem(options: ItemSearchOptions, cacheDuration?: number): Promise<Item[]> {
        const searchParams = this.getURLSearchParams(options);
        let searchQuery = searchParams.toString();

        const fetch = () => {
            return ApiConnector.fetch<Item[]>(
                `${this.host}/nice/${this.region}/item/search?${searchQuery}`
            );
        }

        if (cacheDuration === undefined)
            return fetch();

        return this.cache.searchItem.get(searchQuery, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    private static async fetch<T>(endpoint: string): Promise<T> {
        const response = await axios.get<T>(endpoint);

        return response.data;
    }

}

export default ApiConnector;
