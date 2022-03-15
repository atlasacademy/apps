import {
    Ai,
    ApiConnector,
    Attribute,
    Bgm,
    Buff,
    Card,
    ConstantStr,
    Change,
    ClassName,
    CommandCode,
    CraftEssence,
    Enemy,
    EnumList,
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
    War,
    Illustrator,
    Cv,
    MasterMission,
    Script,
} from "@atlasacademy/api-connector";

import Manager from "./Setting/Manager";

export const Host = "https://api.atlasacademy.io";
export const AssetHost = "https://static.atlasacademy.io";

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

    static bgm(id: number): Promise<Bgm.BgmEntity> {
        return apiConnector.bgm(id, cacheDuration);
    }

    static bgmList(): Promise<Bgm.BgmEntity[]> {
        return apiConnector.bgmList(cacheDuration);
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

    static constantStrs(): Promise<ConstantStr.ConstantStrs> {
        return apiConnector.constantStr(cacheDuration);
    }

    static changelog(): Promise<Change.Change[]> {
        return apiConnector.changelog();
    }

    static questEnemyChangelog(): Promise<Quest.QuestPhaseBasic[]> {
        return apiConnector.questEnemyChangelog();
    }

    static commandCode(id: number): Promise<CommandCode.CommandCode> {
        return apiConnector.commandCode(id, cacheDuration);
    }

    static commandCodeBasic(id: number): Promise<CommandCode.CommandCodeBasic> {
        return apiConnector.commandCodeBasic(id, cacheDuration);
    }

    static async commandCodeList(): Promise<CommandCode.CommandCodeBasic[]> {
        return apiConnector.commandCodeList(-1);
    }

    static craftEssence(id: number): Promise<CraftEssence.CraftEssence> {
        return apiConnector.craftEssence(id, true, cacheDuration);
    }

    static craftEssenceBasic(id: number): Promise<CraftEssence.CraftEssenceBasic> {
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

    static async eventList(): Promise<Event.EventBasic[]> {
        return apiConnector.eventList();
    }

    static async masterMission(id: number): Promise<MasterMission.MasterMission> {
        return apiConnector.masterMission(id, cacheDuration);
    }

    static async masterMissionList(): Promise<MasterMission.MasterMission[]> {
        return apiConnector.masterMissionList();
    }

    static func(id: number): Promise<Func.Func> {
        const reverse = {
            reverse: true,
            reverseDepth: ReverseDepth.SERVANT,
            reverseData: ReverseData.BASIC,
        };
        return apiConnector.func(id, reverse, cacheDuration);
    }

    static funcBasic(id: number): Promise<Func.BasicFunc> {
        return apiConnector.funcBasic(id, undefined, cacheDuration);
    }

    static item(id: number): Promise<Item.Item> {
        return apiConnector.item(id, cacheDuration);
    }

    static itemList(): Promise<Item.Item[]> {
        return apiConnector.itemList(-1);
    }

    static illustratorList(): Promise<Illustrator[]> {
        return apiConnector.illustratorList();
    }

    static cvList(): Promise<Cv[]> {
        return apiConnector.cvList();
    }

    static mysticCode(id: number): Promise<MysticCode.MysticCode> {
        return apiConnector.mysticCode(id, cacheDuration);
    }

    static mysticCodeBasic(id: number): Promise<MysticCode.MysticCodeBasic> {
        return apiConnector.mysticCodeBasic(id, cacheDuration);
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

    static noblePhantasmBasic(id: number): Promise<NoblePhantasm.NoblePhantasmBasic> {
        return apiConnector.noblePhantasmBasic(id, undefined, cacheDuration);
    }

    static quest(id: number): Promise<Quest.Quest> {
        return apiConnector.quest(id, cacheDuration);
    }

    static questPhase(id: number, phase: number): Promise<Quest.QuestPhase> {
        return apiConnector.questPhase(id, phase, cacheDuration);
    }

    static questBasic(id: number): Promise<Quest.QuestBasic> {
        return apiConnector.questBasic(id, cacheDuration);
    }

    static script(id: string): Promise<Script.Script> {
        return apiConnector.script(id, cacheDuration);
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

    static skill(id: number, reverse = true): Promise<Skill.Skill> {
        const reverseConfig = {
            reverse: reverse,
            reverseData: ReverseData.BASIC,
        };
        return apiConnector.skill(id, reverseConfig, cacheDuration);
    }

    static skillBasic(id: number): Promise<Skill.SkillBasic> {
        return apiConnector.skillBasic(id, undefined, cacheDuration);
    }

    static svtScript(id: number): Promise<Script.SvtScript[]> {
        return apiConnector.svtScript([id], cacheDuration);
    }

    static war(id: number): Promise<War.War> {
        return apiConnector.war(id, cacheDuration);
    }

    static warBasic(id: number): Promise<War.WarBasic> {
        return apiConnector.warBasic(id, cacheDuration);
    }

    static async warList(): Promise<War.WarBasic[]> {
        return apiConnector.warList();
    }

    static traitList(): Promise<Trait.Trait[]> {
        return apiConnector.traitList(-1);
    }

    static enumList(): Promise<EnumList> {
        return apiConnector.enumList(cacheDuration);
    }

    static searchItem(
        name?: string,
        individuality?: number[],
        type?: Item.ItemType[],
        background?: Item.ItemBackgroundType[],
        use?: Item.ItemUse[]
    ): Promise<Item.Item[]> {
        return apiConnector.searchItem({ name, individuality, type, background, use }, cacheDuration);
    }

    static searchBuff(
        name?: string,
        type?: Buff.BuffType[],
        buffGroup?: number[],
        vals?: number[],
        tvals?: number[],
        ckSelfIndv?: number[],
        ckOpIndv?: number[]
    ): Promise<Buff.BasicBuff[]> {
        return apiConnector.searchBuff({
            name,
            type,
            buffGroup,
            vals,
            tvals,
            ckSelfIndv,
            ckOpIndv,
            reverse: true,
            reverseDepth: ReverseDepth.FUNCTION,
        });
    }

    static searchEntity(
        name?: string,
        type?: Entity.EntityType[],
        className?: ClassName[],
        gender?: Entity.Gender[],
        attribute?: Attribute.Attribute[],
        trait?: number[],
        notTrait?: number[],
        voiceCondSvt?: number[],
        illustrator?: string,
        cv?: string
    ): Promise<Entity.EntityBasic[]> {
        return apiConnector.searchEntity({
            name,
            type,
            className,
            gender,
            attribute,
            trait,
            notTrait,
            voiceCondSvt,
            illustrator,
            cv,
        });
    }

    static searchEntityVoiceCondSvt(voiceCondSvt: number[]) {
        return apiConnector.searchEntity({ voiceCondSvt });
    }

    static searchFunc(
        popupText?: string,
        type?: Func.FuncType[],
        targetType?: Func.FuncTargetType[],
        targetTeam?: Func.FuncTargetTeam[],
        vals?: number[],
        tvals?: number[],
        questTvals?: number[]
    ): Promise<Func.BasicFunc[]> {
        return apiConnector.searchFunc({
            popupText,
            type,
            targetType,
            targetTeam,
            vals,
            tvals,
            questTvals,
            reverse: true,
            reverseDepth: ReverseDepth.SERVANT,
        });
    }

    static searchSkill(
        name?: string,
        type?: Skill.SkillType[],
        num?: number[],
        priority?: number[],
        strengthStatus?: number[],
        lvl1coolDown?: number[],
        numFunctions?: number[]
    ): Promise<Skill.SkillBasic[]> {
        return apiConnector.searchSkill({
            name,
            type,
            num,
            priority,
            strengthStatus,
            lvl1coolDown,
            numFunctions,
            reverse: true,
            reverseDepth: ReverseDepth.SERVANT,
        });
    }

    static searchNoblePhantasm(
        name?: string,
        card?: Card[],
        individuality?: number[],
        hits?: number[],
        strengthStatus?: number[],
        numFunctions?: number[],
        minNpNpGain?: number,
        maxNpNpGain?: number
    ): Promise<NoblePhantasm.NoblePhantasmBasic[]> {
        return apiConnector.searchNP({
            name,
            card,
            individuality,
            hits,
            strengthStatus,
            numFunctions,
            minNpNpGain,
            maxNpNpGain,
            reverse: true,
            reverseDepth: ReverseDepth.SERVANT,
        });
    }

    static searchQuestPhase(
        name?: string,
        spotName?: string,
        warId?: number[],
        type?: Quest.QuestType[],
        fieldIndividuality?: number[],
        battleBgId?: number,
        bgmId?: number,
        fieldAiId?: number,
        enemySvtId?: number,
        enemySvtAiId?: number,
        enemyTrait?: number[],
        enemyClassName?: ClassName[]
    ): Promise<Quest.QuestPhaseBasic[]> {
        return apiConnector.searchQuestPhase({
            name,
            spotName,
            warId,
            type,
            fieldIndividuality,
            battleBgId,
            bgmId,
            fieldAiId,
            enemySvtId,
            enemySvtAiId,
            enemyTrait,
            enemyClassName,
        });
    }

    static searchScript(query: string): Promise<Script.ScriptSearchResult[]> {
        return apiConnector.searchScript({ query });
    }
}

export default Api;
