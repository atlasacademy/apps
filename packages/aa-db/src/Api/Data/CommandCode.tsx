import AssetCollection, {AssetBundle, AssetMap} from "./AssetCollection";
import Skill from "./Skill";

export interface CommandCodeAssetBundle extends AssetBundle {
    cc: AssetMap;
}

export interface CommandCodeAssetCollection extends AssetCollection {
    charaGraph: CommandCodeAssetBundle;
    faces: CommandCodeAssetBundle;
}

interface CommandCode {
    id: number;
    collectionNo: number;
    name: string;
    rarity: number;
    extraAssets: CommandCodeAssetCollection;
    skills: Skill[];
    comment: string;
}

export default CommandCode;
