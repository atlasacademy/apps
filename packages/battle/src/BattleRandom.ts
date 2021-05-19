export enum BattleRandomType {
    AVERAGE,
    RANDOM,
    LOW,
    HIGH,
    MANUAL,
}

export class BattleRandom {

    constructor(public type: BattleRandomType,
                public values: number[] = []) {
        //
    }

    clone(): BattleRandom {
        return new BattleRandom(this.type, this.values);
    }

    generate(min: number, max: number): number {
        if (this.type === BattleRandomType.HIGH)
            return Math.floor(max) - 1;

        const range = Math.floor(max) - Math.floor(min),
            plus = Math.floor(range * this.next());

        return Math.floor(min) + plus;
    }

    setType(type: BattleRandomType, values: number[] = []) {
        this.type = type;
        this.values = values;
    }

    private next(): number {
        switch (this.type) {
            case BattleRandomType.AVERAGE:
                return 0.5;
            case BattleRandomType.RANDOM:
                return Math.random();
            case BattleRandomType.HIGH:
                throw new Error('THIS IS A BAD IDEA');
            case BattleRandomType.LOW:
                return 0;
            case BattleRandomType.MANUAL:
                const value = this.values.shift();
                if (value === undefined)
                    throw new Error('NO MANUAL VALUES AVAILABLE');

                return value;
        }
    }

}
