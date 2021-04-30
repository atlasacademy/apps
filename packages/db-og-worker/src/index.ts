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

async function fetchApi(
    region: string,
    endpoint: string,
    target: string,
    language: string = "en"
) {
    const dataType = ["item", "function"].includes(endpoint) ? "nice" : "basic";
    const url = `https://api.atlasacademy.io/${dataType}/${region}/${endpoint}/${target}?lang=${language}`;
    return fetch(url).then((res) => res.json());
}

function overwrite(response: Response, title: string, image?: string) {
    const titleRewriter = new HTMLRewriter().on(
        '[property="og:title"]',
        new Handler(title)
    );
    if (image !== undefined) {
        return titleRewriter
            .on('[property="og:image"]', new Handler(image))
            .transform(response);
    } else {
        return titleRewriter.transform(response);
    }
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

async function handleRequest(request: Request) {
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
        const { name, face, icon } = await fetchApi(
            region,
            itemPage.endpoint,
            target
        );
        const title = `[${region}] ${itemPage.itemType} - ${name} - Atlas Academy DB`;
        return overwrite(page, title, face || icon);
    }

    switch (subpage) {
        case "func": {
            const { funcId, funcPopupText } = await fetchApi(
                region,
                "function",
                target
            );
            const funcTitle =
                funcPopupText === ""
                    ? `Function: ${funcId}`
                    : `Function ${funcId}: ${funcPopupText}`;
            const title = `[${region}] ${funcTitle} - Atlas Academy DB`;
            return overwrite(page, title);
        }
        case "buff": {
            const { id, name, icon } = await fetchApi(region, "buff", target);
            const title = `[${region}] Buff ${id}: ${name} - Atlas Academy DB`;
            return overwrite(page, title, icon);
        }
        case "ai": {
            const aiType = target === "svt" ? "Servant" : "Field";
            const title = `[${region}] ${aiType} AI ${paths[0]} - Atlas Academy DB`;
            return overwrite(page, title);
        }
        default:
            return new Response(page.body, page);
    }
}
