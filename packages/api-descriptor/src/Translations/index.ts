import { UILanguage } from "../index.js";

import enTranslation = require("./en-US/main.json");
import zhTranslation = require("./zh-CN/main.json");

export const t = (key: string, language?: UILanguage): string => {
    if (language === UILanguage.ZH_CN) {
        return (
            (zhTranslation as Record<string, string>)[key] ??
            (enTranslation as Record<string, string>)[key] ??
            "Unknown translation key"
        );
    }

    return (enTranslation as Record<string, string>)[key] ?? "Unknown translation key";
};
