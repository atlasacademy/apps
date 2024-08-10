import axios from "axios";

import Card, { CardConstantMap } from "./Enum/Card";
import ClassName from "./Enum/ClassName";
import { ClassAffinityMap, ClassAttackRateMap } from "./Enum/ClassName";
import Cond from "./Enum/Cond";
import Language from "./Enum/Language";
import Region from "./Enum/Region";
import ResultCache from "./ResultCache";
import { AiActNum, AiActTarget, AiActType, AiCollection, AiCond, AiTiming, AiType } from "./Schema/Ai";
import { Attribute, AttributeAffinityMap } from "./Schema/Attribute";
import { BgmEntity } from "./Schema/Bgm";
import {
    BasicBuff,
    Buff,
    BuffConstantMap,
    BuffSearchOptions,
    BuffType,
    ClassRelationOverwriteType,
} from "./Schema/Buff";
import { Change } from "./Schema/Change";
import { ClassBoard } from "./Schema/ClassBoard";
import { CommandCode, CommandCodeBasic } from "./Schema/CommandCode";
import { CommonRelease } from "./Schema/CommonRelease";
import { Constants } from "./Schema/Constant";
import { ConstantStrs } from "./Schema/ConstantStr";
import { CraftEssence, CraftEssenceBasic } from "./Schema/CraftEssence";
import { Cv } from "./Schema/Cv";
import { Enemy } from "./Schema/Enemy";
import { EnemyMaster } from "./Schema/EnemyMaster";
import { EntityBasic, EntityFlag, EntitySearchOptions, EntityType, Gender } from "./Schema/Entity";
import { Event, EventAlloutBattle, EventBasic, EventType } from "./Schema/Event";
import { BasicFunc, Func, FuncSearchOptions, FuncTargetTeam, FuncTargetType, FuncType } from "./Schema/Func";
import { Gacha } from "./Schema/Gacha";
import { GiftType } from "./Schema/Gift";
import { Illustrator } from "./Schema/Illustrator";
import { Info } from "./Schema/Info";
import { Item, ItemBackgroundType, ItemSearchOptions, ItemType } from "./Schema/Item";
import { MasterLevelInfoMap } from "./Schema/Master";
import { MasterMission } from "./Schema/MasterMission";
import { DetailCondLinkType, MissionType, ProgressType, RewardType } from "./Schema/Mission";
import { MysticCode, MysticCodeBasic } from "./Schema/MysticCode";
import { NPSearchOptions, NoblePhantasm, NoblePhantasmBasic } from "./Schema/NoblePhantasm";
import { ProfileVoiceType, VoiceCondType } from "./Schema/Profile";
import {
    Quest,
    QuestBasic,
    QuestConsumeType,
    QuestPhase,
    QuestPhaseBasic,
    QuestPhaseSearchOptions,
    QuestType,
} from "./Schema/Quest";
import { Script, ScriptSearchOptions, ScriptSearchResult, SvtScript } from "./Schema/Script";
import { GrailCostInfoMap, Servant, ServantBasic, ServantWithLore } from "./Schema/Servant";
import { PayType, PurchaseType, Shop, ShopSearchOptions, ShopType } from "./Schema/Shop";
import { Skill, SkillBasic, SkillSearchOptions, SkillType } from "./Schema/Skill";
import { Trait } from "./Schema/Trait";
import { War, WarBasic, WarStartType } from "./Schema/War";

export enum ReverseData {
    BASIC = "basic",
    NICE = "nice",
}

export enum ReverseDepth {
    FUNCTION = "function",
    SKILL_NP = "skillNp",
    SERVANT = "servant",
}

export type ReverseOptions = {
    reverse?: boolean;
    reverseData?: ReverseData;
    reverseDepth?: ReverseDepth;
};

export type DataType = "raw" | "nice" | "basic";

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
        ai: new ResultCache<{ type: AiType; id: number }, AiCollection>(),
        attributeAffinityMap: new ResultCache<null, AttributeAffinityMap>(),
        bgm: new ResultCache<string, BgmEntity>(),
        bgmList: new ResultCache<null, BgmEntity[]>(),
        buff: new ResultCache<number, Buff>(),
        buffBasic: new ResultCache<number, BasicBuff>(),
        buffConstantMap: new ResultCache<null, BuffConstantMap>(),
        buffSearch: new ResultCache<string, BasicBuff[]>(),
        cardConstantMap: new ResultCache<null, CardConstantMap>(),
        classAffinityMap: new ResultCache<null, ClassAffinityMap>(),
        classAttackRateMap: new ResultCache<null, ClassAttackRateMap>(),
        classBoard: new ResultCache<number, ClassBoard>(),
        classBoardList: new ResultCache<null, ClassBoard[]>(),
        commandCode: new ResultCache<number, CommandCode>(),
        commandCodeBasic: new ResultCache<number, CommandCodeBasic>(),
        commandCodeList: new ResultCache<null, CommandCodeBasic[]>(),
        constantStrs: new ResultCache<null, ConstantStrs>(),
        constants: new ResultCache<null, Constants>(),
        craftEssence: new ResultCache<number, CraftEssence>(),
        craftEssenceBasic: new ResultCache<number, CraftEssenceBasic>(),
        craftEssenceList: new ResultCache<null, CraftEssenceBasic[]>(),
        commonRelease: new ResultCache<number, CommonRelease[]>(),
        cvList: new ResultCache<null, Cv[]>(),
        enemy: new ResultCache<number, Enemy>(),
        enemyMaster: new ResultCache<number, EnemyMaster>(),
        entityBasic: new ResultCache<number, EntityBasic>(),
        entityList: new ResultCache<null, EntityBasic[]>(),
        entitySearch: new ResultCache<string, EntityBasic[]>(),
        enumList: new ResultCache<null, EnumList>(),
        event: new ResultCache<number, Event>(),
        eventBasic: new ResultCache<number, EventBasic>(),
        eventList: new ResultCache<null, EventBasic[]>(),
        eventAlloutBattle: new ResultCache<string, EventAlloutBattle[]>(),
        func: new ResultCache<number, Func>(),
        funcBasic: new ResultCache<number, BasicFunc>(),
        funcSearch: new ResultCache<string, BasicFunc[]>(),
        gacha: new ResultCache<number, Gacha>(),
        gachaList: new ResultCache<null, Gacha[]>(),
        grailCostInfoMap: new ResultCache<null, GrailCostInfoMap>(),
        illustratorList: new ResultCache<null, Illustrator[]>(),
        item: new ResultCache<number, Item>(),
        itemList: new ResultCache<null, Item[]>(),
        masterLevelInfoMap: new ResultCache<null, MasterLevelInfoMap>(),
        masterMission: new ResultCache<number, MasterMission>(),
        masterMissionList: new ResultCache<null, MasterMission[]>(),
        mysticCode: new ResultCache<number, MysticCode>(),
        mysticCodeBasic: new ResultCache<number, MysticCodeBasic>(),
        mysticCodeList: new ResultCache<null, MysticCodeBasic[]>(),
        noblePhantasm: new ResultCache<number, NoblePhantasm>(),
        noblePhantasmBasic: new ResultCache<number, NoblePhantasmBasic>(),
        npSearch: new ResultCache<string, NoblePhantasmBasic[]>(),
        quest: new ResultCache<number, Quest>(),
        questBasic: new ResultCache<number, QuestBasic>(),
        questPhase: new ResultCache<{ id: number; phase: number; hash?: string }, QuestPhase>(),
        questPhaseBasic: new ResultCache<number, QuestPhaseBasic>(),
        script: new ResultCache<string, Script>(),
        searchItem: new ResultCache<string, Item[]>(),
        searchQuestPhase: new ResultCache<string, QuestPhaseBasic[]>(),
        searchScript: new ResultCache<string, ScriptSearchResult[]>(),
        servant: new ResultCache<number, Servant>(),
        servantList: new ResultCache<null, ServantBasic[]>(),
        servantListNice: new ResultCache<null, Servant[]>(),
        servantListNiceWithLore: new ResultCache<null, ServantWithLore[]>(),
        shop: new ResultCache<number, Shop>(),
        shopSearch: new ResultCache<string, Shop[]>(),
        shopList: new ResultCache<null, Shop[]>(),
        skill: new ResultCache<number, Skill>(),
        skillBasic: new ResultCache<number, SkillBasic>(),
        skillSearch: new ResultCache<string, SkillBasic[]>(),
        svtScript: new ResultCache<string, SvtScript[]>(),
        traitList: new ResultCache<null, Trait[]>(),
        war: new ResultCache<number, War>(),
        warBasic: new ResultCache<number, WarBasic>(),
        warList: new ResultCache<null, WarBasic[]>(),
        warListNice: new ResultCache<null, War[]>(),
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

        return searchParams;
    }

    getReverseParams(reverse?: ReverseOptions) {
        return reverse ? this.getURLSearchParams(reverse) : new URLSearchParams();
    }

    getQueryString(query: URLSearchParams) {
        if (this.language === Language.ENGLISH) {
            query.set("lang", "en");
        }
        const queryString = query.toString();
        return `${queryString !== "" ? "?" : ""}${queryString}`;
    }

    showJPdataWithEnglishText() {
        return this.region === Region.JP && this.language === Language.ENGLISH;
    }

    getPath(dataType: DataType, entity: string, id: string | number, query: QueryOptions): string {
        return `/${dataType}/${this.region}/${entity}/${id}${this.getQueryString(this.getURLSearchParams(query))}`;
    }

    getUrl(dataType: DataType, entity: string, id: string | number, query: QueryOptions): string {
        return this.host + this.getPath(dataType, entity, id, query);
    }

    buff(id: number, reverse?: ReverseOptions, cacheDuration?: number): Promise<Buff> {
        const url = this.getUrl("nice", "buff", id, reverse ?? {});
        const fetch = () => {
            return ApiConnector.fetch<Buff>(url);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.buff.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    buffBasic(id: number, reverse?: ReverseOptions, cacheDuration?: number): Promise<BasicBuff> {
        const query = this.getQueryString(this.getReverseParams(reverse));
        const fetch = () => {
            return ApiConnector.fetch<BasicBuff>(`${this.host}/basic/${this.region}/buff/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.buffBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    async changelog(): Promise<Change[]> {
        return ApiConnector.fetch<string>(`${this.host}/changes/${this.region}.log`).then((raw) =>
            raw
                .split("\n")
                .filter(Boolean)
                .map((change) => JSON.parse(change))
        );
    }

    async questEnemyChangelog(): Promise<QuestPhaseBasic[]> {
        const query = this.getQueryString(new URLSearchParams());
        return ApiConnector.fetch<QuestPhaseBasic[]>(
            `${this.host}/basic/${this.region}/quest/phase/latestEnemyData${query}`
        );
    }

    bgm(id: number, cacheDuration?: number, fileName?: string): Promise<BgmEntity> {
        const params = new URLSearchParams();
        if (fileName) {
            params.append("fileName", fileName);
        }
        const query = this.getQueryString(params);
        const fetch = () => {
            return ApiConnector.fetch<BgmEntity>(`${this.host}/nice/${this.region}/bgm/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        const cacheKey = `${id}${fileName || ""}`;

        return this.cache.bgm.get(cacheKey, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    bgmList(cacheDuration?: number): Promise<BgmEntity[]> {
        let source: string;

        if (this.showJPdataWithEnglishText()) {
            source = `${this.host}/export/JP/nice_bgm_lang_en.json`;
        } else {
            source = `${this.host}/export/${this.region}/nice_bgm.json`;
        }

        const fetch = () => {
            return ApiConnector.fetch<BgmEntity[]>(source);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.bgmList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    commandCode(id: number, cacheDuration?: number): Promise<CommandCode> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<CommandCode>(`${this.host}/nice/${this.region}/CC/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.commandCode.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    commandCodeBasic(id: number, cacheDuration?: number): Promise<CommandCodeBasic> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<CommandCodeBasic>(`${this.host}/basic/${this.region}/CC/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.commandCodeBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    async commandCodeList(cacheDuration?: number): Promise<CommandCodeBasic[]> {
        let source: string;

        if (this.showJPdataWithEnglishText()) {
            source = `${this.host}/export/JP/basic_command_code_lang_en.json`;
        } else {
            source = `${this.host}/export/${this.region}/basic_command_code.json`;
        }

        const fetch = () => {
            return ApiConnector.fetch<CommandCodeBasic[]>(source);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.commandCodeList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    craftEssence(id: number, lore = false, cacheDuration?: number): Promise<CraftEssence> {
        const queryString = this.getQueryString(this.getURLSearchParams({ lore }));
        const fetch = () => {
            return ApiConnector.fetch<CraftEssence>(`${this.host}/nice/${this.region}/equip/${id}${queryString}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.craftEssence.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    craftEssenceBasic(id: number, cacheDuration?: number): Promise<CraftEssenceBasic> {
        const query = this.getQueryString(new URLSearchParams()),
            fetch = () => {
                return ApiConnector.fetch<CraftEssenceBasic>(`${this.host}/basic/${this.region}/equip/${id}${query}`);
            };

        if (cacheDuration === undefined) return fetch();

        return this.cache.craftEssenceBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    craftEssenceList(cacheDuration?: number): Promise<CraftEssenceBasic[]> {
        let source: string;

        if (this.showJPdataWithEnglishText()) {
            source = `${this.host}/export/JP/basic_equip_lang_en.json`;
        } else {
            source = `${this.host}/export/${this.region}/basic_equip.json`;
        }

        const fetch = () => ApiConnector.fetch<CraftEssenceBasic[]>(source);

        if (cacheDuration === undefined) return fetch();

        return this.cache.craftEssenceList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    enemy(id: number, lore = false, cacheDuration?: number): Promise<Enemy> {
        const queryString = this.getQueryString(this.getURLSearchParams({ lore }));
        const fetch = () => {
            return ApiConnector.fetch<Enemy>(`${this.host}/nice/${this.region}/svt/${id}${queryString}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.enemy.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    masterMission(id: number, cacheDuration?: number): Promise<MasterMission> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<MasterMission>(`${this.host}/nice/${this.region}/mm/${id}${query}`);
        };
        if (cacheDuration === undefined) return fetch();
        return this.cache.masterMission.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    masterMissionList(cacheDuration?: number): Promise<MasterMission[]> {
        let source = `${this.host}/export/${this.region}/nice_master_mission.json`;

        const fetch = () => ApiConnector.fetch<MasterMission[]>(source);

        if (cacheDuration === undefined) return fetch();

        return this.cache.masterMissionList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    event(id: number, cacheDuration?: number): Promise<Event> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<Event>(`${this.host}/nice/${this.region}/event/${id}${query}`);
        };
        if (cacheDuration === undefined) return fetch();
        return this.cache.event.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    eventBasic(id: number, cacheDuration?: number): Promise<EventBasic> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<Event>(`${this.host}/basic/${this.region}/event/${id}${query}`);
        };
        if (cacheDuration === undefined) return fetch();
        return this.cache.eventBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    eventList(cacheDuration?: number): Promise<EventBasic[]> {
        let source: string;

        if (this.showJPdataWithEnglishText()) {
            source = `${this.host}/export/JP/basic_event_lang_en.json`;
        } else {
            source = `${this.host}/export/${this.region}/basic_event.json`;
        }

        const fetch = () => ApiConnector.fetch<EventBasic[]>(source);

        if (cacheDuration === undefined) return fetch();

        return this.cache.eventList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    war(id: number, cacheDuration?: number): Promise<War> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<War>(`${this.host}/nice/${this.region}/war/${id}${query}`);
        };
        if (cacheDuration === undefined) return fetch();
        return this.cache.war.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    warBasic(id: number, cacheDuration?: number): Promise<WarBasic> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<WarBasic>(`${this.host}/basic/${this.region}/war/${id}${query}`);
        };
        if (cacheDuration === undefined) return fetch();
        return this.cache.warBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    warList(cacheDuration?: number): Promise<WarBasic[]> {
        let source: string;

        if (this.showJPdataWithEnglishText()) {
            source = `${this.host}/export/JP/basic_war_lang_en.json`;
        } else {
            source = `${this.host}/export/${this.region}/basic_war.json`;
        }

        const fetch = () => ApiConnector.fetch<WarBasic[]>(source);

        if (cacheDuration === undefined) return fetch();

        return this.cache.warList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    warListNice(cacheDuration?: number): Promise<War[]> {
        let source: string;

        if (this.showJPdataWithEnglishText()) {
            source = `${this.host}/export/JP/nice_war_lang_en.json`;
        } else {
            source = `${this.host}/export/${this.region}/nice_war.json`;
        }

        const fetch = () => ApiConnector.fetch<War[]>(source);

        if (cacheDuration === undefined) return fetch();

        return this.cache.warListNice.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    func(id: number, reverse?: ReverseOptions, cacheDuration?: number): Promise<Func> {
        const query = this.getQueryString(this.getReverseParams(reverse));
        const fetch = () => {
            return ApiConnector.fetch<Func>(`${this.host}/nice/${this.region}/function/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.func.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    funcBasic(id: number, reverse?: ReverseOptions, cacheDuration?: number): Promise<BasicFunc> {
        const query = this.getQueryString(this.getReverseParams(reverse));
        const fetch = () => {
            return ApiConnector.fetch<BasicFunc>(`${this.host}/basic/${this.region}/function/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.funcBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    item(id: number, cacheDuration?: number): Promise<Item> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<Item>(`${this.host}/nice/${this.region}/item/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.item.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    itemList(cacheDuration?: number): Promise<Item[]> {
        let source: string;
        if (this.showJPdataWithEnglishText()) {
            source = `${this.host}/export/JP/nice_item_lang_en.json`;
        } else {
            source = `${this.host}/export/${this.region}/nice_item.json`;
        }

        const fetch = () => ApiConnector.fetch<Item[]>(source);

        if (cacheDuration === undefined) return fetch();

        return this.cache.itemList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    illustratorList(cacheDuration?: number): Promise<Illustrator[]> {
        let source: string;
        if (this.showJPdataWithEnglishText()) {
            source = `${this.host}/export/JP/nice_illustrator_lang_en.json`;
        } else {
            source = `${this.host}/export/${this.region}/nice_illustrator.json`;
        }

        const fetch = () => ApiConnector.fetch<Illustrator[]>(source);

        if (cacheDuration === undefined) return fetch();

        return this.cache.illustratorList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    cvList(cacheDuration?: number): Promise<Cv[]> {
        let source: string;
        if (this.showJPdataWithEnglishText()) {
            source = `${this.host}/export/JP/nice_cv_lang_en.json`;
        } else {
            source = `${this.host}/export/${this.region}/nice_cv.json`;
        }

        const fetch = () => ApiConnector.fetch<Cv[]>(source);

        if (cacheDuration === undefined) return fetch();

        return this.cache.cvList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    mysticCode(id: number, cacheDuration?: number): Promise<MysticCode> {
        const query = this.getQueryString(new URLSearchParams());

        const fetch = () => {
            return ApiConnector.fetch<MysticCode>(`${this.host}/nice/${this.region}/MC/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.mysticCode.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    mysticCodeBasic(id: number, cacheDuration?: number): Promise<MysticCodeBasic> {
        const query = this.getQueryString(new URLSearchParams());

        const fetch = () => {
            return ApiConnector.fetch<MysticCodeBasic>(`${this.host}/basic/${this.region}/MC/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.mysticCodeBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    mysticCodeList(cacheDuration?: number): Promise<MysticCodeBasic[]> {
        let source: string;
        if (this.showJPdataWithEnglishText()) {
            source = `${this.host}/export/JP/basic_mystic_code_lang_en.json`;
        } else {
            source = `${this.host}/export/${this.region}/basic_mystic_code.json`;
        }

        const fetch = () => ApiConnector.fetch<MysticCodeBasic[]>(source);

        if (cacheDuration === undefined) return fetch();

        return this.cache.mysticCodeList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    noblePhantasm(id: number, reverse?: ReverseOptions, cacheDuration?: number): Promise<NoblePhantasm> {
        const query = this.getQueryString(this.getReverseParams(reverse));
        const fetch = () => {
            return ApiConnector.fetch<NoblePhantasm>(`${this.host}/nice/${this.region}/NP/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.noblePhantasm.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    noblePhantasmBasic(id: number, reverse?: ReverseOptions, cacheDuration?: number): Promise<NoblePhantasmBasic> {
        const query = this.getQueryString(this.getReverseParams(reverse));
        const fetch = () => {
            return ApiConnector.fetch<NoblePhantasmBasic>(`${this.host}/basic/${this.region}/NP/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.noblePhantasmBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    quest(id: number, cacheDuration?: number): Promise<Quest> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<Quest>(`${this.host}/nice/${this.region}/quest/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.quest.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    questPhase(id: number, phase: number, hash?: string, cacheDuration?: number): Promise<QuestPhase> {
        const queryParams = new URLSearchParams();
        if (hash) queryParams.append("hash", hash);
        const query = this.getQueryString(queryParams);

        const fetch = () => {
            return ApiConnector.fetch<QuestPhase>(`${this.host}/nice/${this.region}/quest/${id}/${phase}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.questPhase.get({ id, phase, hash }, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    questBasic(id: number, cacheDuration?: number): Promise<QuestBasic> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<QuestBasic>(`${this.host}/basic/${this.region}/quest/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.questBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    questPhaseBasic(id: number, phase: number, cacheDuration?: number): Promise<QuestPhaseBasic> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<QuestPhaseBasic>(
                `${this.host}/basic/${this.region}/quest/${id}/${phase}${query}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.questPhaseBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    script(id: string, cacheDuration?: number): Promise<Script> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<Script>(`${this.host}/nice/${this.region}/script/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.script.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    ai(type: AiType, id: number, cacheDuration?: number): Promise<AiCollection> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<AiCollection>(`${this.host}/nice/${this.region}/ai/${type}/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.ai.get({ type: type, id: id }, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    entityBasic(id: number, cacheDuration?: number): Promise<EntityBasic> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<EntityBasic>(`${this.host}/basic/${this.region}/svt/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.entityBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    entityList(cacheDuration?: number): Promise<EntityBasic[]> {
        let source: string;
        if (this.showJPdataWithEnglishText()) {
            source = `${this.host}/export/JP/basic_svt_lang_en.json`;
        } else {
            source = `${this.host}/export/${this.region}/basic_svt.json`;
        }

        const fetch = () => ApiConnector.fetch<EntityBasic[]>(source);

        if (cacheDuration === undefined) return fetch();

        return this.cache.entityList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    servant(id: number, lore?: false, cacheDuration?: number): Promise<Servant>;
    servant(id: number, lore: true, cacheDuration?: number): Promise<ServantWithLore>;
    servant(id: number, lore = false, cacheDuration?: number): Promise<Servant> {
        const queryString = this.getQueryString(this.getURLSearchParams({ lore }));
        const fetch = () => {
            return ApiConnector.fetch<Servant>(`${this.host}/nice/${this.region}/servant/${id}${queryString}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.servant.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    servantList(cacheDuration?: number): Promise<ServantBasic[]> {
        let source: string;
        if (this.showJPdataWithEnglishText()) {
            source = `${this.host}/export/JP/basic_servant_lang_en.json`;
        } else {
            source = `${this.host}/export/${this.region}/basic_servant.json`;
        }

        const fetch = () => ApiConnector.fetch<ServantBasic[]>(source);

        if (cacheDuration === undefined) return fetch();

        return this.cache.servantList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    servantListNice(cacheDuration?: number): Promise<Servant[]> {
        let source: string;
        if (this.showJPdataWithEnglishText()) {
            source = `${this.host}/export/JP/nice_servant_lang_en.json`;
        } else {
            source = `${this.host}/export/${this.region}/nice_servant.json`;
        }

        const fetch = () => ApiConnector.fetch<Servant[]>(source);

        if (cacheDuration === undefined) return fetch();

        return this.cache.servantListNice.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    servantListNiceWithLore(cacheDuration?: number): Promise<ServantWithLore[]> {
        let source: string;
        if (this.showJPdataWithEnglishText()) {
            source = `${this.host}/export/JP/nice_servant_lore_lang_en.json`;
        } else {
            source = `${this.host}/export/${this.region}/nice_servant_lore.json`;
        }

        const fetch = () => ApiConnector.fetch<ServantWithLore[]>(source);

        if (cacheDuration === undefined) return fetch();

        return this.cache.servantListNiceWithLore.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    svtScript(ids: number[], cacheDuration?: number): Promise<SvtScript[]> {
        const query = this.getQueryString(this.getURLSearchParams({ charaId: ids }));
        const fetch = () => {
            return ApiConnector.fetch<SvtScript[]>(`${this.host}/raw/${this.region}/svtScript${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.svtScript.get(query, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    eventAlloutBattle(eventIds: number[], cacheDuration?: number): Promise<EventAlloutBattle[]> {
        const query = this.getQueryString(this.getURLSearchParams({ eventId: eventIds }));
        const fetch = () => {
            return ApiConnector.fetch<EventAlloutBattle[]>(`${this.host}/raw/${this.region}/eventAlloutBattle${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.eventAlloutBattle.get(query, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    commonRelease(commonReleaseId: number, cacheDuration?: number): Promise<CommonRelease[]> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<CommonRelease[]>(
                `${this.host}/nice/${this.region}/common-release/${commonReleaseId}${query}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.commonRelease.get(commonReleaseId, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    skill(id: number, reverse?: ReverseOptions, cacheDuration?: number): Promise<Skill> {
        const query = this.getQueryString(this.getReverseParams(reverse));
        const fetch = () => {
            return ApiConnector.fetch<Skill>(`${this.host}/nice/${this.region}/skill/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.skill.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    skillBasic(id: number, reverse?: ReverseOptions, cacheDuration?: number): Promise<SkillBasic> {
        const query = this.getQueryString(this.getReverseParams(reverse));
        const fetch = () => {
            return ApiConnector.fetch<Skill>(`${this.host}/basic/${this.region}/skill/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.skillBasic.get(id, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    shop(id: number, cacheDuration?: number): Promise<Shop> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<Shop>(`${this.host}/nice/${this.region}/shop/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.shop.get(id, fetch, cacheDuration);
    }

    enemyMaster(id: number, cacheDuration?: number): Promise<EnemyMaster> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<EnemyMaster>(`${this.host}/nice/${this.region}/enemy-master/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.enemyMaster.get(id, fetch, cacheDuration);
    }

    classBoard(id: number, cacheDuration?: number): Promise<ClassBoard> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<ClassBoard>(`${this.host}/nice/${this.region}/class-board/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.classBoard.get(id, fetch, cacheDuration);
    }

    classBoardList(cacheDuration?: number): Promise<ClassBoard[]> {
        let fileName = "nice_class_board";
        if (this.showJPdataWithEnglishText()) {
            fileName = "nice_class_board_lang_en";
        }

        const fetch = () => ApiConnector.fetch<ClassBoard[]>(`${this.host}/export/${this.region}/${fileName}.json`);
        return this.cache.classBoardList.get(null, fetch, cacheDuration);
    }

    gacha(id: number, cacheDuration?: number): Promise<Gacha> {
        const query = this.getQueryString(new URLSearchParams());
        const fetch = () => {
            return ApiConnector.fetch<Gacha>(`${this.host}/nice/${this.region}/gacha/${id}${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.gacha.get(id, fetch, cacheDuration);
    }

    gachaList(cacheDuration?: number): Promise<Gacha[]> {
        let fileName = "nice_gacha";
        if (this.showJPdataWithEnglishText()) {
            fileName = "nice_gacha_lang_en";
        }

        const fetch = () => ApiConnector.fetch<ClassBoard[]>(`${this.host}/export/${this.region}/${fileName}.json`);
        return this.cache.gachaList.get(null, fetch, cacheDuration);
    }

    shopList(cacheDuration?: number): Promise<Shop[]> {
        const fetch = () => ApiConnector.fetch<Shop[]>(`${this.host}/export/${this.region}/nice_shop.json`);
        return this.cache.shopList.get(null, fetch, cacheDuration);
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

        return this.cache.traitList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    enumList(cacheDuration?: number): Promise<EnumList> {
        const fetch = async () => {
            const enumMap = await ApiConnector.fetch<EnumList>(`${this.host}/export/${this.region}/nice_enums.json`);

            return enumMap;
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.enumList.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    searchBuff(options: BuffSearchOptions, cacheDuration?: number): Promise<BasicBuff[]> {
        const query = this.getQueryString(this.getURLSearchParams(options));
        const fetch = () => ApiConnector.fetch<BasicBuff[]>(`${this.host}/basic/${this.region}/buff/search${query}`);
        return this.cache.buffSearch.get(query, fetch, cacheDuration);
    }

    searchFunc(options: FuncSearchOptions, cacheDuration?: number): Promise<BasicFunc[]> {
        const query = this.getQueryString(this.getURLSearchParams(options));
        const fetch = () =>
            ApiConnector.fetch<BasicFunc[]>(`${this.host}/basic/${this.region}/function/search${query}`);
        return this.cache.funcSearch.get(query, fetch, cacheDuration);
    }

    searchSkill(options: SkillSearchOptions, cacheDuration?: number): Promise<SkillBasic[]> {
        const query = this.getQueryString(this.getURLSearchParams(options));
        const fetch = () => ApiConnector.fetch<SkillBasic[]>(`${this.host}/basic/${this.region}/skill/search${query}`);
        return this.cache.skillSearch.get(query, fetch, cacheDuration);
    }

    searchNP(options: NPSearchOptions, cacheDuration?: number): Promise<NoblePhantasmBasic[]> {
        const query = this.getQueryString(this.getURLSearchParams(options));
        const fetch = () =>
            ApiConnector.fetch<NoblePhantasmBasic[]>(`${this.host}/basic/${this.region}/NP/search${query}`);
        return this.cache.npSearch.get(query, fetch, cacheDuration);
    }

    searchEntity(options: EntitySearchOptions, cacheDuration?: number): Promise<EntityBasic[]> {
        const query = this.getQueryString(this.getURLSearchParams(options));
        const fetch = () => ApiConnector.fetch<EntityBasic[]>(`${this.host}/basic/${this.region}/svt/search${query}`);
        return this.cache.entitySearch.get(query, fetch, cacheDuration);
    }

    searchItem(options: ItemSearchOptions, cacheDuration?: number): Promise<Item[]> {
        const query = this.getQueryString(this.getURLSearchParams(options));

        const fetch = () => {
            return ApiConnector.fetch<Item[]>(`${this.host}/nice/${this.region}/item/search${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.searchItem.get(query, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    searchQuestPhase(options: QuestPhaseSearchOptions, cacheDuration?: number): Promise<QuestPhaseBasic[]> {
        const query = this.getQueryString(this.getURLSearchParams(options));

        const fetch = () => {
            return ApiConnector.fetch<QuestPhaseBasic[]>(
                `${this.host}/basic/${this.region}/quest/phase/search${query}`
            );
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.searchQuestPhase.get(query, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    searchScript(options: ScriptSearchOptions, cacheDuration?: number): Promise<ScriptSearchResult[]> {
        const query = this.getQueryString(this.getURLSearchParams(options));

        const fetch = () => {
            return ApiConnector.fetch<ScriptSearchResult[]>(`${this.host}/nice/${this.region}/script/search${query}`);
        };

        if (cacheDuration === undefined) return fetch();

        return this.cache.searchScript.get(query, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    searchShop(options: ShopSearchOptions, cacheDuration?: number): Promise<Shop[]> {
        const query = this.getQueryString(this.getURLSearchParams(options));
        const fetch = () => ApiConnector.fetch<Shop[]>(`${this.host}/nice/${this.region}/shop/search${query}`);
        return this.cache.shopSearch.get(query, fetch, cacheDuration);
    }

    constant(cacheDuration?: number): Promise<Constants> {
        const fetch = () => ApiConnector.fetch<Constants>(`${this.host}/export/${this.region}/NiceConstant.json`);

        if (cacheDuration === undefined) return fetch();

        return this.cache.constants.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    constantStr(cacheDuration?: number): Promise<ConstantStrs> {
        const fetch = () => ApiConnector.fetch<ConstantStrs>(`${this.host}/export/${this.region}/NiceConstantStr.json`);

        if (cacheDuration === undefined) return fetch();

        return this.cache.constantStrs.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    buffConstant(cacheDuration?: number): Promise<BuffConstantMap> {
        const fetch = () =>
            ApiConnector.fetch<BuffConstantMap>(`${this.host}/export/${this.region}/NiceBuffList.ActionList.json`);

        if (cacheDuration === undefined) return fetch();

        return this.cache.buffConstantMap.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    cardConstant(cacheDuration?: number): Promise<CardConstantMap> {
        const fetch = () => ApiConnector.fetch<CardConstantMap>(`${this.host}/export/${this.region}/NiceCard.json`);

        if (cacheDuration === undefined) return fetch();

        return this.cache.cardConstantMap.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    attributeConstant(cacheDuration?: number): Promise<AttributeAffinityMap> {
        const fetch = () =>
            ApiConnector.fetch<AttributeAffinityMap>(`${this.host}/export/${this.region}/NiceAttributeRelation.json`);

        if (cacheDuration === undefined) return fetch();

        return this.cache.attributeAffinityMap.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    classAttackConstant(cacheDuration?: number): Promise<ClassAttackRateMap> {
        const fetch = () =>
            ApiConnector.fetch<ClassAttackRateMap>(`${this.host}/export/${this.region}/NiceClassAttackRate.json`);

        if (cacheDuration === undefined) return fetch();

        return this.cache.classAttackRateMap.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    classAffinityConstant(cacheDuration?: number): Promise<ClassAffinityMap> {
        const fetch = () =>
            ApiConnector.fetch<ClassAffinityMap>(`${this.host}/export/${this.region}/NiceClassRelation.json`);

        if (cacheDuration === undefined) return fetch();

        return this.cache.classAffinityMap.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    masterLevelConstant(cacheDuration?: number): Promise<MasterLevelInfoMap> {
        const fetch = () =>
            ApiConnector.fetch<MasterLevelInfoMap>(`${this.host}/export/${this.region}/NiceUserLevel.json`);

        if (cacheDuration === undefined) return fetch();

        return this.cache.masterLevelInfoMap.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    grailConstant(cacheDuration?: number): Promise<GrailCostInfoMap> {
        const fetch = () =>
            ApiConnector.fetch<GrailCostInfoMap>(`${this.host}/export/${this.region}/NiceSvtGrailCost.json`);

        if (cacheDuration === undefined) return fetch();

        return this.cache.grailCostInfoMap.get(null, fetch, cacheDuration <= 0 ? null : cacheDuration);
    }

    /**
     * The `/info` endpoint is used to check if the
     * there were any changes to data from the set
     * {@link Region}
     */
    info(): Promise<Info> {
        const fetch = () => ApiConnector.fetch<Record<Region, Info>>(`${this.host}/info`);
        return fetch().then((infoMap) => infoMap[this.region]);
    }

    private static async fetch<T>(endpoint: string): Promise<T> {
        const response = await axios.get<T>(endpoint);

        return response.data;
    }
}

export default ApiConnector;
