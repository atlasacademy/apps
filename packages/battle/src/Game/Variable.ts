export enum VariableType {
    INT,
    LONG,
    FLOAT,
    DOUBLE,
}

export class Variable {
    constructor(private readonly type: VariableType, private _value: number) {
        switch (type) {
            case VariableType.INT:
            case VariableType.LONG:
                this._value = Math.floor(this._value);
                break;
            case VariableType.FLOAT:
                this._value = Math.fround(this._value);
                break;
        }
    }

    public static double(value: number): Variable {
        return Variable.make(VariableType.DOUBLE, value);
    }

    public static float(value: number): Variable {
        return Variable.make(VariableType.FLOAT, value);
    }

    public static floatRate(value: any): Variable {
        return Variable.make(VariableType.FLOAT, value).divide(Variable.float(1000));
    }

    public static int(value: number): Variable {
        return Variable.make(VariableType.INT, value);
    }

    public static make(type: VariableType, value: number): Variable {
        return new Variable(type, value);
    }

    add(variable: Variable): Variable {
        const result = this._value + variable.value();

        return new Variable(this.type, result);
    }

    cast(type: VariableType): Variable {
        return new Variable(type, this._value);
    }

    copy(): Variable {
        return new Variable(this.type, this._value);
    }

    divide(variable: Variable): Variable {
        const result = this._value / variable.value();

        return new Variable(this.type, result);
    }

    multiply(variable: Variable): Variable {
        const result = this._value * variable.value();

        return new Variable(this.type, result);
    }

    subtract(variable: Variable): Variable {
        const result = this._value - variable.value();

        return new Variable(this.type, result);
    }

    value(): number {
        return this._value;
    }
}
