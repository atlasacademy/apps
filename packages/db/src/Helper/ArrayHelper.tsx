export const areIdenticalArrays = (arrayA: number[], arrayB: number[]) => {
    if (arrayA.length !== arrayB.length) return false;

    for (let i = 0; i < arrayA.length; i++) {
        if (arrayA[i] !== arrayB[i]) return false;
    }

    return true;
};

export const isSubset = (bigger: number[], smaller: number[]) => {
    const biggerSet = new Set(bigger);
    for (const s of smaller) {
        if (!biggerSet.has(s)) {
            return false;
        }
    }
    return true;
};

export function dedupe<T>(array: T[]): T[] {
    return Array.from(new Set(array));
}

export function doIntersect<T>(arrayA: T[], arrayB: T[]): boolean {
    for (const element of arrayA) {
        if (arrayB.includes(element)) return true;
    }

    return false;
}

export function emptyOrUndefinded<T>(array: T[] | undefined): boolean {
    return array === undefined || array.length === 0;
}

export function listNumber(array: number[]): string {
    return array.map((num) => num.toString()).join(", ");
}
