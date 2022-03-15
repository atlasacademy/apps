export enum PartialType {
    PARTICLE = "particle",
    REFERENCE = "reference",
    TEXT = "text",
    VALUE = "value",
}

export enum ReferenceType {
    BUFF = "buff",
    CARD = "card",
    SKILL = "skill",
    TRAIT = "trait",
}

export enum ValueType {
    NUMBER = "number",
    PERCENT = "percent",
    UNKNOWN = "unknown",
}

export abstract class BasePartial {
    public readonly type: PartialType;
    public readonly value: any;

    protected constructor(type: PartialType, value: any) {
        this.type = type;
        this.value = value;
    }
}

export class ParticlePartial extends BasePartial {
    constructor(value: string) {
        super(PartialType.PARTICLE, value);
    }
}

export abstract class ReferencePartial extends BasePartial {
    public readonly referenceType: ReferenceType;

    protected constructor(referenceType: ReferenceType, value: any) {
        super(PartialType.REFERENCE, value);
        this.referenceType = referenceType;
    }
}

export class TextPartial extends BasePartial {
    constructor(value: string) {
        super(PartialType.TEXT, value);
    }
}

export class ValuePartial extends BasePartial {
    public readonly valueType: ValueType;

    constructor(valueType: ValueType, value: number) {
        super(PartialType.VALUE, value);
        this.valueType = valueType;
    }
}

export class Descriptor {
    private readonly _partials: BasePartial[];

    constructor(partials: BasePartial[]) {
        this._partials = partials;
    }

    partials() {
        return this._partials;
    }

    references() {
        return this._partials.filter((partial) => partial.type === PartialType.REFERENCE);
    }
}
