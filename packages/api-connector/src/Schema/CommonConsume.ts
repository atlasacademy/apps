export enum CommonConsumeType {
    ITEM = "item",
    AP = "ap",
}

export interface CommonConsume {
    id: number;
    priority: number;
    type: CommonConsumeType;
    objectId: number;
    num: number;
}
