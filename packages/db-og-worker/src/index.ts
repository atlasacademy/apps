import { getAssetFromKV, mapRequestToAsset } from "@cloudflare/kv-asset-handler";

const DEBUG = false;

const KV_EDGE_TTL = 60 * 60 * 3;
const API_FETCH_EDGE_TTL = 60 * 5;

addEventListener("fetch", (event) => {
    const response = handleEvent(event).catch(() => fetch(event.request));
    event.respondWith(response);
});

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

async function fetchApi(region: string, endpoint: string, target: string, language: "jp" | "en" = "en") {
    const dataType = ["item", "function", "bgm", "mm"].includes(endpoint) ? "nice" : "basic";
    const url = `https://api.atlasacademy.io/${dataType}/${region}/${endpoint}/${target}?lang=${language}`;
    return fetch(url, { cf: { cacheTtl: API_FETCH_EDGE_TTL } });
}

function overwrite(
    response: { response: Response; pageUrl: string },
    title?: string,
    image?: string,
    description?: string
) {
    const defaultDescription = "Atlas Academy DB - FGO Game Data Navigator";
    const metaCustomDesc = (description ?? title) !== undefined ? `${description ?? title} - ` : "";
    const metaDescription = metaCustomDesc + `${defaultDescription} - without any of the fluffs.`;
    const ogDescription = description ?? defaultDescription;

    const titleRewriter = new HTMLRewriter()
        .on('[name="description"]', new Handler(metaDescription))
        .on('[property="og:url"]', new Handler(response.pageUrl))
        .on('[property="og:title"]', new Handler(title ?? defaultDescription))
        .on('[property="og:description"]', new Handler(ogDescription));

    if (image === undefined) return titleRewriter.transform(response.response);

    return titleRewriter
        .on('[property="og:image"]', new Handler(image))
        .on('[property="og:image:alt"]', new Handler(`${title ?? "Atlas Academy"} icon`))
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
]);

const itemPageTitles = new Map([
    ["servant", { itemType: "Servant", endpoint: "servant" }],
    ["enemy", { itemType: "Entity", endpoint: "svt" }],
    ["skill", { itemType: "Skill", endpoint: "skill" }],
    ["noble-phantasm", { itemType: "Noble Phantasm", endpoint: "NP" }],
    ["craft-essence", { itemType: "Craft Essence", endpoint: "equip" }],
    ["command-code", { itemType: "Command Code", endpoint: "CC" }],
    ["mystic-code", { itemType: "Mystic Code", endpoint: "MC" }],
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

async function handleDBEvent(event: FetchEvent) {
    const { pathname } = new URL(event.request.url),
        [region, subpage, target, ...paths] = pathname.replace("/db", "").split("/").filter(Boolean);

    const response = await getAssetFromKV(event, {
        mapRequestToAsset: (request) => serveSinglePageApp(request, "db"),
        cacheControl: { edgeTTL: KV_EDGE_TTL, bypassCache: DEBUG },
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

    const language = ["JP", "TW", "CN"].includes(event.request.cf?.country ?? "") ? "jp" : "en";

    const itemPage = itemPageTitles.get(subpage);
    if (itemPage !== undefined) {
        const res = await fetchApi(region, itemPage.endpoint, target, language);
        if (res.status !== 200) {
            const title = `[${region}] ${itemPage.itemType} - ${target}`;
            return overwrite(responseDetail, title);
        }
        const { name, longName, face, icon, rarity, className } = await res.json();

        let title = `[${region}] ${itemPage.itemType} - ${name}`;
        switch (subpage) {
            case "servant":
                title = `[${region}] ${rarity}★ ${toTitleCase(className)} - ${name}`;
                break;
            case "craft-essence":
                title = `[${region}] ${rarity}★ Craft Essence - ${name}`;
                break;
            case "command-code":
                title = `[${region}] ${rarity}★ Command Code - ${name}`;
                break;
            case "war":
                const warName = longName.replace("\n", " ");
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

        return overwrite(responseDetail, title, face ?? icon);
    }

    switch (subpage) {
        case "func": {
            const res = await fetchApi(region, "function", target, language);
            if (res.status !== 200) {
                const title = `[${region}] Function - ${target}`;
                return overwrite(responseDetail, title);
            }
            const { funcId, funcPopupText } = await res.json();
            const funcTitle = funcPopupText === "" ? `Function: ${funcId}` : `Function ${funcId}: ${funcPopupText}`;
            const title = `[${region}] ${funcTitle}`;
            return overwrite(responseDetail, title);
        }
        case "bgm": {
            const res = await fetchApi(region, "bgm", target, language);
            if (res.status !== 200) {
                const title = `[${region}] BGM - ${target}`;
                return overwrite(responseDetail, title);
            }
            const { name, fileName, logo } = await res.json();
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
            const res = await fetchApi(region, "buff", target, language);
            if (res.status !== 200) {
                const title = `[${region}] Buff - ${target}`;
                return overwrite(responseDetail, title);
            }
            const { id, name, icon } = await res.json();
            const title = `[${region}] Buff ${id}: ${name}`;
            return overwrite(responseDetail, title, icon);
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

async function handleEvent(event: FetchEvent) {
    const { protocol, host, pathname } = new URL(event.request.url);

    try {
        if (pathname === "/sitemap.xml") {
            return fetch("https://apps.atlasacademy.io/sitemap.xml");
        }
        if (pathname.startsWith("/.well-known")) {
            return fetch(event.request.url, { cf: { cacheTtl: 0 } });
        }
        if (pathname.startsWith("/db")) {
            return handleDBEvent(event);
        }
        for (const basePath of ["drop-lookup", "paper-moon", "drop-serializer", "bingo"]) {
            if (pathname === `/${basePath}`) {
                return Response.redirect(`${protocol}//${host}/${basePath}/`, 301);
            }
        }
        return await getAssetFromKV(event, {
            cacheControl: { edgeTTL: KV_EDGE_TTL, bypassCache: DEBUG },
        });
    } catch (e) {
        if (DEBUG && e instanceof Error) return new Response(e.message || e.toString(), { status: 500 });

        return new Response(`"${pathname}" not found`, {
            status: 404,
            statusText: `"${pathname}" not found`,
        });
    }
}
