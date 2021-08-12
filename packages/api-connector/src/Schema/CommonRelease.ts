import CondType from "../Enum/Cond";

export interface CommonRelease {
    id: number;
    priority: number;
    condGroup: number;
    condType: CondType;
    condId: number;
    condNum: number;
}
