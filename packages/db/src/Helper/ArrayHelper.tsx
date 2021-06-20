export const areIdenticalArrays = (arrayA: number[], arrayB: number[]) => {
    if (arrayA.length !== arrayB.length) return false;

    for (let i = 0; i < arrayA.length; i++) {
        if (arrayA[i] !== arrayB[i]) return false;
    }

    return true;
};
