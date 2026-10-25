const cache = new Map<string, { regex: RegExp; names: string[] }>();

// The existing URLs include numeric IDs, region constraints, optional tabs, and legacy hash redirects.
export function matchRoute(path: string, pathname: string, sensitive = false): Record<string, string> | null {
    if (path === "*") return {};
    const key = `${sensitive}:${path}`;
    let compiled = cache.get(key);
    if (!compiled) {
        const names: string[] = [];
        const tokens = /\/:([A-Za-z][A-Za-z0-9]*)(?:\(([^)]*)\))?([?*])?/g;
        const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let source = "^",
            end = 0;
        for (const token of path.matchAll(tokens)) {
            source += escape(path.slice(end, token.index));
            names.push(token[1]);
            const pattern = token[2] ?? "[^/]+";
            source += token[3] ? `(?:/(${pattern}))?` : `/(${pattern})`;
            end = token.index + token[0].length;
        }
        source += escape(path.slice(end)) + "/*$";
        compiled = { regex: new RegExp(source, sensitive ? "" : "i"), names };
        cache.set(key, compiled);
    }
    const match = compiled.regex.exec(pathname);
    if (!match) return null;
    const params: Record<string, string> = {};
    try {
        compiled.names.forEach((name, index) => {
            if (match[index + 1] !== undefined) params[name] = decodeURIComponent(match[index + 1]);
        });
    } catch {
        return null;
    }
    return params;
}
