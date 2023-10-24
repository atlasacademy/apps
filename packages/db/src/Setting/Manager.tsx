import { Language, Region } from "@atlasacademy/api-connector";
import { UILanguage } from "@atlasacademy/api-descriptor";

import { CalcStringType } from "../Helper/CalcString";
import i18n, { uiLangLocalStorageKey } from "../i18n";
import { Theme } from "./Theme";

const languageKey = "language",
    uiLanguageKey = uiLangLocalStorageKey,
    themeKey = "aa-db.theme",
    changelogVisibleOnly = "changelog.visibleOnly",
    changelogLocalTime = "changelog.localTime",
    shopPlannerEnabled = "shop.planner.enabled",
    scriptSceneEnabled = "script.scene.enabled",
    hideEnemyFunction = "aa-db.function.enemy.hide",
    scriptShowLine = "aa-db.script.showLine",
    calcStringTypeKey = "aa-db.calcStringType";

const callbacks: Function[] = [];

let region: Region = Region.JP;

export const lang = (region_?: Region): string => {
    switch (region_ ?? region) {
        case Region.JP:
            return "ja-JP";
        case Region.NA:
            return "en-US";
        case Region.CN:
            return "zh-CN";
        case Region.KR:
            return "ko-KR";
        case Region.TW:
            return "zh-TW";
        default:
            return "en-US";
    }
};

class Manager {
    static changelogVisibleOnly(): boolean {
        return !!+(window.localStorage.getItem(changelogVisibleOnly) ?? 0);
    }

    static setChangelogVisibleOnly(visibleOnly: boolean) {
        window.localStorage.setItem(changelogVisibleOnly, `${+!!visibleOnly}`);
        Manager.triggerCallbacks();
    }

    static changelogLocalTimestamp(): boolean {
        return !!+(window.localStorage.getItem(changelogLocalTime) ?? 0);
    }

    static setChangelogLocalTimestamp(local: boolean) {
        window.localStorage.setItem(changelogLocalTime, `${+!!local}`);
        Manager.triggerCallbacks();
    }

    static showScriptLine(): boolean {
        return !!+(window.localStorage.getItem(scriptShowLine) ?? 0);
    }

    static setShowScriptLine(show: boolean) {
        window.localStorage.setItem(scriptShowLine, `${+!!show}`);
        Manager.triggerCallbacks();
    }

    static languageRaw(): Language | undefined {
        const value = window.localStorage.getItem(languageKey),
            language: Language | undefined = Object.values(Language).find((v) => v === value);

        return language;
    }

    static language(): Language {
        return this.languageRaw() ?? Language.ENGLISH;
    }

    static setLanguage(value: string) {
        const language = Object.values(Language).find((v) => v === value);
        if (language === undefined) return;

        window.localStorage.setItem(languageKey, language);
        Manager.triggerCallbacks();
    }

    static uiLanguageRaw(): UILanguage | undefined {
        const value = window.localStorage.getItem(uiLanguageKey),
            language: UILanguage | undefined = Object.values(UILanguage).find((v) => v === value);

        return language;
    }

    static uiLanguage(): UILanguage {
        return this.uiLanguageRaw() ?? UILanguage.EN_US;
    }

    static setUiLanguage(value: UILanguage) {
        window.localStorage.setItem(uiLanguageKey, value);
        i18n.changeLanguage(this.uiLanguage());
        Manager.triggerCallbacks();
    }

    static region(): Region {
        return region;
    }

    static setRegion(_region: Region) {
        if (_region !== region) {
            region = _region;
            Manager.triggerCallbacks();
        }
    }

    static showingJapaneseText(): boolean {
        return this.region() === Region.JP && this.language() === Language.DEFAULT;
    }

    static theme(): Theme {
        const value = window.localStorage.getItem(themeKey),
            theme = Object.values(Theme).find((v) => v === value);

        return theme ?? Theme.DEFAULT;
    }

    static setTheme(value: string) {
        const theme = Object.values(Theme).find((v) => v === value);
        if (theme === undefined) return;

        window.localStorage.setItem(themeKey, theme);
        Manager.triggerCallbacks();
    }

    static calcStringType(): CalcStringType {
        const value = window.localStorage.getItem(calcStringTypeKey),
            calcType = Object.values(CalcStringType).find((v) => v === value);

        return calcType ?? CalcStringType.OFF;
    }

    static calcStringEnabled(): boolean {
        return Manager.calcStringType() !== CalcStringType.OFF;
    }

    static setcalcStringType(value: CalcStringType) {
        window.localStorage.setItem(calcStringTypeKey, value);
        Manager.triggerCallbacks();
    }

    static shopPlannerEnabled(): boolean {
        return !!+(window.localStorage.getItem(shopPlannerEnabled) ?? 0);
    }

    static setShopPlannerEnabled(plannerEnabled: boolean) {
        window.localStorage.setItem(shopPlannerEnabled, `${+!!plannerEnabled}`);
        Manager.triggerCallbacks();
    }

    static hideEnemyFunctions(): boolean {
        return !!+(window.localStorage.getItem(hideEnemyFunction) ?? 0);
    }

    static setHideEnemyFunctions(hide: boolean) {
        window.localStorage.setItem(hideEnemyFunction, `${+!!hide}`);
        Manager.triggerCallbacks();
    }

    static scriptSceneEnabled(): boolean {
        return !!+(window.localStorage.getItem(scriptSceneEnabled) ?? 1);
    }

    static setScriptSceneEnabled(sceneEnabled: boolean) {
        window.localStorage.setItem(scriptSceneEnabled, `${+!!sceneEnabled}`);
        Manager.triggerCallbacks();
    }

    static onUpdate(callback: Function) {
        callbacks.push(callback);
    }

    private static triggerCallbacks() {
        callbacks.forEach((callback) => {
            callback.call(null);
        });
    }
}

export default Manager;
