interface AssetMap {
    ascension: {
        [key: string]: string
    },
    costume: {
        [key: string]: string
    },
    equip: {
        [key: string]: string
    },
}

interface ServantAsset {
    charaGraph: AssetMap;
    faces: AssetMap;
}

export default ServantAsset;
