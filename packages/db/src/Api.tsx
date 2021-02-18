import {
    Ai,
    ApiConnector,
    Buff,
    Change,
    ClassName,
    CommandCode,
    CraftEssence,
    Enemy,
    Entity,
    Event,
    Func,
    Item,
    Language,
    MysticCode,
    NoblePhantasm,
    Quest,
    Region,
    ReverseData,
    ReverseDepth,
    Servant,
    Skill,
    Trait,
} from "@atlasacademy/api-connector";
import Manager from "./Setting/Manager";

export const Host = "https://api.atlasacademy.io";
const cacheDuration = 20 * 1000;

let apiConnector: ApiConnector = new ApiConnector({
    host: Host,
    region: Region.JP,
    language: Manager.language(),
});

class Api {
    static init(region: Region, language: Language) {
        apiConnector = new ApiConnector({ host: Host, region, language });
    }

    static buff(id: number): Promise<Buff.Buff> {
        const reverse = {
            reverse: true,
            reverseDepth: ReverseDepth.SKILL_NP,
            reverseData: ReverseData.BASIC,
        };
        return apiConnector.buff(id, reverse, cacheDuration);
    }

    static buffBasic(id: number): Promise<Buff.BasicBuff> {
        return apiConnector.buffBasic(id, undefined, cacheDuration);
    }

    static changelog(): Promise<Change.Change[]> {
        return apiConnector.changelog();
    }

    static commandCode(id: number): Promise<CommandCode.CommandCode> {
        return apiConnector.commandCode(id, cacheDuration);
    }

    static async commandCodeList(): Promise<CommandCode.CommandCodeBasic[]> {
        return apiConnector.commandCodeList(-1);
    }

    static craftEssence(id: number): Promise<CraftEssence.CraftEssence> {
        return apiConnector.craftEssence(id, true, cacheDuration);
    }

    static craftEssenceBasic(
        id: number
    ): Promise<CraftEssence.CraftEssenceBasic> {
        return apiConnector.craftEssenceBasic(id, cacheDuration);
    }

    static async craftEssenceList(): Promise<CraftEssence.CraftEssenceBasic[]> {
        return apiConnector.craftEssenceList(-1);
    }

    static async enemy(id: number): Promise<Enemy.Enemy> {
        return apiConnector.enemy(id, true, cacheDuration);
    }

    static async event(id: number): Promise<Event.Event> {
        return apiConnector.event(id, cacheDuration);
    }

    static async eventBasic(id: number): Promise<Event.EventBasic> {
        return apiConnector.eventBasic(id, cacheDuration);
    }

    static func(id: number): Promise<Func.Func> {
        const reverse = {
            reverse: true,
            reverseDepth: ReverseDepth.SERVANT,
            reverseData: ReverseData.BASIC,
        };
        return apiConnector.func(id, reverse, cacheDuration);
    }

    static item(id: number): Promise<Item.Item> {
        return apiConnector.item(id, cacheDuration);
    }

    static itemList(): Promise<Item.Item[]> {
        return apiConnector.itemList(-1);
    }

    static mysticCode(id: number): Promise<MysticCode.MysticCode> {
        return apiConnector.mysticCode(id, cacheDuration);
    }

    static async mysticCodeList(): Promise<MysticCode.MysticCodeBasic[]> {
        return apiConnector.mysticCodeList(-1);
    }

    static noblePhantasm(id: number): Promise<NoblePhantasm.NoblePhantasm> {
        const reverse = {
            reverse: true,
            reverseData: ReverseData.BASIC,
        };
        return apiConnector.noblePhantasm(id, reverse, cacheDuration);
    }

    static questPhase(id: number, phase: number): Promise<Quest.QuestPhase> {
        return apiConnector.questPhase(id, phase, cacheDuration);
    }

    static ai(type: Ai.AiType, id: number): Promise<Ai.AiCollection> {
        return apiConnector.ai(type, id, cacheDuration);
    }

    static entityBasic(id: number): Promise<Entity.EntityBasic> {
        return apiConnector.entityBasic(id, cacheDuration);
    }

    static servant(id: number): Promise<Servant.Servant> {
        return apiConnector.servant(id, true, cacheDuration);
    }

    static async servantList(): Promise<Servant.ServantBasic[]> {
        return apiConnector.servantList(-1);
    }

    static async servantListNice(): Promise<Servant.Servant[]> {
        return apiConnector.servantListNice(-1);
    }

    static skill(id: number): Promise<Skill.Skill> {
        const reverse = {
            reverse: true,
            reverseData: ReverseData.BASIC,
        };
        return apiConnector.skill(id, reverse, cacheDuration);
    }

    static traitList(): Promise<Trait.Trait[]> {
        return apiConnector.traitList(-1);
    }

    static searchItem(
        name?: string,
        individuality?: number[],
        type?: Item.ItemType[],
        background?: Item.ItemBackgroundType[],
        use?: Item.ItemUse[]
    ): Promise<Item.Item[]> {
        return apiConnector.searchItem(
            { name, individuality, type, background, use },
            cacheDuration
        );
    }

    static searchBuffs(
        name?: string,
        type?: Buff.BuffType[]
    ): Promise<Buff.BasicBuff[]> {
        return apiConnector.searchBuff({
            name,
            type,
            reverse: true,
            reverseDepth: ReverseDepth.FUNCTION,
        });
    }

    static searchEntity(
        name?: string,
        type?: Entity.EntityType[],
        className?: ClassName[],
        gender?: Entity.Gender[],
        attribute?: Entity.Attribute[],
        trait?: number[],
        voiceCondSvt?: number[]
    ): Promise<Entity.EntityBasic[]> {
        return apiConnector.searchEntity({
            name,
            type,
            className,
            gender,
            attribute,
            trait,
            voiceCondSvt,
        });
    }

    static searchFuncs(
        popupText?: string,
        type?: Func.FuncType[],
        targetType?: Func.FuncTargetType[],
        targetTeam?: Func.FuncTargetTeam[]
    ): Promise<Func.BasicFunc[]> {
        return apiConnector.searchFunc({
            popupText,
            type,
            targetType,
            targetTeam,
            reverse: true,
            reverseDepth: ReverseDepth.SERVANT,
        });
    }
}

export default Api;
