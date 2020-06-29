export function asPercent(value: number | undefined): string {
    const decimal = (value ?? 0) / 10;

    return `${decimal}%`;
}
