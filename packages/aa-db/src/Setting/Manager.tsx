import {LanguageOption, RegionOption} from "./Option";

const languageKey = 'language',
    regionKey = 'region';

const callbacks: Function[] = [];

class Manager {
    static language(): LanguageOption {
        const value = window.localStorage.getItem(languageKey),
            language = Object.values(LanguageOption).find(v => v === value);

        return language ?? LanguageOption.DEFAULT;
    }

    static region(): RegionOption {
        const value = window.localStorage.getItem(regionKey),
            region = Object.values(RegionOption).find(v => v === value);

        return region ?? RegionOption.JP;
    }

    static setLanguage(value: string) {
        const language = Object.values(LanguageOption).find(v => v === value);
        if (language === undefined)
            return;

        window.localStorage.setItem(languageKey, language);
        Manager.triggerCallbacks();
    }

    static setRegion(value: string) {
        const region = Object.values(RegionOption).find(v => v === value);
        if (region === undefined)
            return;

        window.localStorage.setItem(regionKey, region);
        Manager.triggerCallbacks();
    }

    static onUpdate(callback: Function) {
        callbacks.push(callback);
    }

    private static triggerCallbacks()
    {
        callbacks.forEach(callback => {
            callback.call(null);
        });
    }
}

export default Manager;
