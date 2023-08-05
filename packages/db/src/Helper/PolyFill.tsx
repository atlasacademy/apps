export function flatten<T>(arr: T[][]): T[] {
    return arr.reduce((acc, val) => acc.concat(val), []);
}

export function fromEntries<T>(entries: Map<string, T>): { [key: string]: T } {
    return Array.from(entries.entries()).reduce(
        (acc, [key, val]) => {
            acc[key] = val;
            return acc;
        },
        {} as { [key: string]: T }
    );
}
