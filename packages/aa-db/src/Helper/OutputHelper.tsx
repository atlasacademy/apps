export function asPercent(value: number | undefined, pow: number): string {
    const decimal = (value ?? 0) / Math.pow(10, pow);

    return `${decimal}%`;
}
