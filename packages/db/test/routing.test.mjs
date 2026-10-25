import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { matchRoute } from "../src/RoutingMatch.ts";

const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const routes = [...app.matchAll(/<Route\s+([\s\S]*?)(?:render=|component=)/g)].map(([, attributes]) => ({
    path: /path="([^"]+)"/.exec(attributes)[1],
    sensitive: /sensitive=\{true\}/.test(attributes),
}));
// The lower-case region redirect sets sensitive after its render callback.
routes[0].sensitive = true;

const resolve = (pathname) => {
    for (const route of routes) {
        const params = matchRoute(route.path, pathname, route.sensitive);
        if (params !== null) return { path: route.path, params };
    }
};

test("detail pages and optional tabs retain numeric ID constraints", () => {
    assert.deepEqual(resolve("/JP/servant/100100/skills").params, { region: "JP", id: "100100", tab: "skills" });
    assert.deepEqual(resolve("/NA/servant/100100").params, { region: "NA", id: "100100" });
    assert.match(resolve("/NA/servant/Mash").path, /:query/);
    assert.deepEqual(resolve("/NA/servant/Mash").params, { region: "NA", endpoint: "servant", query: "Mash" });
});

test("lower-case regions redirect without intercepting upper-case detail URLs", () => {
    assert.deepEqual(resolve("/jp/servant/100100").params, { region: "jp", tail: "servant/100100" });
    assert.match(resolve("/JP/servant/100100").path, /:id/);
});

test("quest phase and stage URLs keep all parameters", () => {
    assert.deepEqual(resolve("/JP/quest/94000001/2/3").params, {
        region: "JP",
        id: "94000001",
        phase: "2",
        stage: "3",
    });
    assert.deepEqual(resolve("/JP/quest/94000001/2").params, { region: "JP", id: "94000001", phase: "2" });
});

test("list pages, class boards, and home URLs match their original routes", () => {
    assert.deepEqual(resolve("/NA/servants").params, { region: "NA" });
    assert.deepEqual(resolve("/JP/classboard/1").params, { region: "JP", id: "1" });
    assert.doesNotMatch(resolve("/NA/classboard/1").path, /classboard/);
    assert.deepEqual(resolve("/JP").params, { region: "JP" });
    assert.deepEqual(resolve("/JP/").params, { region: "JP" });
    assert.equal(resolve("/").path, "/");
});

test("encoded script names decode after matching and malformed URLs fail safely", () => {
    assert.deepEqual(resolve("/JP/script/01%20intro").params, { region: "JP", id: "01 intro" });
    assert.equal(matchRoute("/:region/script/:id", "/JP/script/%E0%A4%A"), null);
    assert.equal(resolve("/unrecognized/path/with/too/many/segments").path, "*");
});

test("AI routes reject unsupported AI types and allow a trailing slash", () => {
    assert.deepEqual(resolve("/JP/ai/field/123/").params, { region: "JP", aiType: "field", id: "123" });
    assert.equal(resolve("/JP/ai/invalid/123").path, "*");
});
