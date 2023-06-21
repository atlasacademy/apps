import { faSearch, faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Button, Dropdown, Form, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

import { Region, Script, War } from "@atlasacademy/api-connector";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import SearchableSelect from "../Component/SearchableSelect";
import ScriptDescriptor from "../Descriptor/ScriptDescriptor";
import { getWarName } from "../Descriptor/WarDescriptor";
import { getURLSearchParams } from "../Helper/StringHelper";
import { getNumParam } from "../Helper/URLSearchParamsHelper";
import Manager, { lang } from "../Setting/Manager";

import "./ScriptsPage.css";

const stateCache = new Map<
    Region,
    {
        query: string | undefined;
        scriptFileName: string | undefined;
        warId: number | undefined;
        rawScript: boolean;
        scripts: Script.ScriptSearchResult[];
        searched: boolean;
        searchLimit: number;
    }
>();

const getQueryString = (query?: string, scriptFileName?: string, warId?: number, rawScript?: boolean) => {
    return getURLSearchParams({
        query,
        scriptFileName,
        warId,
        rawScript: rawScript ? true : undefined,
    }).toString();
};

type ScriptResultSort = "Score" | "ScriptIdAscending" | "ScriptIdDescending";

const ScriptsPage = ({ region, path }: { region: Region; path: string }) => {
    const history = useHistory(),
        location = useLocation(),
        { t } = useTranslation(),
        searchParams = new URLSearchParams(location.search),
        thisStateCache = stateCache.get(region),
        [query, setQuery] = useState(searchParams.get("query") ?? thisStateCache?.query ?? undefined),
        [scriptFileName, setScriptFileName] = useState(
            searchParams.get("scriptFileName") ?? thisStateCache?.scriptFileName ?? undefined
        ),
        [warId, setWarId] = useState(getNumParam(searchParams, "warId") ?? thisStateCache?.warId ?? undefined),
        [rawScript, setRawScript] = useState<boolean>(
            searchParams.get("rawScript") !== null
                ? searchParams.get("rawScript") === "true"
                : thisStateCache?.rawScript ?? false
        ),
        [searchLimit, setSearchLimit] = useState(50),
        [wars, setWars] = useState([] as War.WarBasic[]),
        [scripts, setScripts] = useState<Script.ScriptSearchResult[]>(thisStateCache?.scripts ?? []),
        [error, setError] = useState<AxiosError | undefined>(undefined),
        [searching, setSearching] = useState(false),
        [searched, setSearched] = useState(thisStateCache?.searched ?? false),
        [resultSort, setResultSort] = useState<ScriptResultSort>("Score");

    const search = (
        abortController: AbortController,
        query: string,
        scriptFileName?: string,
        warId?: number,
        rawScript?: boolean,
        searchLimit?: number
    ) => {
        setSearching(true);
        Api.searchScript(
            query,
            scriptFileName,
            warId !== undefined ? [warId] : undefined,
            rawScript ? true : undefined,
            searchLimit
        )
            .then((r) => {
                if (abortController.signal.aborted) return;
                setSearched(true);
                setScripts(r);
                setSearching(false);
            })
            .catch((e) => {
                if (abortController.signal.aborted) return;
                setError(e);
            });
    };

    const searchButton = (
        abortController: AbortController,
        query?: string,
        scriptFileName?: string,
        warId?: number,
        rawScript?: boolean,
        searchLimit?: number
    ) => {
        if (query === undefined || query.trim() === "") {
            alert("Please enter a query");
        } else {
            search(abortController, query, scriptFileName, warId, rawScript, searchLimit);
            history.replace(`/${region}/${path}?${getQueryString(query, scriptFileName, warId, rawScript)}`);
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
        const controller = new AbortController();
        if ((!stateCache.get(region)?.searched || stateCache.get(region)?.searchLimit !== searchLimit) && query) {
            // for first run if URL query string is not empty or after changing searchLimit
            search(controller, query, scriptFileName, warId, rawScript, searchLimit);
        }
        return () => {
            controller.abort();
        };
    }, [region, query, scriptFileName, warId, rawScript, searchLimit]);

    useEffect(() => {
        stateCache.set(region, { query, scriptFileName, warId, scripts, rawScript, searched, searchLimit });
    }, [region, query, scriptFileName, warId, rawScript, scripts, searched, searchLimit]);

    useEffect(() => {
        document.title = `[${region}] ${t("Scripts")} - Atlas Academy DB`;
    }, [region, t]);

    useEffect(() => {
        Api.warList().then((r) => setWars(r));
    }, []);

    if (error !== undefined) {
        history.replace(`/${region}/${path}`);
        return (
            <div className="text-left">
                <ErrorStatus error={error} />
                <Button
                    variant={"primary"}
                    onClick={() => {
                        setError(undefined);
                        setSearching(false);
                    }}
                >
                    {t("Redo the Search")}
                </Button>
            </div>
        );
    }

    return (
        <>
            {searching ? <Loading /> : null}
            <h1>{t("Scripts Search")}</h1>
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
                    searchButton(new AbortController(), query, scriptFileName, warId, rawScript, searchLimit);
                }}
            >
                <Form.Group>
                    <Form.Label>{t("Search Query")}</Form.Label>
                    <Form.Control
                        value={query ?? ""}
                        onChange={(ev) => {
                            setQuery(ev.target.value !== "" ? ev.target.value : undefined);
                        }}
                        lang={lang(region)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>{t("War")}</Form.Label>
                    <SearchableSelect<number>
                        id="select-warId"
                        options={wars.map((war) => war.id)}
                        labels={new Map(wars.map((war) => [war.id, getWarName(war).replace("\n", " ")]))}
                        selected={warId}
                        onChange={(value?: number) => {
                            setWarId(value);
                        }}
                        lang={lang(region)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>{t("Script File Name")}</Form.Label>
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
                <Form.Check
                    inline
                    type="switch"
                    id="raw-script-search"
                    label="Search raw script"
                    className="mb-3"
                    onChange={(ev) => {
                        setRawScript(ev.target.checked);
                    }}
                />
                <div className="d-flex justify-content-between">
                    <Button
                        variant="primary"
                        onClick={() =>
                            searchButton(new AbortController(), query, scriptFileName, warId, rawScript, searchLimit)
                        }
                    >
                        {t("Search")} <FontAwesomeIcon icon={faSearch} />
                    </Button>
                    <Dropdown>
                        <Dropdown.Toggle>Limit: {searchLimit}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {[50, 100, 250, 500].map((limit) => (
                                <Dropdown.Item
                                    key={limit}
                                    eventKey={limit}
                                    onSelect={(ev) => {
                                        if (ev !== null) {
                                            setSearchLimit(parseInt(ev));
                                        }
                                    }}
                                >
                                    {limit}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </form>

            <hr />

            {searched ? <h5>{t("foundResult", { count: scripts.length })}</h5> : null}
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
                                    {t("Script ID")}
                                </th>
                                <th>{t("Snippet")}</th>
                                <th>{t("Score")}</th>
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
                                            lang={lang(region)}
                                        ></td>
                                        <td className="text-center">{script.score}</td>
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
