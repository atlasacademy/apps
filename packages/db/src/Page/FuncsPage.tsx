import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import React from "react";
import { Button, Form, Table } from "react-bootstrap";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { Func, Region, Trait } from "@atlasacademy/api-connector";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import SearchableSelect from "../Component/SearchableSelect";
import TraitsSelector from "../Component/TraitsSelector";
import { funcDescriptions } from "../Descriptor/Func/handleActionSection";
import { targetDescriptions } from "../Descriptor/Func/handleTargetSection";
import FuncDescriptor from "../Descriptor/FuncDescriptor";
import { getURLSearchParams } from "../Helper/StringHelper";
import Manager from "../Setting/Manager";

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
    funcs: Func.BasicFunc[];
    popupText?: string;
    type?: Func.FuncType[];
    targetType?: Func.FuncTargetType[];
    targetTeam?: Func.FuncTargetTeam[];
    vals: number[];
    tvals: number[];
    questTvals: number[];
}

class FuncsPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const defaultState = {
            searching: false,
            searched: false,
            traitList: [],
            funcs: [],
            vals: [],
            tvals: [],
            questTvals: [],
        };

        let state: IState = defaultState;
        if (props.location.search !== "") {
            const searchParams = new URLSearchParams(props.location.search);
            const getQueryNums = (param: string) => searchParams.getAll(param).map((num) => parseInt(num));
            state = {
                ...defaultState,
                popupText: searchParams.get("popupText") ?? undefined,
                type: searchParams.getAll("type") as Func.FuncType[],
                targetType: searchParams.getAll("targetType") as Func.FuncTargetType[],
                targetTeam: searchParams.getAll("targetTeam") as Func.FuncTargetTeam[],
                vals: getQueryNums("vals"),
                tvals: getQueryNums("tvals"),
                questTvals: getQueryNums("questTvals"),
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
        document.title = `[${this.props.region}] Functions - Atlas Academy DB`;

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
            popupText: this.state.popupText,
            type: this.state.type,
            targetType: this.state.targetType,
            targetTeam: this.state.targetTeam,
            vals: this.state.vals,
            tvals: this.state.tvals,
            questTvals: this.state.questTvals,
        }).toString();
    }

    setQueryURL() {
        this.props.history.replace(`/${this.props.region}/${this.props.path}?${this.getQueryString()}`);
    }

    private search() {
        // no filter set
        if (
            !this.state.popupText &&
            (!this.state.type || this.state.type.length === 0) &&
            (!this.state.targetType || this.state.targetType.length === 0)! &&
            (!this.state.targetTeam || this.state.targetTeam.length === 0)! &&
            this.state.vals.length === 0 &&
            this.state.tvals.length === 0 &&
            this.state.questTvals.length === 0
        ) {
            this.setState({ funcs: [] });
            this.props.history.replace(`/${this.props.region}/${this.props.path}`);
            alert("Please refine the results before searching");
            return;
        }

        this.setState({ searching: true, funcs: [] });

        Api.searchFunc(
            this.state.popupText,
            this.state.type,
            this.state.targetType,
            this.state.targetTeam,
            this.state.vals,
            this.state.tvals,
            this.state.questTvals
        )
            .then((funcs) => {
                this.setQueryURL();
                this.setState({ funcs, searched: true, searching: false });
            })
            .catch((error) => {
                this.props.history.replace(`/${this.props.region}/${this.props.path}`);
                this.setState({ error });
            });
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

        let table = (
            <Table responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Function</th>
                        <th>Usage Count</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.funcs.map((func) => {
                        return (
                            <tr key={func.funcId}>
                                <td>{func.funcId}</td>
                                <td>
                                    <FuncDescriptor region={this.props.region} func={func} />
                                </td>
                                <td>
                                    {(func.reverse?.basic?.NP ?? []).length + (func.reverse?.basic?.skill ?? []).length}
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

                <h1>Functions Search</h1>

                <form
                    onSubmit={(ev: React.FormEvent) => {
                        ev.preventDefault();
                        this.search();
                    }}
                >
                    <Form.Group>
                        <Form.Label>Popup Text</Form.Label>
                        <Form.Control
                            value={this.state.popupText ?? ""}
                            onChange={(ev: ChangeEvent) => {
                                this.setState({ popupText: ev.target.value });
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Type</Form.Label>
                        <SearchableSelect<Func.FuncType>
                            id="select-FuncType"
                            options={Object.values(Func.FuncType)}
                            labels={funcDescriptions}
                            selected={this.state.type ? this.state.type[0] : undefined}
                            onChange={(value?: Func.FuncType) => {
                                this.setState({ type: value ? [value] : [] });
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Target</Form.Label>
                        <SearchableSelect<Func.FuncTargetType>
                            id="select-FuncTargetType"
                            options={Object.values(Func.FuncTargetType)}
                            labels={targetDescriptions}
                            selected={this.state.targetType ? this.state.targetType[0] : undefined}
                            onChange={(value?: Func.FuncTargetType) => {
                                this.setState({
                                    targetType: value ? [value] : [],
                                });
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Affects Players/Enemies</Form.Label>
                        <SearchableSelect<Func.FuncTargetTeam>
                            id="select-FuncTargetTeam"
                            options={Object.values(Func.FuncTargetTeam)}
                            labels={
                                new Map<Func.FuncTargetTeam, string>([
                                    [Func.FuncTargetTeam.PLAYER_AND_ENEMY, "Players and Enemies"],
                                    [Func.FuncTargetTeam.PLAYER, "Players only"],
                                    [Func.FuncTargetTeam.ENEMY, "Enemies only"],
                                ])
                            }
                            selected={this.state.targetTeam ? this.state.targetTeam[0] : undefined}
                            onChange={(value?: Func.FuncTargetTeam) => {
                                this.setState({
                                    targetTeam: value ? [value] : [],
                                });
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Tvals</Form.Label>
                        <TraitsSelector
                            region={this.props.region}
                            traitList={this.state.traitList}
                            initialTraits={this.state.tvals}
                            onUpdate={(trait) => {
                                this.setState({ tvals: trait });
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Affects Traits</Form.Label>
                        <TraitsSelector
                            region={this.props.region}
                            traitList={this.state.traitList}
                            initialTraits={this.state.vals}
                            onUpdate={(trait) => {
                                this.setState({ vals: trait });
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Quest Traits</Form.Label>
                        <TraitsSelector
                            region={this.props.region}
                            traitList={this.state.traitList}
                            initialTraits={this.state.questTvals}
                            onUpdate={(trait) => {
                                this.setState({ questTvals: trait });
                            }}
                        />
                    </Form.Group>
                    <Button variant={"primary"} onClick={() => this.search()}>
                        Search <FontAwesomeIcon icon={faSearch} />
                    </Button>
                </form>

                <hr />

                {this.state.searched && (
                    <h5>
                        Found <b>{this.state.funcs.length}</b> result
                        {this.state.funcs.length > 1 ? "s" : ""}.
                    </h5>
                )}
                {this.state.funcs.length ? table : null}
            </div>
        );
    }
}

export default withRouter(FuncsPage);
