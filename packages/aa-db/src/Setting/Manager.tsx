import {LanguageOption} from "./Option";

const languageKey = 'language';

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
