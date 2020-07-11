export interface AssetMap {
    [key: string]: string;
}

export interface AssetBundle {
    // ascension?: AssetMap;
    // costume?: AssetMap;
    // equip?: AssetMap;
    [key: string]: AssetMap;
}

interface AssetCollection {
    // charaGraph: AssetBundle;
    // faces: AssetBundle;
    [key: string]: AssetBundle;
}

export default AssetCollection;
