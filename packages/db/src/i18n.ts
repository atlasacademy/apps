import i18n, { ReadCallback } from "i18next";
import { initReactI18next } from "react-i18next";

import { UILanguage } from "@atlasacademy/api-descriptor";

import enCommon from "./Translations/en-US/common.json";

export const uiLangLocalStorageKey = "aa-db.uiLanguage";

i18n.use(initReactI18next)
    .use({
        type: "backend",
        read: (language: UILanguage, namespace: string, callback: ReadCallback): void => {
            import(`./Translations/${language}/${namespace}.json`)
                .then((resources) => {
                    callback(null, resources);
                })
                .catch((error) => {
                    callback(error, null);
                });
        },
    })
    .use({
        type: "languageDetector",
        init() {},
        detect: () => window.localStorage.getItem(uiLangLocalStorageKey ?? UILanguage.EN_US),
        cacheUserLanguage: () => {},
    })
    .init({
        // Bundle English translations with main.js for a fast default and fallback
        resources: { "en-US": { common: enCommon } },
        partialBundledLanguages: true,
        fallbackLng: "en-US",
        ns: ["common"],
        defaultNS: "common",
        fallbackNS: "common",
        interpolation: {
            escapeValue: false,
        },
        returnEmptyString: false,
        react: {
            useSuspense: false,
        },
    });

export default i18n;
