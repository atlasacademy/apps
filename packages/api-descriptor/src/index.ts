export * from "./Descriptor.js";
export { default as BuffDescriptor } from "./Buff/index.js";
export { default as CardDescriptor } from "./Card/index.js";
export { default as FuncDescriptor } from "./Func/index.js";
export { default as ItemDescriptor } from "./Item/index.js";
export { default as SkillDescriptor } from "./Skill/index.js";
export { default as TraitDescriptor } from "./Trait/index.js";
export { toTitleCase } from "./Helpers.js";

export enum UILanguage {
    EN_US = "en-US",
    ID_ID = "id-ID",
    ZH_CN = "zh-CN",
    ZH_TW = "zh-TW",
    JA_JP = "ja-JP",
    KO_KR = "ko-KR",
}
