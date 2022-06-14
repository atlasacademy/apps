import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./Translations/en-US/common.json";
import zhCommon from "./Translations/zh-CN/common.json";
import zhTWCommon from "./Translations/zh-TW/common.json";

const resources = {
    "en-US": {
        common: enCommon,
    },
    "zh-CN": {
        common: zhCommon,
    },
    "zh-TW": {
        common: zhTWCommon,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en-US",
    fallbackLng: "en-US",
    ns: ["common"],
    defaultNS: "common",
    fallbackNS: "common",
    interpolation: {
        escapeValue: false,
    },
    returnEmptyString: false,
});

export default i18n;
