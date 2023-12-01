export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export const numToPct = (value: number) =>
    value < 1 ? `${(value * 100).toFixed(2)}%` : `${Math.round(value * 100).toLocaleString()}%`;
