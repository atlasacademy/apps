import { faSearch } from "@fortawesome/free-solid-svg-icons";
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
        query: string | null;
        scripts: Script.ScriptSearchResult[];
        searched: boolean;
    }
>();

const getQueryString = (query?: string | null) => {
    return getURLSearchParams({
        query: query ?? undefined,
    }).toString();
};

const ScriptsPage = ({ region, path }: { region: Region; path: string }) => {
    const history = useHistory(),
        location = useLocation(),
        searchParams = new URLSearchParams(location.search),
        thisStateCache = stateCache.get(region),
        [query, setQuery] = useState(searchParams.get("query") ?? thisStateCache?.query ?? null),
        [scripts, setScripts] = useState<Script.ScriptSearchResult[]>(thisStateCache?.scripts ?? []),
        [error, setError] = useState<AxiosError | undefined>(undefined),
        [searching, setSearching] = useState(false),
        [searched, setSearched] = useState(thisStateCache?.searched ?? false);

    const search = (query: string) => {
        setSearching(true);
        Api.searchScript(query)
            .then((r) => {
                setSearched(true);
                setScripts(r);
                setSearching(false);
            })
            .catch((e) => setError(e));
    };

    const searchButton = (query: string | null) => {
        if (query === null || query === "") {
            alert("Please enter a query");
        } else {
            search(query);
            history.replace(`/${region}/${path}?${getQueryString(query)}`);
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
        if (!stateCache.has(region) && query !== null && query !== "") {
            // for first run if URL query string is not empty
            search(query);
        }
    }, [region, query]);

    useEffect(() => {
        stateCache.set(region, { query, scripts, searched });
    }, [region, query, scripts, searched]);

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
            <p>
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
            </p>
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
                            setQuery(ev.target.value !== "" ? ev.target.value : null);
                        }}
                    />
                </Form.Group>
                <Button variant={"primary"} onClick={() => searchButton(query)}>
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
                                <th>Script ID</th>
                                <th>Snippet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scripts.map((script) => (
                                <tr key={script.scriptId}>
                                    <td>
                                        <ScriptDescriptor region={region} scriptId={script.scriptId} scriptType="" />
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
