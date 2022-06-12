import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./Translations/en-US/main.json";
import zhTranslation from "./Translations/zh-CN/main.json";

const resources = {
    "en-US": {
        translation: enTranslation,
    },
    "zh-CN": {
        translation: zhTranslation,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
