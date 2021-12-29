enum ClassName {
    SABER = "saber",
    ARCHER = "archer",
    LANCER = "lancer",
    RIDER = "rider",
    CASTER = "caster",
    ASSASSIN = "assassin",
    BERSERKER = "berserker",
    SHIELDER = "shielder",
    RULER = "ruler",
    ALTER_EGO = "alterEgo",
    AVENGER = "avenger",
    GRAND_CASTER = "grandCaster",
    BEAST_II = "beastII",
    USHI_CHAOS_TIDE = "ushiChaosTide",
    BEAST_I = "beastI",
    MOON_CANCER = "moonCancer",
    PRETENDER = "pretender",
    BEAST_IIIR = "beastIIIR",
    FOREIGNER = "foreigner",
    BEAST_IIIL = "beastIIIL",
    BEAST_UNKNOWN = "beastUnknown",
    BEAST_IV = "beastIV",
    UNKNOWN = "unknown",
    AGARTHA_PENTH = "agarthaPenth",
    CCC_FINALE_EMIYA_ALTER = "cccFinaleEmiyaAlter",
    SALEM_ABBY = "salemAbby",
    ALL = "ALL",
    EXTRA = "EXTRA",
}

export default ClassName;

export type ClassAttackRateMap = {
    [key in ClassName]?: number;
};

export type ClassAffinityMap = {
    [key in ClassName]?: {
        [key in ClassName]?: number;
    };
};
