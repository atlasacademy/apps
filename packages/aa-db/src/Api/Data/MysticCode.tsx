import {AssetBundle, AssetMap} from "./AssetCollection";
import Skill from "./Skill";

export interface MysticCodeAssetMap extends AssetMap {
    male: string;
    female: string;
}

export interface MysticCodeAssetBundle extends AssetBundle {
    item: MysticCodeAssetMap;
    masterFace: MysticCodeAssetMap;
    masterFigure: MysticCodeAssetMap;
}

interface MysticCode {
    id: number;
    name: string;
    detail: string;
    maxLv: number;
    extraAssets: MysticCodeAssetBundle;
    skills: Skill[];
    expRequired: number[];
}

export default MysticCode;
