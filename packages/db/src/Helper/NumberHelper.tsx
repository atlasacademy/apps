export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export const toFixedLocale = (input: number, digits: number) =>
    input.toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });

export const numToPct = (value: number) =>
    value < 1 ? `${toFixedLocale(value * 100, 2)}%` : `${Math.round(value * 100).toLocaleString()}%`;
