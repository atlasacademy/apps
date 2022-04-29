import { faSearch, faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";

import { Region, Script } from "@atlasacademy/api-connector";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import ScriptDescriptor from "../Descriptor/ScriptDescriptor";
import { getURLSearchParams } from "../Helper/StringHelper";
import Manager from "../Setting/Manager";

import "./ScriptsPage.css";

const stateCache = new Map<
    Region,
    {
        query: string | undefined;
        scriptFileName: string | undefined;
        scripts: Script.ScriptSearchResult[];
        searched: boolean;
    }
>();

const getQueryString = (query?: string, scriptFileName?: string) => {
    return getURLSearchParams({
        query,
        scriptFileName,
    }).toString();
};

type ScriptResultSort = "Score" | "ScriptIdAscending" | "ScriptIdDescending";

const ScriptsPage = ({ region, path }: { region: Region; path: string }) => {
    const history = useHistory(),
        location = useLocation(),
        searchParams = new URLSearchParams(location.search),
        thisStateCache = stateCache.get(region),
        [query, setQuery] = useState(searchParams.get("query") ?? thisStateCache?.query ?? undefined),
        [scriptFileName, setScriptFileName] = useState(
            searchParams.get("scriptFileName") ?? thisStateCache?.scriptFileName ?? undefined
        ),
        [scripts, setScripts] = useState<Script.ScriptSearchResult[]>(thisStateCache?.scripts ?? []),
        [error, setError] = useState<AxiosError | undefined>(undefined),
        [searching, setSearching] = useState(false),
        [searched, setSearched] = useState(thisStateCache?.searched ?? false),
        [resultSort, setResultSort] = useState<ScriptResultSort>("Score");

    const search = (query: string, scriptFileName?: string) => {
        setSearching(true);
        Api.searchScript(query, scriptFileName)
            .then((r) => {
                setSearched(true);
                setScripts(r);
                setSearching(false);
            })
            .catch((e) => setError(e));
    };

    const searchButton = (query?: string, scriptFileName?: string) => {
        if (query === undefined || query.trim() === "") {
            alert("Please enter a query");
        } else {
            search(query, scriptFileName);
            history.replace(`/${region}/${path}?${getQueryString(query, scriptFileName)}`);
        }
    };

    useEffect(() => {
        // when switching between regions using the navbar
        Manager.setRegion(region);
        if (stateCache.has(region)) {
            const queryString = getQueryString(stateCache.get(region)?.query);
            history.replace(`/${region}/${path}?${queryString}`);
        }
    }, [region, path, history]);

    useEffect(() => {
        if (!stateCache.has(region) && query !== undefined && query !== "") {
            // for first run if URL query string is not empty
            search(query, scriptFileName);
        }
    }, [region, query, scriptFileName]);

    useEffect(() => {
        stateCache.set(region, { query, scriptFileName, scripts, searched });
    }, [region, query, scriptFileName, scripts, searched]);

    document.title = `[${region}] Scripts - Atlas Academy DB`;

    if (error !== undefined) {
        history.replace(`/${region}/${path}`);
        return (
            <div style={{ textAlign: "center" }}>
                <ErrorStatus error={error} />
                <Button
                    variant={"primary"}
                    onClick={() => {
                        setError(undefined);
                        setSearching(false);
                    }}
                >
                    Redo the Search
                </Button>
            </div>
        );
    }

    return (
        <>
            {searching ? <Loading /> : null}
            <h1>Scripts Search</h1>
            <div className="my-3">
                Supports
                <ul>
                    <li>
                        <code>this OR that</code>
                    </li>
                    <li>
                        <code>this -but -not -that</code>
                    </li>
                    <li>
                        <code>"this exact phrase"</code>
                    </li>
                    <li>
                        <code>prefix*</code>
                    </li>
                </ul>
                <a
                    href="https://groonga.org/docs/reference/grn_expr/query_syntax.html"
                    target="_blank"
                    rel="noreferrer"
                >
                    Syntax Reference
                </a>{" "}
                (Queries starting with <code>column:</code> are not supported).
            </div>
            <form
                onSubmit={(ev: React.FormEvent) => {
                    ev.preventDefault();
                    searchButton(query);
                }}
            >
                <Form.Group>
                    <Form.Label>Search Query</Form.Label>
                    <Form.Control
                        value={query ?? ""}
                        onChange={(ev) => {
                            setQuery(ev.target.value !== "" ? ev.target.value : undefined);
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Script File Name</Form.Label>
                    <Form.Control
                        value={scriptFileName ?? ""}
                        onChange={(ev) => {
                            setScriptFileName(ev.target.value !== "" ? ev.target.value : undefined);
                        }}
                    />
                    <Form.Text className="text-muted">
                        The script ID should contain this string. For example 30001 for LB1, 94036 for Ooku.
                    </Form.Text>
                </Form.Group>
                <Button variant={"primary"} onClick={() => searchButton(query, scriptFileName)}>
                    Search <FontAwesomeIcon icon={faSearch} />
                </Button>{" "}
            </form>

            <hr />

            {searched ? (
                <h5>
                    Found{" "}
                    <b>
                        {scripts.length}
                        {scripts.length === 50 ? "+" : ""}
                    </b>{" "}
                    result
                    {scripts.length > 1 ? "s" : ""}
                </h5>
            ) : null}
            {scripts.length > 0 ? (
                <>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th className="text-nowrap align-bottom">
                                    <Button
                                        variant=""
                                        className="py-0 border-0 align-bottom"
                                        onClick={() => {
                                            switch (resultSort) {
                                                case "Score":
                                                    setResultSort("ScriptIdAscending");
                                                    break;
                                                case "ScriptIdAscending":
                                                    setResultSort("ScriptIdDescending");
                                                    break;
                                                case "ScriptIdDescending":
                                                    setResultSort("Score");
                                                    break;
                                            }
                                        }}
                                    >
                                        {resultSort === "Score" ? (
                                            <FontAwesomeIcon
                                                icon={faSort}
                                                title="Sorted by how many keywords are included"
                                            />
                                        ) : resultSort === "ScriptIdAscending" ? (
                                            <FontAwesomeIcon icon={faSortUp} title="Sorted by Script ID (Ascending)" />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faSortDown}
                                                title="Sorted by Script ID (Descending)"
                                            />
                                        )}
                                    </Button>
                                    Script ID
                                </th>
                                <th>Snippet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scripts
                                .sort((a, b) => {
                                    switch (resultSort) {
                                        case "Score":
                                            return b.score - a.score || a.scriptId.localeCompare(b.scriptId, "en");
                                        case "ScriptIdAscending":
                                            return a.scriptId.localeCompare(b.scriptId, "en");
                                        case "ScriptIdDescending":
                                            return b.scriptId.localeCompare(a.scriptId, "en");
                                        default:
                                            return 0;
                                    }
                                })
                                .map((script) => (
                                    <tr key={script.scriptId}>
                                        <td>
                                            <ScriptDescriptor
                                                region={region}
                                                scriptId={script.scriptId}
                                                scriptType=""
                                            />
                                        </td>
                                        <td
                                            dangerouslySetInnerHTML={{
                                                __html: script.snippets[0],
                                            }}
                                        ></td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </>
            ) : null}
        </>
    );
};

export default ScriptsPage;
