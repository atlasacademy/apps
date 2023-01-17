import { UILanguage } from "@atlasacademy/api-descriptor";

import homeEN from "./en";
import homeZHCN from "./zhCN";

export const home = (uiLang: UILanguage) =>
    uiLang === UILanguage.ZH_CN || uiLang == UILanguage.ZH_TW ? homeZHCN : homeEN;
