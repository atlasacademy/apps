export enum BattleRandomType {
    AVERAGE,
    RANDOM,
    LOW,
    HIGH,
    MANUAL,
    CALLBACK,
}

export class BattleRandom {
    constructor(
        public type: BattleRandomType,
        public values: number[] = [],
        public callback?: (message: string) => Promise<number>
    ) {
        //
    }

    clone(): BattleRandom {
        return new BattleRandom(this.type, this.values);
    }

    async generate(min: number, max: number, message: string = ""): Promise<number> {
        if (this.type === BattleRandomType.HIGH) return Math.floor(max) - 1;

        const range = Math.floor(max) - Math.floor(min),
            plus = Math.floor(range * (await this.next(message)));

        return Math.floor(min) + plus;
    }

    setCallbackType(callback: (message: string) => Promise<number>) {
        this.type = BattleRandomType.CALLBACK;
        this.callback = callback;
        this.values = [];
    }

    setManualType(values: number[]) {
        this.type = BattleRandomType.MANUAL;
        this.callback = undefined;
        this.values = values;
    }

    setType(type: BattleRandomType) {
        this.type = type;
        this.callback = undefined;
        this.values = [];
    }

    private async next(message: string): Promise<number> {
        switch (this.type) {
            case BattleRandomType.AVERAGE:
                return 0.5;
            case BattleRandomType.RANDOM:
                return Math.random();
            case BattleRandomType.HIGH:
                throw new Error("THIS IS A BAD IDEA");
            case BattleRandomType.LOW:
                return 0;
            case BattleRandomType.MANUAL:
                const value = this.values.shift();
                if (value === undefined) throw new Error("NO MANUAL VALUES AVAILABLE");

                return value;
            case BattleRandomType.CALLBACK:
                if (this.callback === undefined) throw new Error("CALLBACK NOT SET");

                return await this.callback(message);
        }
    }
}
