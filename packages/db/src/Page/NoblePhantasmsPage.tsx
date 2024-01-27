import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { t } from "i18next";
import React from "react";
import { Button, Form, Table } from "react-bootstrap";
import { WithTranslation, withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { Card, NoblePhantasm, Region, Trait } from "@atlasacademy/api-connector";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import NumberSelector from "../Component/NumberSelector";
import SearchableSelect from "../Component/SearchableSelect";
import TraitsSelector from "../Component/TraitsSelector";
import { entityDescriptorTable } from "../Descriptor/EntityDescriptor";
import NoblePhantasmDescriptor from "../Descriptor/NoblePhantasmDescriptor";
import { getURLSearchParams, isPositiveInteger } from "../Helper/StringHelper";
import Manager, { lang } from "../Setting/Manager";

let stateCache = new Map<Region, IState>([]);

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

interface IProps extends RouteComponentProps, WithTranslation {
    region: Region;
    path: string;
}

interface IState {
    traitList: Trait.Trait[];
    error?: AxiosError;
    searched: boolean;
    searching: boolean;
    noblePhantasms: NoblePhantasm.NoblePhantasmBasic[];
    name?: string;
    card: Card[];
    individuality: number[];
    hits: number[];
    strengthStatus: number[];
    numFunctions: number[];
    minNpNpGain?: number;
    maxNpNpGain?: number;
    svalsContain?: string;
}

class NoblePhantasmsPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const defaultState = {
            traitList: [],
            searching: false,
            searched: false,
            noblePhantasms: [],
            card: [],
            individuality: [],
            hits: [],
            strengthStatus: [],
            numFunctions: [],
        };

        let state: IState = defaultState;
        if (props.location.search !== "") {
            const searchParams = new URLSearchParams(props.location.search);
            const getQueryNums = (param: string) => searchParams.getAll(param).map((num) => parseInt(num));
            state = {
                ...defaultState,
                name: searchParams.get("name") ?? undefined,
                card: searchParams.getAll("card") as Card[],
                svalsContain: searchParams.get("svalsContain") ?? undefined,
                individuality: getQueryNums("individuality"),
                hits: getQueryNums("hits"),
                strengthStatus: getQueryNums("strengthStatus"),
                numFunctions: getQueryNums("numFunctions"),
            };
            const minNpQueryValue = searchParams.get("minNpNpGain");
            if (minNpQueryValue !== null) state.minNpNpGain = parseInt(minNpQueryValue);
            const maxNpQueryValue = searchParams.get("maxNpNpGain");
            if (maxNpQueryValue !== null) state.maxNpNpGain = parseInt(maxNpQueryValue);
        } else {
            state = stateCache.get(props.region) ?? defaultState;
        }

        if (state.error) {
            state.error = undefined;
        }

        this.state = state;
    }

    setQueryURL() {
        this.props.history.replace(`/${this.props.region}/${this.props.path}?${this.getQueryString()}`);
    }

    async componentDidMount() {
        Manager.setRegion(this.props.region);
        document.title = `[${this.props.region}] Noble Phantasms - Atlas Academy DB`;

        Api.traitList()
            .then((traitList) => this.setState({ traitList }))
            .catch((error) => this.setState({ error }));

        if (this.props.location.search !== "") {
            this.search();
        }

        if (stateCache.has(this.props.region)) {
            this.setQueryURL();
        }
    }

    componentDidUpdate() {
        stateCache.set(this.props.region, { ...this.state });
    }

    getQueryString(): string {
        return getURLSearchParams({
            name: this.state.name,
            card: this.state.card,
            individuality: this.state.individuality,
            hits: this.state.hits,
            strengthStatus: this.state.strengthStatus,
            numFunctions: this.state.numFunctions,
            minNpNpGain: this.state.minNpNpGain,
            maxNpNpGain: this.state.maxNpNpGain,
            svalsContain: this.state.svalsContain,
        }).toString();
    }

    private search() {
        // no filter set
        if (
            !this.state.name &&
            !this.state.svalsContain &&
            this.state.card.length === 0 &&
            this.state.individuality.length === 0 &&
            this.state.hits.length === 0 &&
            this.state.strengthStatus.length === 0 &&
            this.state.numFunctions.length === 0 &&
            this.state.minNpNpGain !== undefined &&
            this.state.maxNpNpGain !== undefined
        ) {
            this.setState({ noblePhantasms: [] });
            this.props.history.replace(`/${this.props.region}/${this.props.path}`);
            alert(this.props.t("Please refine the results before searching"));
            return;
        }

        this.setState({ searching: true, noblePhantasms: [] });

        Api.searchNoblePhantasm({
            name: this.state.name,
            card: this.state.card,
            individuality: this.state.individuality,
            hits: this.state.hits,
            strengthStatus: this.state.strengthStatus,
            numFunctions: this.state.numFunctions,
            minNpNpGain: this.state.minNpNpGain,
            maxNpNpGain: this.state.maxNpNpGain,
            svalsContain: this.state.svalsContain,
        })
            .then((noblePhantasms) => {
                this.setQueryURL();
                this.setState({ noblePhantasms, searched: true, searching: false });
            })
            .catch((error) => {
                this.props.history.replace(`/${this.props.region}/${this.props.path}`);
                this.setState({ error });
            });
    }

    getNumberForm(stateVar: "hits" | "strengthStatus" | "numFunctions", label: string) {
        return (
            <Form.Group>
                <Form.Label>{label}</Form.Label>
                <TraitsSelector
                    region={this.props.region}
                    traitList={[]}
                    initialTraits={this.state[stateVar]}
                    onUpdate={(trait) => {
                        this.setState({ [stateVar]: trait } as Pick<IState, typeof stateVar>);
                    }}
                    customPlaceHolder={this.props.t("Add a positive integer")}
                    emptyLabel=""
                    numericInput={true}
                />
            </Form.Group>
        );
    }

    render() {
        if (this.state.error) {
            return (
                <div className="text-center">
                    <ErrorStatus error={this.state.error} />
                    <Button
                        variant={"primary"}
                        onClick={() =>
                            this.setState({
                                error: undefined,
                                searching: false,
                            })
                        }
                    >
                        {t("Redo the Search")}
                    </Button>
                </div>
            );
        }

        let table = (
            <Table responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{t("Noble Phantasm")}</th>
                        <th>{t("Owner")}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.noblePhantasms.map((noblePhantasm) => {
                        return (
                            <tr key={noblePhantasm.id}>
                                <td>{noblePhantasm.id}</td>
                                <td>
                                    <NoblePhantasmDescriptor region={this.props.region} noblePhantasm={noblePhantasm} />
                                </td>
                                <td>
                                    {(noblePhantasm.reverse?.basic?.servant ?? []).map((entity, index) =>
                                        entityDescriptorTable(this.props.region, entity, index)
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );

        return (
            <div>
                {this.state.searching ? <Loading /> : null}

                <h1>{t("Noble Phantasms Search")}</h1>

                <form
                    onSubmit={(ev: React.FormEvent) => {
                        ev.preventDefault();
                        this.search();
                    }}
                >
                    <Form.Group>
                        <Form.Label>{t("Name")}</Form.Label>
                        <Form.Control
                            value={this.state.name ?? ""}
                            onChange={(ev: ChangeEvent) => {
                                if (ev.target.value !== "") {
                                    this.setState({ name: ev.target.value });
                                } else {
                                    this.setState({ name: undefined });
                                }
                            }}
                            lang={lang(this.props.region)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{t("Type")}</Form.Label>
                        <SearchableSelect<Card>
                            id="select-SkillType"
                            options={[Card.BUSTER, Card.ARTS, Card.QUICK]}
                            labels={
                                new Map([
                                    [Card.BUSTER, "Buster"],
                                    [Card.ARTS, "Arts"],
                                    [Card.QUICK, "Quick"],
                                ])
                            }
                            selected={this.state.card ? this.state.card[0] : undefined}
                            onChange={(value?: Card) => {
                                this.setState({ card: value ? [value] : [] });
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{t("Individuality")}</Form.Label>
                        <TraitsSelector
                            region={this.props.region}
                            traitList={this.state.traitList}
                            initialTraits={this.state.individuality}
                            onUpdate={(trait) => {
                                this.setState({ individuality: trait });
                            }}
                        />
                    </Form.Group>
                    {this.getNumberForm("hits", t("Number of hits"))}
                    {this.getNumberForm("strengthStatus", t("Strength Status"))}
                    {this.getNumberForm("numFunctions", t("Number of functions"))}
                    <Form.Group>
                        <Form.Label>{t("Minimum NP gain")} (1% = 100)</Form.Label>
                        <NumberSelector
                            value={this.state.minNpNpGain ?? ""}
                            onChange={(ev: ChangeEvent) => {
                                if (ev.target.value === "0" || isPositiveInteger(ev.target.value)) {
                                    this.setState({
                                        minNpNpGain: parseInt(ev.target.value),
                                    });
                                } else {
                                    this.setState({
                                        minNpNpGain: undefined,
                                    });
                                }
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{t("Maximum NP gain")} (1% = 100)</Form.Label>
                        <NumberSelector
                            value={this.state.maxNpNpGain ?? ""}
                            onChange={(ev: ChangeEvent) => {
                                if (ev.target.value === "0" || isPositiveInteger(ev.target.value)) {
                                    this.setState({
                                        maxNpNpGain: parseInt(ev.target.value),
                                    });
                                } else {
                                    this.setState({
                                        maxNpNpGain: undefined,
                                    });
                                }
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            <code>svals</code> {t("raw string should contain the following snippet")}
                        </Form.Label>
                        <Form.Control
                            value={this.state.svalsContain ?? ""}
                            onChange={(ev: ChangeEvent) => {
                                if (ev.target.value !== "") {
                                    this.setState({ svalsContain: ev.target.value });
                                } else {
                                    this.setState({ svalsContain: undefined });
                                }
                            }}
                        />
                    </Form.Group>
                    <Button variant={"primary"} onClick={() => this.search()}>
                        {t("Search")} <FontAwesomeIcon icon={faSearch} />
                    </Button>
                </form>

                <hr />
                {this.state.searched && <h5>{t("foundResult", { count: this.state.noblePhantasms.length })}.</h5>}
                {this.state.noblePhantasms.length ? table : null}
            </div>
        );
    }
}

export default withRouter(withTranslation()(NoblePhantasmsPage));
