addEventListener("fetch", (event) => {
    const response = handleRequest(event.request).catch(
        () => new Response("error", { status: 500 })
    );
    event.respondWith(response);
});

class Handler {
    content = "";
    constructor(content: string = "") {
        this.content = content || this.content;
    }
    element(elem: Element) {
        elem.setAttribute(
            "content",
            this.content || elem.getAttribute("content")!
        );
    }
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

async function fetchApi(
    region: string,
    endpoint: string,
    target: string,
    language: "jp" | "en" = "en"
) {
    const dataType = ["item", "function"].includes(endpoint) ? "nice" : "basic";
    const url = `https://api.atlasacademy.io/${dataType}/${region}/${endpoint}/${target}?lang=${language}`;
    return fetch(url).then((res) => res.json());
}

function overwrite(
    response: Response,
    title: string,
    image?: string,
    description?: string
) {
    const defaultDescription =
        "Atlas Academy DB - FGO Game Data Navigator - without any of the fluff.";
    const metaDescription = `${description ?? title} - ${defaultDescription}`;
    const ogDescription = description ?? defaultDescription;

    const titleRewriter = new HTMLRewriter()
        .on('[name="description"]', new Handler(metaDescription))
        .on('[property="og:title"]', new Handler(title))
        .on('[property="og:description"]', new Handler(ogDescription));

    if (image === undefined) return titleRewriter.transform(response);

    return titleRewriter
        .on('[property="og:image"]', new Handler(image))
        .on('[property="og:image:alt"]', new Handler(`${title} icon`))
        .transform(response);
}

const listingPageTitles = new Map([
    ["servants", "Servants"],
    ["craft-essences", "Craft Essences"],
    ["command-codes", "Command Codes"],
    ["mystic-codes", "Mystic Codes"],
    ["items", "Materials"],
    ["events", "Events"],
    ["wars", "Wars"],
    ["entities", "Entities Search"],
    ["skills", "Skills Search"],
    ["noble-phantasms", "Noble Phantasms Search"],
    ["functions", "Functions Search"],
    ["buffs", "Buffs Search"],
    ["changes", "Changelog"],
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

async function handleRequest(request: Request) {
    const language = ["JP", "TW", "CN"].includes(request.cf.country)
        ? "jp"
        : "en";

    let url = new URL(request.url);
    let { pathname } = url;

    if (pathname.startsWith("/db/")) pathname = pathname.replace("/db/", "");

    let [region, subpage, target, ...paths] = pathname
        .split("/")
        .filter(Boolean);

    url.hostname = "apps.atlasacademy.io";
    let page = await fetch(url.href, request);

    const listingPageTitle = listingPageTitles.get(subpage);
    if (listingPageTitle !== undefined) {
        const title = `[${region}] ${listingPageTitle} - Atlas Academy DB`;
        return overwrite(page, title);
    }

    const itemPage = itemPageTitles.get(subpage);
    if (itemPage !== undefined) {
        const res = await fetchApi(region, itemPage.endpoint, target, language);
        const { name, longName, face, icon, rarity, className } = res;

        let title = `[${region}] ${itemPage.itemType} - ${name}`;
        switch (subpage) {
            case "servant":
                title = `[${region}] ${rarity}★ ${toTitleCase(
                    className
                )} - ${name}`;
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

        return overwrite(page, title, face ?? icon);
    }

    switch (subpage) {
        case "func": {
            const { funcId, funcPopupText } = await fetchApi(
                region,
                "function",
                target,
                language
            );
            const funcTitle =
                funcPopupText === ""
                    ? `Function: ${funcId}`
                    : `Function ${funcId}: ${funcPopupText}`;
            const title = `[${region}] ${funcTitle}`;
            return overwrite(page, title);
        }
        case "buff": {
            const { id, name, icon } = await fetchApi(
                region,
                "buff",
                target,
                language
            );
            const title = `[${region}] Buff ${id}: ${name}`;
            return overwrite(page, title, icon);
        }
        case "ai": {
            const aiType = target === "svt" ? "Servant" : "Field";
            const title = `[${region}] ${aiType} AI ${paths[0]}`;
            return overwrite(page, title);
        }
        default:
            return new Response(page.body, page);
    }
}
