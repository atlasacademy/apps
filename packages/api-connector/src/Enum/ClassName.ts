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
    BEAST_I_LOST = "beastILost",
    MOON_CANCER = "moonCancer",
    PRETENDER = "pretender",
    BEAST_IIIR = "beastIIIR",
    FOREIGNER = "foreigner",
    BEAST_IIIL = "beastIIIL",
    BEAST_UNKNOWN = "beastUnknown",
    BEAST_IV = "beastIV",
    U_OLGA_MARIE_ALIEN_GOD = "uOlgaMarieAlienGod",
    U_OLGA_MARIE = "uOlgaMarie",
    BEAST = "beast",
    BEAST_VI = "beastVI",
    BEAST_VI_BOSS = "beastVIBoss",
    U_OLGA_MARIE_FLARE = "uOlgaMarieFlare",
    U_OLGA_MARIE_AQUA = "uOlgaMarieAqua",
    U_OLGA_MARIE_GRAND = "uOlgaMarieGrand",
    UNKNOWN = "unknown",
    AGARTHA_PENTH = "agarthaPenth",
    CCC_FINALE_EMIYA_ALTER = "cccFinaleEmiyaAlter",
    SALEM_ABBY = "salemAbby",
    ALL = "ALL",
    EXTRA = "EXTRA",
    EXTRA_I = "EXTRA_I",
    EXTRA_II = "EXTRA_II",
    U_OLGA_MARIE_FLARE_COLLECTION = "uOlgaMarieFlareCollection",
    U_OLGA_MARIE_AQUA_COLLECTION = "uOlgaMarieAquaCollection",
    U_OLGA_MARIE_GRAND_COLLECTION = "uOlgaMarieGrandCollection",
    U_OLGA_MARIE_STELLAR_COLLECTION = "uOlgaMarieStellarCollection",
    BEAST_ERESH = "beastEresh",
    UN_BEAST_OLGA_MARIE = "unBeastOlgaMarie",
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
