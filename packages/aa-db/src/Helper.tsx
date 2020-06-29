export function asPercent(value: number): string {
    const decimal = value / 10;

    return `${decimal}%`;
}
