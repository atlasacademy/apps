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
