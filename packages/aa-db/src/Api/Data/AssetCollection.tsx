export interface AssetMap {
    [key: string]: string | undefined;
}

export interface AssetBundle {
    [key: string]: AssetMap | undefined;
}

interface AssetCollection {
    [key: string]: AssetBundle | undefined;
}

export default AssetCollection;
