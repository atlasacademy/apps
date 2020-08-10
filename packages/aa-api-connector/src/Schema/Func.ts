import FuncTargetTeam from "../Enum/FuncTargetTeam";
import FuncTargetType from "../Enum/FuncTargetType";
import FuncType from "../Enum/FuncType";
import Buff from "./Buff";
import DataVal from "./DataVal";
import NoblePhantasm from "./NoblePhantasm";
import Skill from "./Skill";
import Trait from "./Trait";

export default interface Func {
    funcId: number;
    funcType: FuncType;
    funcTargetType: FuncTargetType;
    funcTargetTeam: FuncTargetTeam;
    funcPopupText: string;
    funcPopupIcon?: string;
    functvals: Trait[];
    funcquestTvals: number[];
    traitVals?: Trait[];
    buffs: Buff[];
    svals: DataVal[];
    svals2?: DataVal[];
    svals3?: DataVal[];
    svals4?: DataVal[];
    svals5?: DataVal[];
    followerVals?: DataVal[];
    reverse?: {
        nice?: {
            NP?: NoblePhantasm[];
            skill?: Skill[];
        }
    }
}
