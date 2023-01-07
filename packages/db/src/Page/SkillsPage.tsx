import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import React from "react";
import { Button, Form, Table } from "react-bootstrap";
import { WithTranslation, withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { Region, Skill } from "@atlasacademy/api-connector";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import SearchableSelect from "../Component/SearchableSelect";
import TraitsSelector from "../Component/TraitsSelector";
import { entityDescriptorTable } from "../Descriptor/EntityDescriptor";
import SkillDescriptor from "../Descriptor/SkillDescriptor";
import { getURLSearchParams } from "../Helper/StringHelper";
import Manager, { lang } from "../Setting/Manager";

let stateCache = new Map<Region, IState>([]);

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

interface IProps extends RouteComponentProps, WithTranslation {
    region: Region;
    path: string;
}

interface IState {
    error?: AxiosError;
    searched: boolean;
    searching: boolean;
    skills: Skill.SkillBasic[];
    name?: string;
    type: Skill.SkillType[];
    num: number[];
    priority: number[];
    strengthStatus: number[];
    lvl1coolDown: number[];
    numFunctions: number[];
    svalsContain?: string;
}

class SkillsPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const defaultState = {
            searching: false,
            searched: false,
            skills: [],
            type: [],
            num: [],
            priority: [],
            strengthStatus: [],
            lvl1coolDown: [],
            numFunctions: [],
        };

        let state: IState = defaultState;
        if (props.location.search !== "") {
            const searchParams = new URLSearchParams(props.location.search);
            const getQueryNums = (param: string) => searchParams.getAll(param).map((num) => parseInt(num));
            state = {
                ...defaultState,
                name: searchParams.get("name") ?? undefined,
                svalsContain: searchParams.get("svalsContain") ?? undefined,
                type: searchParams.getAll("type") as Skill.SkillType[],
                num: getQueryNums("num"),
                priority: getQueryNums("priority"),
                strengthStatus: getQueryNums("strengthStatus"),
                lvl1coolDown: getQueryNums("lvl1coolDown"),
                numFunctions: getQueryNums("numFunctions"),
            };
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
        document.title = `[${this.props.region}] Skills - Atlas Academy DB`;

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
            num: this.state.num,
            priority: this.state.priority,
            strengthStatus: this.state.strengthStatus,
            lvl1coolDown: this.state.lvl1coolDown,
            numFunctions: this.state.numFunctions,
            svalsContain: this.state.svalsContain,
        }).toString();
    }

    private search() {
        // no filter set
        if (
            !this.state.name &&
            !this.state.svalsContain &&
            this.state.type.length === 0 &&
            this.state.num.length === 0 &&
            this.state.priority.length === 0 &&
            this.state.strengthStatus.length === 0 &&
            this.state.lvl1coolDown.length === 0 &&
            this.state.numFunctions.length === 0
        ) {
            this.setState({ skills: [] });
            this.props.history.replace(`/${this.props.region}/${this.props.path}`);
            alert(this.props.t("Please refine the results before searching"));
            return;
        }

        this.setState({ searching: true, skills: [] });

        Api.searchSkill({
            name: this.state.name,
            type: this.state.type,
            num: this.state.num,
            priority: this.state.priority,
            strengthStatus: this.state.strengthStatus,
            lvl1coolDown: this.state.lvl1coolDown,
            numFunctions: this.state.numFunctions,
            svalsContain: this.state.svalsContain,
        })
            .then((skills) => {
                this.setQueryURL();
                this.setState({ skills, searched: true, searching: false });
            })
            .catch((error) => {
                this.props.history.replace(`/${this.props.region}/${this.props.path}`);
                this.setState({ error });
            });
    }

    getNumberForm(stateVar: "num" | "priority" | "strengthStatus" | "lvl1coolDown" | "numFunctions", label: string) {
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
        const t = this.props.t;
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
                        <th>{t("Skill")}</th>
                        <th>{t("Owner")}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.skills.map((skill) => {
                        return (
                            <tr key={skill.id}>
                                <td>{skill.id}</td>
                                <td>
                                    <SkillDescriptor region={this.props.region} skill={skill} iconHeight={25} />
                                </td>
                                <td>
                                    {(skill.reverse?.basic?.servant ?? []).map((entity, index) =>
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

                <h1>{t("Skills Search")}</h1>

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
                        <SearchableSelect<Skill.SkillType>
                            id="select-SkillType"
                            options={Object.values(Skill.SkillType)}
                            labels={
                                new Map([
                                    [Skill.SkillType.ACTIVE, "Active"],
                                    [Skill.SkillType.PASSIVE, "Passive"],
                                ])
                            }
                            selected={this.state.type ? this.state.type[0] : undefined}
                            onChange={(value?: Skill.SkillType) => {
                                this.setState({ type: value ? [value] : [] });
                            }}
                        />
                    </Form.Group>
                    {this.getNumberForm("num", "Num")}
                    {this.getNumberForm("priority", t("Priority"))}
                    {this.getNumberForm("strengthStatus", t("Strength Status"))}
                    {this.getNumberForm("lvl1coolDown", t("Cooldown at level 1"))}
                    {this.getNumberForm("numFunctions", t("Number of functions"))}
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
                {this.state.searched && <h5>{t("foundResult", { count: this.state.skills.length })}.</h5>}
                {this.state.skills.length ? table : null}
            </div>
        );
    }
}

export default withRouter(withTranslation()(SkillsPage));
