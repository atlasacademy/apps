import {
    ApiConnector,
    Buff,
    Change,
    ClassName,
    CommandCode,
    CraftEssence,
    Enemy,
    Event,
    Entity,
    Func,
    Item,
    Language,
    MysticCode,
    NoblePhantasm,
    Quest,
    Region,
    Servant,
    Skill,
    Trait
} from "@atlasacademy/api-connector";
import Manager from "./Setting/Manager";

const host = 'https://api.atlasacademy.io',
    cacheDuration = 20 * 1000;

let apiConnector: ApiConnector = new ApiConnector({
    host,
    region: Region.JP,
    language: Manager.language()
});

class Api {
    static init(region: Region, language: Language) {
        apiConnector = new ApiConnector({host, region, language});
    }

    static buff(id: number): Promise<Buff.Buff> {
        return apiConnector.buff(id, cacheDuration);
    }

    static changelog() : Promise<Change.Change[]> {
        return apiConnector.changelog();
    }

    static commandCode(id: number): Promise<CommandCode.CommandCode> {
        return apiConnector.commandCode(id, cacheDuration);
    }

    static async commandCodeList(): Promise<CommandCode.CommandCodeBasic[]> {
        return apiConnector.commandCodeList(-1);
    }

    static craftEssence(id: number): Promise<CraftEssence.CraftEssence> {
        return apiConnector.craftEssence(id, cacheDuration);
    }

    static craftEssenceBasic(id: number): Promise<CraftEssence.CraftEssenceBasic> {
        return apiConnector.craftEssenceBasic(id, cacheDuration);
    }

    static async craftEssenceList(): Promise<CraftEssence.CraftEssenceBasic[]> {
        return apiConnector.craftEssenceList(-1);
    }

    static async enemy(id: number): Promise<Enemy.Enemy> {
        return apiConnector.enemy(id);
    }

    static async event(id : number): Promise<Event.Event> {
        return apiConnector.event(id, cacheDuration);
    }

    static async eventBasic(id : number): Promise<Event.EventBasic> {
        return apiConnector.eventBasic(id, cacheDuration);
    }

    static func(id: number): Promise<Func.Func> {
        return apiConnector.func(id, cacheDuration);
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
        return apiConnector.noblePhantasm(id, cacheDuration);
    }

    static questPhase(id: number, phase: number): Promise<Quest.QuestPhase> {
        return apiConnector.questPhase(id, phase, cacheDuration);
    }

    static servant(id: number): Promise<Servant.Servant> {
        return apiConnector.servant(id, cacheDuration);
    }

    static async servantList(): Promise<Servant.ServantBasic[]> {
        return apiConnector.servantList(-1);
    }

    static async servantListNice(): Promise<Servant.Servant[]> {
        return apiConnector.servantListNice(-1);
    }

    static skill(id: number): Promise<Skill.Skill> {
        return apiConnector.skill(id, cacheDuration);
    }

    static traitList(): Promise<Trait.Trait[]> {
        return apiConnector.traitList(-1);
    }

    static searchItem(name?: string,
                      individuality?: number[],
                      type?: Item.ItemType[],
                      background?: Item.ItemBackgroundType[],
                      use?: Item.ItemUse[]): Promise<Item.Item[]> {
        return apiConnector.searchItem({name, individuality, type, background, use}, cacheDuration);
    }

    static searchBuffs(name?: string, type?: Buff.BuffType): Promise<Buff.BasicBuff[]> {
        return apiConnector.searchBuff({name, type});
    }

    static searchEntity(name?: string,
                        type?: Entity.EntityType,
                        className?: ClassName,
                        gender?: Entity.Gender,
                        attribute?: Entity.Attribute,
                        traits?: number[],
                        voiceCondSvt?: number): Promise<Entity.EntityBasic[]> {
        return apiConnector.searchEntity({
            name, type, className, gender, attribute, traits, voiceCondSvt
        });
    }

    static searchFuncs(text?: string,
                       type?: Func.FuncType,
                       target?: Func.FuncTargetType,
                       team?: Func.FuncTargetTeam): Promise<Func.BasicFunc[]> {
        return apiConnector.searchFunc({text, type, target, team});
    }

}

export default Api;
