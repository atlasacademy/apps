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

function overwrite(_: Response, overwrite_: string) {
    return new HTMLRewriter()
        .on('[property="og:title"]', new Handler(overwrite_))
        .transform(_);
}

async function handleRequest(request: Request) {
    let url = new URL(request.url);
    let { pathname } = url;

    if (pathname.startsWith("/db/")) pathname = pathname.replace("/db/", "");

    let [region, subpage, target, ...paths] = pathname
        .split("/")
        .filter(Boolean);

    url.hostname = "apps.atlasacademy.io";
    let page = await fetch(url.href, request);

    switch (subpage) {
        case `servant`: {
            let { name } = await fetch(
                `https://api.atlasacademy.io/basic/${region}/servant/${target}?lang=en`
            ).then((res) => res.json());
            return overwrite(
                page,
                `[${region}] Servant - ${name} - Atlas Academy DB`
            );
        }
        default:
            return new Response(page.body, page);
    }
}
