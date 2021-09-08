export enum CommonConsumeType {
    ITEM = "item",
}

export interface CommonConsume {
    id: number;
    priority: number;
    type: CommonConsumeType;
    objectId: number;
    num: number;
}
