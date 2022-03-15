import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import React from "react";
import { Button, Form } from "react-bootstrap";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { ClassName, Quest, Region, Trait } from "@atlasacademy/api-connector";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import QuestPhaseTable from "../Component/QuestPhaseTable";
import SearchableSelect from "../Component/SearchableSelect";
import TraitsSelector from "../Component/TraitsSelector";
import { getURLSearchParams, isPositiveInteger } from "../Helper/StringHelper";
import Manager from "../Setting/Manager";
import { QuestTypeDescription } from "./QuestPage";

import "./ListingPage.css";

let stateCache = new Map<Region, IState>([]);

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

interface IProps extends RouteComponentProps {
    region: Region;
    path: string;
}

interface IState {
    error?: AxiosError;
    traitList: Trait.Trait[];
    searched: boolean;
    searching: boolean;
    quests: Quest.QuestPhaseBasic[];
    name?: string;
    spotName?: string;
    warId?: number;
    type?: Quest.QuestType;
    fieldIndividuality: number[];
    battleBgId?: number;
    bgmId?: number;
    fieldAiId?: number;
    enemySvtId?: number;
    enemySvtAiId?: number;
    enemyTrait: number[];
    enemyClassName: ClassName[];
}

class QuestsPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const defaultState = {
            searching: false,
            searched: false,
            traitList: [],
            quests: [],
            fieldIndividuality: [],
            enemyTrait: [],
            enemyClassName: [],
        };

        let state: IState = defaultState;
        if (props.location.search !== "") {
            const searchParams = new URLSearchParams(props.location.search);
            const getQueryNums = (param: string) => searchParams.getAll(param).map((num) => parseInt(num)),
                getQueryNum = (param: string) => {
                    const num = searchParams.get(param);
                    if (num !== null) {
                        try {
                            return parseInt(num);
                        } catch {}
                    }
                    return undefined;
                };
            state = {
                ...defaultState,
                name: searchParams.get("name") ?? undefined,
                spotName: searchParams.get("spotName") ?? undefined,
                warId: getQueryNum("warId"),
                type: (searchParams.get("type") as Quest.QuestType) ?? undefined,
                fieldIndividuality: getQueryNums("fieldIndividuality"),
                battleBgId: getQueryNum("battleBgId"),
                bgmId: getQueryNum("bgmId"),
                fieldAiId: getQueryNum("fieldAiId"),
                enemySvtId: getQueryNum("enemySvtId"),
                enemySvtAiId: getQueryNum("enemySvtAiId"),
                enemyTrait: getQueryNums("enemyTrait"),
                enemyClassName: searchParams.getAll("enemyClassName") as ClassName[],
            };
        } else {
            state = stateCache.get(props.region) ?? defaultState;
        }

        if (state.error) {
            state.error = undefined;
        }

        this.state = state;

        Manager.setRegion(this.props.region);
    }

    async componentDidMount() {
        Manager.setRegion(this.props.region);
        document.title = `[${this.props.region}] Quests - Atlas Academy DB`;

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
            spotName: this.state.spotName,
            warId: this.state.warId,
            type: this.state.type,
            fieldIndividuality: this.state.fieldIndividuality,
            battleBgId: this.state.battleBgId,
            bgmId: this.state.bgmId,
            fieldAiId: this.state.fieldAiId,
            enemySvtId: this.state.enemySvtId,
            enemySvtAiId: this.state.enemySvtAiId,
            enemyTrait: this.state.enemyTrait,
            enemyClassName: this.state.enemyClassName,
        }).toString();
    }

    setQueryURL() {
        this.props.history.replace(`/${this.props.region}/${this.props.path}?${this.getQueryString()}`);
    }

    private search() {
        // no filter set
        if (
            this.state.name === undefined &&
            this.state.spotName === undefined &&
            this.state.warId === undefined &&
            this.state.type === undefined &&
            this.state.fieldIndividuality.length === 0 &&
            this.state.battleBgId === undefined &&
            this.state.bgmId === undefined &&
            this.state.fieldAiId === undefined &&
            this.state.enemySvtId === undefined &&
            this.state.enemySvtAiId === undefined &&
            this.state.enemyTrait.length === 0 &&
            this.state.enemyClassName.length === 0
        ) {
            this.setState({ quests: [] });
            this.props.history.replace(`/${this.props.region}/${this.props.path}`);
            alert("Please refine the results before searching");
            return;
        }

        this.setState({ searching: true, quests: [] });

        Api.searchQuestPhase(
            this.state.name,
            this.state.spotName,
            this.state.warId ? [this.state.warId] : undefined,
            this.state.type ? [this.state.type] : undefined,
            this.state.fieldIndividuality,
            this.state.battleBgId,
            this.state.bgmId,
            this.state.fieldAiId,
            this.state.enemySvtId,
            this.state.enemySvtAiId,
            this.state.enemyTrait,
            this.state.enemyClassName
        )
            .then((quests) => {
                this.setQueryURL();
                this.setState({ quests, searched: true, searching: false });
            })
            .catch((error) => {
                this.props.history.replace(`/${this.props.region}/${this.props.path}`);
                this.setState({ error });
            });
    }

    getNumberForm(
        stateVar: "warId" | "battleBgId" | "bgmId" | "fieldAiId" | "enemySvtId" | "enemySvtAiId",
        label: string
    ) {
        return (
            <Form.Group>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                    type="number"
                    value={this.state[stateVar]?.toString() ?? ""}
                    onChange={(ev: ChangeEvent) => {
                        if (ev.target.value !== "" && isPositiveInteger(ev.target.value)) {
                            this.setState({
                                [stateVar]: parseInt(ev.target.value),
                            } as Pick<IState, typeof stateVar>);
                        } else {
                            this.setState({
                                [stateVar]: undefined,
                            } as Pick<IState, typeof stateVar>);
                        }
                    }}
                />
            </Form.Group>
        );
    }

    render() {
        if (this.state.error) {
            return (
                <div style={{ textAlign: "center" }}>
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
                        Redo the Search
                    </Button>
                </div>
            );
        }

        return (
            <div className="listing-page">
                {this.state.searching ? <Loading /> : null}

                <h1>Quests Search</h1>

                <form
                    onSubmit={(ev: React.FormEvent) => {
                        ev.preventDefault();
                        this.search();
                    }}
                >
                    <Form.Group>
                        <Form.Label>Quest Name</Form.Label>
                        <Form.Control
                            value={this.state.name ?? ""}
                            onChange={(ev: ChangeEvent) => {
                                this.setState({
                                    name: ev.target.value !== "" ? ev.target.value : undefined,
                                });
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Spot Name</Form.Label>
                        <Form.Control
                            value={this.state.spotName ?? ""}
                            onChange={(ev: ChangeEvent) => {
                                this.setState({
                                    spotName: ev.target.value !== "" ? ev.target.value : undefined,
                                });
                            }}
                        />
                    </Form.Group>
                    {this.getNumberForm("warId", "War ID")}
                    <Form.Group>
                        <Form.Label>Quest Type</Form.Label>
                        <SearchableSelect<Quest.QuestType>
                            id="select-QuestType"
                            options={Object.values(Quest.QuestType)}
                            labels={QuestTypeDescription}
                            selected={this.state.type}
                            onChange={(value?: Quest.QuestType) => {
                                this.setState({ type: value });
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Field Trait</Form.Label>
                        <TraitsSelector
                            region={this.props.region}
                            traitList={this.state.traitList}
                            initialTraits={this.state.fieldIndividuality}
                            onUpdate={(trait) => {
                                this.setState({ fieldIndividuality: trait });
                            }}
                        />
                    </Form.Group>
                    {this.getNumberForm("battleBgId", "Battle BG ID")}
                    {this.getNumberForm("bgmId", "BGM ID")}
                    {this.getNumberForm("fieldAiId", "Field AI ID")}
                    {this.getNumberForm("enemySvtId", "Enemy svt ID")}
                    {this.getNumberForm("enemySvtAiId", "Enemy Servant AI ID")}
                    <Form.Group>
                        <Form.Label>Enemy Trait</Form.Label>
                        <TraitsSelector
                            region={this.props.region}
                            traitList={this.state.traitList}
                            initialTraits={this.state.enemyTrait}
                            onUpdate={(trait) => {
                                this.setState({ enemyTrait: trait });
                            }}
                        />
                    </Form.Group>{" "}
                    <Form.Group>
                        <Form.Label>Enemy Class</Form.Label>
                        <SearchableSelect<ClassName>
                            id="select-ClassName"
                            options={Object.values(ClassName).filter((className) => className !== ClassName.EXTRA)}
                            labels={new Map([])}
                            selected={this.state.enemyClassName[0] ?? undefined}
                            onChange={(value?: ClassName) => {
                                this.setState({
                                    enemyClassName: value ? [value] : [],
                                });
                            }}
                        />
                    </Form.Group>
                    <Button variant={"primary"} onClick={() => this.search()} style={{ marginBottom: "1em" }}>
                        Search <FontAwesomeIcon icon={faSearch} />
                    </Button>
                </form>

                <hr />

                {this.state.searched && (
                    <h5>
                        Found <b>{this.state.quests.length}</b> result
                        {this.state.quests.length > 1 ? "s" : ""}.
                    </h5>
                )}
                {this.state.quests.length ? (
                    <QuestPhaseTable region={this.props.region} quests={this.state.quests} />
                ) : null}
            </div>
        );
    }
}

export default withRouter(QuestsPage);
