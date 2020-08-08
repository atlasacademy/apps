import {LanguageOption} from "./Option";
import {Theme} from "./Theme";

const languageKey = 'language',
    themeKey = 'aa-db.theme';

const callbacks: Function[] = [];

class Manager {
    static language(): LanguageOption {
        const value = window.localStorage.getItem(languageKey),
            language = Object.values(LanguageOption).find(v => v === value);

        return language ?? LanguageOption.DEFAULT;
    }

    static setLanguage(value: string) {
        const language = Object.values(LanguageOption).find(v => v === value);
        if (language === undefined)
            return;

        window.localStorage.setItem(languageKey, language);
        Manager.triggerCallbacks();
    }

    static theme(): Theme {
        const value = window.localStorage.getItem(themeKey),
            theme = Object.values(Theme).find(v => v === value);

        return theme ?? Theme.DEFAULT;
    }

    static setTheme(value: string) {
        const theme = Object.values(Theme).find(v => v === value);
        if (theme === undefined)
            return;

        window.localStorage.setItem(themeKey, theme);
        Manager.triggerCallbacks();
    }

    static onUpdate(callback: Function) {
        callbacks.push(callback);
    }

    private static triggerCallbacks() {
        callbacks.forEach(callback => {
            callback.call(null);
        });
    }
}

export default Manager;
