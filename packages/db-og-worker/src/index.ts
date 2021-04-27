addEventListener('fetch', (event) => {
    const response = handleRequest(event.request).catch(() => new Response('error', { status: 500 }))
    event.respondWith(response)
})

class Handler {
    content = "";
    constructor(content : string = "") { this.content = content || this.content; }
    element(elem : Element) {
        elem.setAttribute('content', elem.getAttribute('content')! + '\n' + this.content);
    }
}

async function handleRequest(request : Request) {
    var url = new URL(request.url);
    if (url.pathname === '/') {
        let _ = await fetch('https://apps.atlasacademy.io/db/');
        return new HTMLRewriter().on('[property="og:description"]', new Handler(request.url)).transform(_);
    }
    else {
        url.hostname = 'apps.atlasacademy.io';
        return fetch(url.href, request);
    }
}