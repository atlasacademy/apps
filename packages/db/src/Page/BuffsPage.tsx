import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import React from "react";
import { Button, Form, Table } from "react-bootstrap";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { Buff, Region, Trait } from "@atlasacademy/api-connector";
import { BuffDescriptor } from "@atlasacademy/api-descriptor";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import SearchableSelect from "../Component/SearchableSelect";
import TraitsSelector from "../Component/TraitsSelector";
import BuffDescription from "../Descriptor/BuffDescription";
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
    buffs: Buff.BasicBuff[];
    name?: string;
    type?: Buff.BuffType[];
    buffGroup: number[];
    vals: number[];
    tvals: number[];
    ckSelfIndv: number[];
    ckOpIndv: number[];
}

const buffDescriptions = new Map<Buff.BuffType, string>(
    Object.values(Buff.BuffType).map((type) => {
        return [type, BuffDescriptor.describeType(type)];
    })
);

class BuffsPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const defaultState = {
            searching: false,
            searched: false,
            traitList: [],
            buffs: [],
            buffGroup: [],
            vals: [],
            tvals: [],
            ckSelfIndv: [],
            ckOpIndv: [],
        };

        let state: IState = defaultState;
        if (props.location.search !== "") {
            const searchParams = new URLSearchParams(props.location.search);
            const getQueryNums = (param: string) => searchParams.getAll(param).map((num) => parseInt(num));
            state = {
                ...defaultState,
                name: searchParams.get("name") ?? undefined,
                type: searchParams.getAll("type") as Buff.BuffType[],
                buffGroup: getQueryNums("buffGroup"),
                vals: getQueryNums("vals"),
                tvals: getQueryNums("tvals"),
                ckSelfIndv: getQueryNums("ckSelfIndv"),
                ckOpIndv: getQueryNums("ckOpIndv"),
            };
        } else {
            state = stateCache.get(props.region) ?? defaultState;
        }

        if (state.error) {
            state.error = undefined;
        }

        this.state = state;
    }

    async componentDidMount() {
        Manager.setRegion(this.props.region);
        document.title = `[${this.props.region}] Buffs - Atlas Academy DB`;

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
            type: this.state.type,
            buffGroup: this.state.buffGroup,
            vals: this.state.vals,
            tvals: this.state.tvals,
            ckSelfIndv: this.state.ckSelfIndv,
            ckOpIndv: this.state.ckOpIndv,
        }).toString();
    }

    setQueryURL() {
        this.props.history.replace(`/${this.props.region}/${this.props.path}?${this.getQueryString()}`);
    }

    private search() {
        // no filter set
        if (
            !this.state.name &&
            (!this.state.type || this.state.type.length === 0) &&
            this.state.buffGroup.length === 0 &&
            this.state.vals.length === 0 &&
            this.state.tvals.length === 0 &&
            this.state.ckOpIndv.length === 0 &&
            this.state.ckSelfIndv.length === 0
        ) {
            this.setState({ buffs: [] });
            this.props.history.replace(`/${this.props.region}/${this.props.path}`);
            alert("Please refine the results before searching");
            return;
        }

        this.setState({ searching: true, buffs: [] });
        Api.searchBuff(
            this.state.name,
            this.state.type,
            this.state.buffGroup,
            this.state.vals,
            this.state.tvals,
            this.state.ckSelfIndv,
            this.state.ckOpIndv
        )
            .then((buffs) => {
                this.setQueryURL();
                this.setState({ buffs, searched: true, searching: false });
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
                        <th>Buff</th>
                        <th>Usage Count</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.buffs.map((buff) => {
                        return (
                            <tr key={buff.id}>
                                <td>{buff.id}</td>
                                <td>
                                    <BuffDescription region={this.props.region} buff={buff} />
                                </td>
                                <td>{(buff.reverse?.basic?.function ?? []).length}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );

        return (
            <div>
                {this.state.searching ? <Loading /> : null}

                <h1>Buffs Search</h1>

                <form
                    onSubmit={(ev: React.FormEvent) => {
                        ev.preventDefault();
                        this.search();
                    }}
                >
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            value={this.state.name ?? ""}
                            onChange={(ev: ChangeEvent) => {
                                this.setState({ name: ev.target.value });
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Type</Form.Label>
                        <SearchableSelect<Buff.BuffType>
                            id="select-BuffType"
                            options={Object.values(Buff.BuffType)}
                            labels={buffDescriptions}
                            selected={this.state.type ? this.state.type[0] : undefined}
                            onChange={(value?: Buff.BuffType) => {
                                this.setState({ type: value ? [value] : [] });
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Buff Group</Form.Label>
                        <TraitsSelector
                            region={this.props.region}
                            traitList={[]}
                            initialTraits={this.state.buffGroup}
                            onUpdate={(trait) => {
                                this.setState({ buffGroup: trait });
                            }}
                            customPlaceHolder="Add a positive integer"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Buff Traits</Form.Label>
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
                        <Form.Label>Required Self Traits</Form.Label>
                        <TraitsSelector
                            region={this.props.region}
                            traitList={this.state.traitList}
                            initialTraits={this.state.ckSelfIndv}
                            onUpdate={(trait) => {
                                this.setState({ ckSelfIndv: trait });
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Required Opponent Traits</Form.Label>
                        <TraitsSelector
                            region={this.props.region}
                            traitList={this.state.traitList}
                            initialTraits={this.state.ckOpIndv}
                            onUpdate={(trait) => {
                                this.setState({ ckOpIndv: trait });
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
                        Found <b>{this.state.buffs.length}</b> result
                        {this.state.buffs.length > 1 ? "s" : ""}.
                    </h5>
                )}
                {this.state.buffs.length ? table : null}
            </div>
        );
    }
}

export default withRouter(BuffsPage);
