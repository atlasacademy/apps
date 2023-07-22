import { NotFoundError, getAssetFromKV, mapRequestToAsset } from "@cloudflare/kv-asset-handler";
// @ts-ignore: Required import for getAssetFromKV
import manifestJSON from "__STATIC_CONTENT_MANIFEST";

const manifest = JSON.parse(manifestJSON);

export interface Env {
    atlas_api_cache: KVNamespace;
    __STATIC_CONTENT: KVNamespace;
}

export interface Event {
    request: Request;
    waitUntil: (promise: Promise<any>) => void;
}

const DEBUG = false;

const API_KV_TTL = 60 * 60 * 24;
const KV_EDGE_TTL = 60 * 60 * 3;
const API_FETCH_EDGE_TTL = 60 * 5;

class Handler {
    content = "";
    constructor(content: string = "") {
        this.content = content || this.content;
    }
    element(elem: Element) {
        elem.setAttribute("content", this.content || elem.getAttribute("content")!);
    }
}

function serveSinglePageApp(request: Request, basePath: string) {
    const url = new URL(request.url);
    let pathname = url.pathname,
        spaUrl = request.url;

    if (pathname.endsWith("/")) {
        pathname = pathname.slice(0, pathname.length - 1);
    }

    const splittedPath = pathname.split("/"),
        lastPath = splittedPath[splittedPath.length - 1];

    if (!lastPath.includes(".")) {
        spaUrl = `${url.protocol}//${url.host}/${basePath}/index.html`;
    }
    return mapRequestToAsset(new Request(spaUrl, request));
}

function toTitleCase(value: string): string {
    const matches = value.match(/[A-Z]*[a-z0-9]*/g);
    if (!matches || !matches.length) return value;

    const words = matches
        .filter((word) => word.length > 0)
        .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });

    return words.join(" ");
}

const PUA_map = new Map([
    ["\ue000", "神人"],
    ["\ue001", "鯖"],
    ["\ue002", "辿"],
]);

function replacePUA(inputString: string): string {
    return inputString
        .replace(/[\ue000-\uf8ff]/g, (match) => PUA_map.get(match) ?? "▊")
        .replace("\t", " ")
        .replace("\n", " ");
}

async function fetchApi(env: Env, region: string, endpoint: string, target: string, language: "jp" | "en" = "en") {
    const dataType = ["item", "function", "bgm", "mm"].includes(endpoint) ? "nice" : "basic";
    const url = `https://api.atlasacademy.io/${dataType}/${region}/${endpoint}/${target}?lang=${language}`;

    const kvData = await env.atlas_api_cache.get(url);
    if (kvData !== null) return JSON.parse(kvData) as Record<string, any>;

    const apiRes = await fetch(url, { cf: { cacheTtl: API_FETCH_EDGE_TTL } });
    if (apiRes.status !== 200) return undefined;

    const apiText = await apiRes.text();
    await env.atlas_api_cache.put(url, apiText, { expirationTtl: API_KV_TTL });
    return JSON.parse(apiText) as Record<string, any>;
}

function overwrite(
    response: { response: Response; pageUrl: string },
    title?: string,
    image?: string,
    description?: string
) {
    const defaultDescription = "Atlas Academy DB - FGO Game Data Navigator",
        metaDescription = replacePUA(description ?? title ?? `${defaultDescription} - without any of the fluffs.`),
        ogTitle = replacePUA(title ?? defaultDescription),
        ogDescription = defaultDescription;

    const titleRewriter = new HTMLRewriter()
        .on('[name="description"]', new Handler(metaDescription))
        .on('[property="og:url"]', new Handler(response.pageUrl))
        .on('[property="og:title"]', new Handler(ogTitle))
        .on('[property="og:description"]', new Handler(ogDescription));

    if (image === undefined) return titleRewriter.transform(response.response);

    return titleRewriter
        .on('[property="og:image"]', new Handler(image))
        .on('[property="og:image:alt"]', new Handler(replacePUA(`${title ?? "Atlas Academy"} icon`)))
        .transform(response.response);
}

const listingPageTitles = new Map([
    ["servants", "Servants"],
    ["craft-essences", "Craft Essences"],
    ["command-codes", "Command Codes"],
    ["mystic-codes", "Mystic Codes"],
    ["items", "Materials"],
    ["events", "Events"],
    ["wars", "Wars"],
    ["bgms", "BGMs"],
    ["master-missions", "Master Missions"],
    ["entities", "Entities Search"],
    ["skills", "Skills Search"],
    ["noble-phantasms", "Noble Phantasms Search"],
    ["funcs", "Functions Search"],
    ["buffs", "Buffs Search"],
    ["quests", "Quests Search"],
    ["scripts", "Scripts Search"],
    ["changes", "Changelog"],
    ["enemy-changes", "Enemy data Changelog"],
    ["faq", "FAQ"],
    ["classboard", "Class Board System"]
]);

const itemPageTitles = new Map([
    ["servant", { itemType: "Servant", endpoint: "servant" }],
    ["enemy", { itemType: "Entity", endpoint: "svt" }],
    ["skill", { itemType: "Skill", endpoint: "skill" }],
    ["noble-phantasm", { itemType: "Noble Phantasm", endpoint: "NP" }],
    ["craft-essence", { itemType: "Craft Essence", endpoint: "equip" }],
    ["command-code", { itemType: "Command Code", endpoint: "CC" }],
    ["item", { itemType: "Material", endpoint: "item" }],
    ["event", { itemType: "Event", endpoint: "event" }],
    ["war", { itemType: "War", endpoint: "war" }],
    ["quest", { itemType: "Quest", endpoint: "quest" }],
]);

const tabTitles = new Map([
    ["skill-1", "1st Skill"],
    ["skill-2", "2nd Skill"],
    ["skill-3", "3rd Skill"],
    ["passives", "Passive Skills"],
    ["stat-growth", "Stat Growth"],
    ["lore", "Profile"],
    ["assets", "Image Assets"],
    ["voices", "Voice Lines"],
]);

async function handleDBEvent(event: Event, env: Env) {
    const { pathname } = new URL(event.request.url),
        [region, subpage, target, ...paths] = pathname.replace("/db", "").split("/").filter(Boolean);

    const response = await getAssetFromKV(event, {
        mapRequestToAsset: (request) => serveSinglePageApp(request, "db"),
        cacheControl: { edgeTTL: KV_EDGE_TTL, bypassCache: DEBUG },
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: manifest,
    });

    const mutableResponse = new Response(response.body, response);

    if (region === "NA") {
        mutableResponse.headers.append("Content-Language", "en-US");
    } else if (region === "CN") {
        mutableResponse.headers.append("Content-Language", "zh-CN, en-US");
    } else if (region === "TW") {
        mutableResponse.headers.append("Content-Language", "zh-TW, en-US");
    } else if (region === "KR") {
        mutableResponse.headers.append("Content-Language", "ko-KR, en-US");
    } else if (region === "JP" || region === undefined) {
        mutableResponse.headers.append("Content-Language", "ja-JP, en-US");
    }

    const responseDetail = {
        response: mutableResponse,
        pageUrl: event.request.url,
    };

    const listingPageTitle = listingPageTitles.get(subpage);
    if (listingPageTitle !== undefined) {
        const title = `[${region}] ${listingPageTitle} - Atlas Academy DB`;
        return overwrite(responseDetail, title);
    }

    const language =
        event.request.cf !== undefined &&
        "country" in event.request.cf &&
        ["JP", "TW", "CN"].includes(event.request.cf.country as string)
            ? "jp"
            : "en";

    const itemPage = itemPageTitles.get(subpage);
    if (itemPage !== undefined) {
        const res = await fetchApi(env, region, itemPage.endpoint, target, language);
        if (res === undefined) {
            const title = `[${region}] ${itemPage.itemType} - ${target}`;
            return overwrite(responseDetail, title);
        }
        const {
            id,
            collectionNo,
            name,
            originalName,
            longName,
            face,
            icon,
            rarity,
            className,
            attribute,
            atkMax,
            hpMax,
            flags,
        } = res;

        let title = `[${region}] ${itemPage.itemType} - ${name}`,
            description: string | undefined = undefined;
        switch (subpage) {
            case "servant":
                title = `[${region}] ${rarity}★ ${toTitleCase(className)} - ${name}`;
                description =
                    `Fate/Grand Order [${region}] ${rarity}★ ${toTitleCase(className)} Servant ` +
                    `${name}${originalName !== name ? " (" + originalName + ")" : ""}` +
                    ". " +
                    `ID: ${id}, Collection No: ${collectionNo}, ` +
                    `Attribute: ${toTitleCase(attribute)}, Max ATK: ${atkMax}, Max HP: ${hpMax}.`;
                break;
            case "craft-essence":
                title = `[${region}] ${rarity}★ Craft Essence - ${name}`;
                description =
                    `Fate/Grand Order [${region}] ${rarity}★ Craft Essence ` +
                    `${name}${originalName !== name ? " (" + originalName + ")" : ""}` +
                    ". " +
                    `ID: ${id}, Collection No: ${collectionNo}, Max ATK: ${atkMax}, Max HP: ${hpMax}.`;
                break;
            case "command-code":
                title = `[${region}] ${rarity}★ Command Code - ${name}`;
                break;
            case "war":
                const warName = (flags.indexOf("subFolder") === -1 ? longName : name).replace("\n", " ");
                title = `[${region}] ${itemPage.itemType} - ${warName}`;
                break;
        }

        if (paths.length > 0) {
            const tabTitle =
                tabTitles.get(paths[0]) ??
                paths[0]
                    .split("-")
                    .map((word) => toTitleCase(word))
                    .join(" ");
            title = `${title} - ${tabTitle}`;
        }

        return overwrite(responseDetail, title, face ?? icon, description);
    }

    switch (subpage) {
        case "func": {
            const res = await fetchApi(env, region, "function", target, language);
            if (res === undefined) {
                const title = `[${region}] Function - ${target}`;
                return overwrite(responseDetail, title);
            }
            const { funcId, funcPopupText } = res;
            const funcTitle = funcPopupText === "" ? `Function: ${funcId}` : `Function ${funcId}: ${funcPopupText}`;
            const title = `[${region}] ${funcTitle}`;
            return overwrite(responseDetail, title);
        }
        case "bgm": {
            const res = await fetchApi(env, region, "bgm", target, language);
            if (res === undefined) {
                const title = `[${region}] BGM - ${target}`;
                return overwrite(responseDetail, title);
            }
            const { name, fileName, logo } = res;
            let bgmName = target;
            if (name !== "" && name !== "0") {
                bgmName = name;
            } else if (fileName !== "") {
                bgmName = fileName;
            }
            const title = `[${region}] BGM: ${bgmName.replace("\n", " ")}`;
            return overwrite(responseDetail, title, logo);
        }
        case "buff": {
            const res = await fetchApi(env, region, "buff", target, language);
            if (res === undefined) {
                const title = `[${region}] Buff - ${target}`;
                return overwrite(responseDetail, title);
            }
            const { id, name, icon } = res;
            const title = `[${region}] Buff ${id}: ${name}`;
            return overwrite(responseDetail, title, icon);
        }
        case "mystic-code": {
            const res = await fetchApi(env, region, "MC", target, language);
            if (res === undefined) {
                const title = `[${region}] Mystic Code - ${target}`;
                return overwrite(responseDetail, title);
            }
            const { name, item } = res;
            const title = `[${region}] Mystic Code - ${name}`;
            return overwrite(responseDetail, title, item.female);
        }
        case "ai": {
            const aiType = target === "svt" ? "Servant" : "Field";
            const title = `[${region}] ${aiType} AI ${paths[0]}`;
            return overwrite(responseDetail, title);
        }
        case "script": {
            const title = `[${region}] Script ${target}`;
            return overwrite(responseDetail, title);
        }
        case "master-mission": {
            const title = `[${region}] Master Mission ${target}`;
            return overwrite(responseDetail, title);
        }
        default:
            return mutableResponse;
    }
}

const worker = {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const event: Event = {
                request,
                waitUntil(promise: Promise<any>) {
                    return ctx.waitUntil(promise);
                },
            },
            url = new URL(request.url),
            { pathname } = url;

        try {
            if (pathname === "/sitemap.xml") {
                return fetch("https://apps.atlasacademy.io/sitemap.xml");
            } else if (pathname.startsWith("/.well-known")) {
                return fetch(url.href, { cf: { cacheTtl: 0 } });
            } else if (pathname.startsWith("/db")) {
                return await handleDBEvent(event, env);
            } else if (pathname.startsWith("/chargers") || pathname.startsWith("/fgo-docs/")) {
                url.hostname = "atlasacademy.github.io";
                if (pathname === "/chargers") {
                    url.pathname = "/chargers/";
                }
                return fetch(url.href, { cf: { cacheTtl: API_FETCH_EDGE_TTL } });
            }

            for (const basePath of ["drop-lookup", "paper-moon", "drop-serializer", "bingo", "fgo-docs"]) {
                if (pathname === `/${basePath}`) {
                    return Response.redirect(`${url}/`, 301);
                }
            }

            return await getAssetFromKV(event, {
                cacheControl: { edgeTTL: KV_EDGE_TTL, bypassCache: DEBUG },
                ASSET_NAMESPACE: env.__STATIC_CONTENT,
                ASSET_MANIFEST: manifest,
            });
        } catch (e) {
            if (DEBUG && e instanceof Error) {
                console.log(e.message || e.toString());
            }

            if (e instanceof NotFoundError) {
                const statusText = `Can't find "${pathname}"`;
                return new Response(statusText, { status: 404, statusText });
            }

            const statusText = `Failed to process "${pathname}"`;
            return new Response(statusText, { status: 500, statusText });
        }
    },
};

export default worker;
