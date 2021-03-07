import axios from "axios";
import Card from "./Enum/Card";
import ClassName from "./Enum/ClassName";
import Cond from "./Enum/Cond";
import Language from "./Enum/Language";
import Region from "./Enum/Region";
import ResultCache from "./ResultCache";
import { Change } from "./Schema/Change";
import { CommandCode, CommandCodeBasic } from "./Schema/CommandCode";
import { CraftEssence, CraftEssenceBasic } from "./Schema/CraftEssence";
import { Enemy } from "./Schema/Enemy";
import { Event, EventBasic, EventType } from "./Schema/Event";
import { GiftType } from "./Schema/Gift";
import { Item, ItemBackgroundType, ItemType, ItemUse } from "./Schema/Item";
import { MysticCode, MysticCodeBasic } from "./Schema/MysticCode";
import { NoblePhantasm, NoblePhantasmBasic } from "./Schema/NoblePhantasm";
import { ProfileVoiceType, VoiceCondType } from "./Schema/Profile";
import { QuestConsumeType, QuestPhase, QuestType } from "./Schema/Quest";
import { Servant, ServantBasic } from "./Schema/Servant";
import { PayType, PurchaseType, ShopType } from "./Schema/Shop";
import { Skill, SkillBasic, SkillType } from "./Schema/Skill";
import { Trait } from "./Schema/Trait";
import { War, WarBasic, WarStartType } from "./Schema/War";
import {
    AiActNum,
    AiActTarget,
    AiActType,
    AiCollection,
    AiCond,
    AiTiming,
    AiType,
} from "./Schema/Ai";
import {
    BasicBuff,
    Buff,
    BuffType,
    ClassRelationOverwriteType,
} from "./Schema/Buff";
import {
    DetailCondLinkType,
    DetailCondType,
    MissionType,
    ProgressType,
    RewardType,
} from "./Schema/Mission";
import {
    Attribute,
    EntityBasic,
    EntityType,
    EntityFlag,
    Gender,
} from "./Schema/Entity";
import {
    BasicFunc,
    Func,
    FuncTargetTeam,
    FuncTargetType,
    FuncType,
} from "./Schema/Func";

export enum ReverseData {
    BASIC = "basic",
    NICE = "nice",
}

export enum ReverseDepth {
    FUNCTION = "function",
    SKILL_NP = "skillNp",
    SERVANT = "servant",
}

type ReverseOptions = {
    reverse?: boolean;
    reverseData?: ReverseData;
    reverseDepth?: ReverseDepth;
};

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
};

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
};

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
};

type NPSearchOptions = {
    name?: string;
    card?: Card[];
    individuality?: number[];
    hits?: number[];
    strengthStatus?: number[];
    numFunctions?: number[];
    minNpNpGain?: number;
    maxNpNpGain?: number;
    reverse?: boolean;
    reverseData?: ReverseData;
    reverseDepth?: ReverseDepth;
};

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
};

type ItemSearchOptions = {
    name?: string;
    individuality?: number[];
    type?: ItemType[];
    background?: ItemBackgroundType[];
    use?: ItemUse[];
};

export interface EnumList {
    NiceSvtType: { [key: string]: EntityType };
    NiceSvtFlag: { [key: string]: EntityFlag };
    NiceSkillType: { [key: string]: SkillType };
    NiceFuncType: { [key: string]: FuncType };
    FuncApplyTarget: { [key: string]: FuncTargetTeam };
    NiceFuncTargetType: { [key: string]: FuncTargetType };
    NiceBuffType: { [key: string]: BuffType };
    NiceClassRelationOverwriteType: {
        [key: string]: ClassRelationOverwriteType;
    };
    NiceItemType: { [key: string]: ItemType };
    NiceItemBGType: { [key: string]: ItemBackgroundType };
    NiceCardType: { [key: string]: Card };
    Gender: { [key: string]: Gender };
    Attribute: { [key: string]: Attribute };
    SvtClass: { [key: string]: ClassName };
    NiceStatusRank: { [key: string]: string };
    NiceCondType: { [key: string]: Cond };
    NiceVoiceCondType: { [key: string]: VoiceCondType };
    NiceSvtVoiceType: { [key: string]: ProfileVoiceType };
    NiceQuestType: { [key: string]: QuestType };
    NiceConsumeType: { [key: string]: QuestConsumeType };
    NiceEventType: { [key: string]: EventType };
    Trait: { [key: string]: string };
    NiceWarStartType: { [key: string]: WarStartType };
    NiceGiftType: { [key: string]: GiftType };
    NicePayType: { [key: string]: PayType };
    NicePurchaseType: { [key: string]: PurchaseType };
    NiceShopType: { [key: string]: ShopType };
    NiceAiActType: { [key: string]: AiActType };
    NiceAiActTarget: { [key: string]: AiActTarget };
    NiceAiActNum: { [key: string]: AiActNum };
    NiceAiCond: { [key: string]: AiCond };
    AiTiming: { [key: string]: AiTiming };
    NiceMissionType: { [key: string]: MissionType };
    NiceMissionRewardType: { [key: string]: RewardType };
    NiceMissionProgressType: { [key: string]: ProgressType };
    NiceDetailMissionCondType: { [key: string]: DetailCondType };
    NiceDetailMissionCondLinkType: { [key: string]: DetailCondLinkType };
}

interface ApiConnectorProperties {
    host?: string;
    region?: Region;
    language?: Language;
}

interface QueryOptions {
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
        commandCodeBasic: new ResultCache<number, CommandCodeBasic>(),
        commandCodeList: new ResultCache<null, CommandCodeBasic[]>(),
        craftEssence: new ResultCache<number, CraftEssence>(),
        craftEssenceBasic: new ResultCache<number, CraftEssenceBasic>(),
        craftEssenceList: new ResultCache<null, CraftEssenceBasic[]>(),
        enemy: new ResultCache<number, Enemy>(),
        event: new ResultCache<number, Event>(),
        eventBasic: new ResultCache<number, EventBasic>(),
        eventList: new ResultCache<null, EventBasic[]>(),
        func: new ResultCache<number, Func>(),
        funcBasic: new ResultCache<number, BasicFunc>(),
        item: new ResultCache<number, Item>(),
        itemList: new ResultCache<null, Item[]>(),
        searchItem: new ResultCache<string, Item[]>(),
        mysticCode: new ResultCache<number, MysticCode>(),
        mysticCodeBasic: new ResultCache<number, MysticCodeBasic>(),
        mysticCodeList: new ResultCache<null, MysticCodeBasic[]>(),
        noblePhantasm: new ResultCache<number, NoblePhantasm>(),
        questPhase: new ResultCache<
            { id: number; phase: number },
            QuestPhase
        >(),
        entityBasic: new ResultCache<number, EntityBasic>(),
        servant: new ResultCache<number, Servant>(),
        servantList: new ResultCache<null, ServantBasic[]>(),
        servantListNice: new ResultCache<null, Servant[]>(),
        skill: new ResultCache<number, Skill>(),
        war: new ResultCache<number, War>(),
        warBasic: new ResultCache<number, WarBasic>(),
        warList: new ResultCache<null, WarBasic[]>(),
        traitList: new ResultCache<null, Trait[]>(),
        enumList: new ResultCache<null, EnumList>(),
        ai: new ResultCache<{ type: AiType; id: number }, AiCollection>(),
    };

    constructor(props?: ApiConnectorProperties) {
        const settings = Object.assign(
            {
                host: "https://api.atlasacademy.io",
                region: Region.JP,
                language: Language.DEFAULT,
            },
            props
        );

        this.host = settings.host;
        this.region = settings.region;
        this.language = settings.language;
    }

    getURLSearchParams(options: QueryOptions) {
        let searchParams = new URLSearchParams();

        for (const [key, value] of Object.entries(options)) {
            if (Array.isArray(value)) {
                for (const item of value) {
                    searchParams.append(key, item.toString());
                }
            } else if (value !== undefined) {
                searchParams.append(key, value.toString());
            }
        }

        if (this.language === Language.ENGLISH) {
            searchParams.set("lang", "en");
        }

        return searchParams;
    }

    getReverseParams(reverse?: ReverseOptions) {
        return reverse
            ? this.getURLSearchParams(reverse)
            : new URLSearchParams();
    }

    getQueryString(query: URLSearchParams) {
        const queryString = query.toString();
        return `${queryString !== "" ? "?" : ""}${queryString}`;
    }

    buff(
        id: number,
        reverse?: ReverseOptions,
        cacheDuration?: number
    ): Promise<Buff> {
        const query = this.getReverseParams(reverse);
        const fetch = () => {
            return ApiConnector.fetch<Buff>(
                `${this.host}/nice/${
                    this.region
                }/buff/${id}${this.getQueryString(query)}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.buff.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    buffBasic(
        id: number,
        reverse?: ReverseOptions,
        cacheDuration?: number
    ): Promise<BasicBuff> {
        const query = this.getReverseParams(reverse);
        const fetch = () => {
            return ApiConnector.fetch<BasicBuff>(
                `${this.host}/basic/${
                    this.region
                }/buff/${id}${this.getQueryString(query)}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.buffBasic.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    async changelog(): Promise<Change[]> {
        return ApiConnector.fetch<string>(
            `${this.host}/changes/${this.region}.log`
        ).then((raw) =>
            raw
                .split("\n")
                .filter(Boolean)
                .map((change) => JSON.parse(change))
        );
    }

    commandCode(id: number, cacheDuration?: number): Promise<CommandCode> {
        const query = this.language === Language.ENGLISH ? "?lang=en" : "";
        const fetch = () => {
            return ApiConnector.fetch<CommandCode>(
                `${this.host}/nice/${this.region}/CC/${id}${query}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.commandCode.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    commandCodeBasic(
        id: number,
        cacheDuration?: number
    ): Promise<CommandCodeBasic> {
        const query = this.language === Language.ENGLISH ? "?lang=en" : "";
        const fetch = () => {
            return ApiConnector.fetch<CommandCodeBasic>(
                `${this.host}/basic/${this.region}/CC/${id}${query}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.commandCodeBasic.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
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

        if (cacheDuration === undefined) return fetch();

        return this.cache.commandCodeList.get(
            null,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    craftEssence(
        id: number,
        lore = false,
        cacheDuration?: number
    ): Promise<CraftEssence> {
        const queryString = this.getQueryString(
            this.getURLSearchParams({ lore })
        );
        const fetch = () => {
            return ApiConnector.fetch<CraftEssence>(
                `${this.host}/nice/${this.region}/equip/${id}${queryString}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.craftEssence.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    craftEssenceBasic(
        id: number,
        cacheDuration?: number
    ): Promise<CraftEssenceBasic> {
        const query = this.language === Language.ENGLISH ? "?lang=en" : "",
            fetch = () => {
                return ApiConnector.fetch<CraftEssenceBasic>(
                    `${this.host}/basic/${this.region}/equip/${id}${query}`
                );
            };

        if (cacheDuration === undefined) return fetch();

        return this.cache.craftEssenceBasic.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    craftEssenceList(cacheDuration?: number): Promise<CraftEssenceBasic[]> {
        let source: string;

        if (this.region === Region.NA) {
            source = `${this.host}/export/NA/basic_equip.json`;
        } else if (
            this.region === Region.JP &&
            this.language === Language.DEFAULT
        ) {
            source = `${this.host}/export/JP/basic_equip.json`;
        } else {
            source = `${this.host}/export/JP/basic_equip_lang_en.json`;
        }

        const fetch = () => {
            return ApiConnector.fetch<CraftEssenceBasic[]>(source);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.craftEssenceList.get(
            null,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    enemy(id: number, lore = false, cacheDuration?: number): Promise<Enemy> {
        const queryString = this.getQueryString(
            this.getURLSearchParams({ lore })
        );
        const fetch = () => {
            return ApiConnector.fetch<Enemy>(
                `${this.host}/nice/${this.region}/svt/${id}${queryString}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.enemy.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    event(id: number, cacheDuration?: number): Promise<Event> {
        const fetch = () => {
            return ApiConnector.fetch<Event>(
                `${this.host}/nice/${this.region}/event/${id}`
            );
        };
        if (cacheDuration === undefined) return fetch();
        return this.cache.event.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    eventBasic(id: number, cacheDuration?: number): Promise<EventBasic> {
        const fetch = () => {
            return ApiConnector.fetch<Event>(
                `${this.host}/basic/${this.region}/event/${id}`
            );
        };
        if (cacheDuration === undefined) return fetch();
        return this.cache.eventBasic.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    eventList(cacheDuration?: number): Promise<EventBasic[]> {
        const fetch = () => {
            return ApiConnector.fetch<EventBasic[]>(
                `${this.host}/export/${this.region}/basic_event.json`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.eventList.get(
            null,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    war(id: number, cacheDuration?: number): Promise<War> {
        const fetch = () => {
            return ApiConnector.fetch<War>(
                `${this.host}/nice/${this.region}/war/${id}`
            );
        };
        if (cacheDuration === undefined) return fetch();
        return this.cache.war.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    warBasic(id: number, cacheDuration?: number): Promise<WarBasic> {
        const fetch = () => {
            return ApiConnector.fetch<WarBasic>(
                `${this.host}/basic/${this.region}/war/${id}`
            );
        };
        if (cacheDuration === undefined) return fetch();
        return this.cache.warBasic.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    warList(cacheDuration?: number): Promise<WarBasic[]> {
        const fetch = () => {
            return ApiConnector.fetch<WarBasic[]>(
                `${this.host}/export/${this.region}/basic_war.json`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.warList.get(
            null,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    func(
        id: number,
        reverse?: ReverseOptions,
        cacheDuration?: number
    ): Promise<Func> {
        const query = this.getReverseParams(reverse);
        const fetch = () => {
            return ApiConnector.fetch<Func>(
                `${this.host}/nice/${
                    this.region
                }/function/${id}${this.getQueryString(query)}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.func.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    funcBasic(
        id: number,
        reverse?: ReverseOptions,
        cacheDuration?: number
    ): Promise<BasicFunc> {
        const query = this.getReverseParams(reverse);
        const fetch = () => {
            return ApiConnector.fetch<BasicFunc>(
                `${this.host}/basic/${
                    this.region
                }/function/${id}${this.getQueryString(query)}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.funcBasic.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    item(id: number, cacheDuration?: number): Promise<Item> {
        const fetch = () => {
            return ApiConnector.fetch<Item>(
                `${this.host}/nice/${this.region}/item/${id}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.item.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    itemList(cacheDuration?: number): Promise<Item[]> {
        const fetch = () => {
            return ApiConnector.fetch<Item[]>(
                `${this.host}/export/${this.region}/nice_item.json`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.itemList.get(
            null,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    mysticCode(id: number, cacheDuration?: number): Promise<MysticCode> {
        const query = this.language === Language.ENGLISH ? "?lang=en" : "";

        const fetch = () => {
            return ApiConnector.fetch<MysticCode>(
                `${this.host}/nice/${this.region}/MC/${id}${query}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.mysticCode.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    mysticCodeBasic(
        id: number,
        cacheDuration?: number
    ): Promise<MysticCodeBasic> {
        const query = this.language === Language.ENGLISH ? "?lang=en" : "";

        const fetch = () => {
            return ApiConnector.fetch<MysticCodeBasic>(
                `${this.host}/basic/${this.region}/MC/${id}${query}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.mysticCodeBasic.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    mysticCodeList(cacheDuration?: number): Promise<MysticCodeBasic[]> {
        let source: string;

        if (this.region === Region.NA) {
            source = `${this.host}/export/NA/basic_mystic_code.json`;
        } else if (
            this.region === Region.JP &&
            this.language === Language.DEFAULT
        ) {
            source = `${this.host}/export/JP/basic_mystic_code.json`;
        } else {
            source = `${this.host}/export/JP/basic_mystic_code_lang_en.json`;
        }

        const fetch = () => {
            return ApiConnector.fetch<MysticCodeBasic[]>(source);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.mysticCodeList.get(
            null,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    noblePhantasm(
        id: number,
        reverse?: ReverseOptions,
        cacheDuration?: number
    ): Promise<NoblePhantasm> {
        const query = this.getReverseParams(reverse);
        const fetch = () => {
            return ApiConnector.fetch<NoblePhantasm>(
                `${this.host}/nice/${this.region}/NP/${id}${this.getQueryString(
                    query
                )}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.noblePhantasm.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    questPhase(
        id: number,
        phase: number,
        cacheDuration?: number
    ): Promise<QuestPhase> {
        const fetch = () => {
            return ApiConnector.fetch<QuestPhase>(
                `${this.host}/nice/${this.region}/quest/${id}/${phase}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.questPhase.get(
            { id, phase },
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    ai(
        type: AiType,
        id: number,
        cacheDuration?: number
    ): Promise<AiCollection> {
        const fetch = () => {
            return ApiConnector.fetch<AiCollection>(
                `${this.host}/nice/${this.region}/ai/${type}/${id}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.ai.get(
            { type: type, id: id },
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    entityBasic(id: number, cacheDuration?: number): Promise<EntityBasic> {
        const query = this.language === Language.ENGLISH ? "?lang=en" : "";
        const fetch = () => {
            return ApiConnector.fetch<EntityBasic>(
                `${this.host}/basic/${this.region}/svt/${id}${query}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.entityBasic.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    servant(
        id: number,
        lore = false,
        cacheDuration?: number
    ): Promise<Servant> {
        const queryString = this.getQueryString(
            this.getURLSearchParams({ lore })
        );
        const fetch = () => {
            return ApiConnector.fetch<Servant>(
                `${this.host}/nice/${this.region}/servant/${id}${queryString}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.servant.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    servantList(cacheDuration?: number): Promise<ServantBasic[]> {
        let source: string;

        if (this.region === Region.NA) {
            source = `${this.host}/export/NA/basic_servant.json`;
        } else if (
            this.region === Region.JP &&
            this.language === Language.DEFAULT
        ) {
            source = `${this.host}/export/JP/basic_servant.json`;
        } else {
            source = `${this.host}/export/JP/basic_servant_lang_en.json`;
        }

        const fetch = () => {
            return ApiConnector.fetch<ServantBasic[]>(source);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.servantList.get(
            null,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    servantListNice(cacheDuration?: number): Promise<Servant[]> {
        let source: string;

        if (this.region === Region.NA) {
            source = `${this.host}/export/NA/nice_servant.json`;
        } else if (
            this.region === Region.JP &&
            this.language === Language.DEFAULT
        ) {
            source = `${this.host}/export/JP/nice_servant.json`;
        } else {
            source = `${this.host}/export/JP/nice_servant_lang_en.json`;
        }

        const fetch = () => {
            return ApiConnector.fetch<Servant[]>(source);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.servantListNice.get(
            null,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    skill(
        id: number,
        reverse?: ReverseOptions,
        cacheDuration?: number
    ): Promise<Skill> {
        const query = this.getReverseParams(reverse);
        const fetch = () => {
            return ApiConnector.fetch<Skill>(
                `${this.host}/nice/${
                    this.region
                }/skill/${id}${this.getQueryString(query)}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.skill.get(
            id,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    traitList(cacheDuration?: number): Promise<Trait[]> {
        const fetch = async () => {
            const traitMap = await ApiConnector.fetch<{
                [key: number]: string;
            }>(`${this.host}/export/${this.region}/nice_trait.json`);

            return Object.keys(traitMap).map((key) => {
                const id = parseInt(key);

                return {
                    id: id,
                    name: traitMap[id],
                };
            });
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.traitList.get(
            null,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    enumList(cacheDuration?: number): Promise<EnumList> {
        const fetch = async () => {
            const enumMap = await ApiConnector.fetch<EnumList>(
                `${this.host}/export/${this.region}/nice_enums.json`
            );

            return enumMap;
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.enumList.get(
            null,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    searchBuff(options: BuffSearchOptions): Promise<BasicBuff[]> {
        const searchParams = this.getURLSearchParams(options);

        return ApiConnector.fetch<BasicBuff[]>(
            `${this.host}/basic/${
                this.region
            }/buff/search?${searchParams.toString()}`
        );
    }

    searchFunc(options: FuncSearchOptions): Promise<BasicFunc[]> {
        const searchParams = this.getURLSearchParams(options);

        return ApiConnector.fetch<BasicFunc[]>(
            `${this.host}/basic/${
                this.region
            }/function/search?${searchParams.toString()}`
        );
    }

    searchSkill(options: SkillSearchOptions): Promise<SkillBasic[]> {
        const searchParams = this.getURLSearchParams(options);

        return ApiConnector.fetch<SkillBasic[]>(
            `${this.host}/basic/${
                this.region
            }/skill/search?${searchParams.toString()}`
        );
    }

    searchNP(options: NPSearchOptions): Promise<NoblePhantasmBasic[]> {
        const searchParams = this.getURLSearchParams(options);

        return ApiConnector.fetch<SkillBasic[]>(
            `${this.host}/basic/${
                this.region
            }/NP/search?${searchParams.toString()}`
        );
    }

    searchEntity(options: EntitySearchOptions): Promise<EntityBasic[]> {
        const searchParams = this.getURLSearchParams(options);

        return ApiConnector.fetch<EntityBasic[]>(
            `${this.host}/basic/${
                this.region
            }/svt/search?${searchParams.toString()}`
        );
    }

    searchItem(
        options: ItemSearchOptions,
        cacheDuration?: number
    ): Promise<Item[]> {
        const searchParams = this.getURLSearchParams(options);
        let searchQuery = searchParams.toString();

        const fetch = () => {
            return ApiConnector.fetch<Item[]>(
                `${this.host}/nice/${this.region}/item/search?${searchQuery}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.searchItem.get(
            searchQuery,
            fetch,
            cacheDuration <= 0 ? null : cacheDuration
        );
    }

    private static async fetch<T>(endpoint: string): Promise<T> {
        const response = await axios.get<T>(endpoint);

        return response.data;
    }
}

export default ApiConnector;
