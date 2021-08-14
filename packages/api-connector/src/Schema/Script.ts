export interface ScriptExtendData {
    combineResultMultipleForm?: number;
    myroomForm?: number;
    faceSize?: number;
    conds?: { condType: number; value: number }[];
}

export interface SvtScript {
    extendData: ScriptExtendData;
    id: number;
    form: number;
    faceX: number;
    faceY: number;
    bgImageId: number;
    scale: number;
    offsetX: number;
    offsetY: number;
    offsetXMyroom: number;
    offsetYMyroom: number;
}
