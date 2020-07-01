export interface AssetMap {
    [key: string]: string;
}

export interface ServantAssetMap {
    ascension?: AssetMap;
    costume?: AssetMap;
    equip?: AssetMap;
    [key: string]: AssetMap | undefined;
}

interface ServantAsset {
    charaGraph: ServantAssetMap;
    faces: ServantAssetMap;
    [key: string]: ServantAssetMap;
}

export default ServantAsset;
