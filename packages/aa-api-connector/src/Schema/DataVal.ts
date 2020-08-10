import DataValField from "../Enum/DataValField";
import FuncTargetType from "../Enum/FuncTargetType";

type BaseDataVal = { [key in DataValField]?: number | string; };

type DataVal = (
    BaseDataVal
    & { FriendshipTarget?: FuncTargetType, DependFuncVals?: BaseDataVal; }
    );

export default DataVal;
