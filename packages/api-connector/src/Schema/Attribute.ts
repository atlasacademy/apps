export enum Attribute {
    HUMAN = "human",
    SKY = "sky",
    EARTH = "earth",
    STAR = "star",
    BEAST = "beast",
    VOID = "void",
}

export type AttributeAffinityMap = {
    [key in Attribute]?: {
        [key in Attribute]?: number;
    };
};
