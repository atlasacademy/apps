import {Func, Region} from "@atlasacademy/api-connector";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AxiosError} from "axios";
import React from "react";
import {Button, Form, Table} from "react-bootstrap";
import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import SearchableSelect from "../Component/SearchableSelect";
import {funcDescriptions} from "../Descriptor/Func/handleActionSection";
import {targetDescriptions} from "../Descriptor/Func/handleTargetSection";
import FuncDescriptor from "../Descriptor/FuncDescriptor";
import Manager from "../Setting/Manager";

let stateCache = new Map<Region, IState>([]);

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps {
    region: Region;
}

interface IState {
    error?: AxiosError;
    searched: boolean;
    searching: boolean;
    funcs: Func.BasicFunc[];
    text?: string;
    type?: Func.FuncType;
    target?: Func.FuncTargetType;
    team?: Func.FuncTargetTeam;
}

class FuncsPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        let state = stateCache.get(props.region) ?? {
            searching: false,
            searched: false,
            funcs: []
        };
        if (state?.error) state.error = undefined;
        this.state = state;


        Manager.setRegion(this.props.region);
    }

    componentDidMount() {
        document.title = `[${this.props.region}] Functions - Atlas Academy DB`
    }

    componentDidUpdate() {
        stateCache.set(this.props.region, {...this.state});
    }

    private async search() {
        // no filter set
        if (!this.state.text && !this.state.type && !this.state.target && !this.state.team) {
            this.setState({funcs: []});
            alert('Please refine the results before searching');
            return;
        }

        try {
            await this.setState({searching: true, funcs: []});

            const funcs = await Api.searchFuncs(
                this.state.text,
                this.state.type,
                this.state.target,
                this.state.team
            );

            this.setState({funcs, searched: true});
        } catch (e) {
            this.setState({
                error: e
            });
        } finally {
            this.setState({
                searching: false
            })
        }
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

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
                {this.state.funcs.map((func, index) => {
                    return (
                        <tr key={index}>
                            <td>{func.funcId}</td>
                            <td>
                                <FuncDescriptor region={this.props.region} func={func}/>
                            </td>
                            <td>
                                {
                                    (func.reverse?.basic?.NP ?? []).length
                                    + (func.reverse?.basic?.skill ?? []).length
                                }
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
        );

        return (
            <div>
                {this.state.searching ? <Loading/> : null}

                <h1>Functions Search</h1>

                <form onSubmit={(ev: React.FormEvent) => {
                    ev.preventDefault();
                    this.search();
                }}>
                    <Form.Group>
                        <Form.Label>Text</Form.Label>
                        <Form.Control value={this.state.text ?? ''}
                                      onChange={(ev: ChangeEvent) => {
                                          this.setState({text: ev.target.value});
                                      }}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Type</Form.Label>
                        <SearchableSelect<Func.FuncType> id='select-FuncType'
                                                         options={Object.values(Func.FuncType)}
                                                         labels={funcDescriptions}
                                                         selected={this.state.type}
                                                         onChange={(value?: Func.FuncType) => {
                                                             this.setState({type: value});
                                                         }}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Target</Form.Label>
                        <SearchableSelect<Func.FuncTargetType> id='select-FuncTargetType'
                                                               options={Object.values(Func.FuncTargetType)}
                                                               labels={targetDescriptions}
                                                               selected={this.state.target}
                                                               onChange={(value?: Func.FuncTargetType) => {
                                                                   this.setState({target: value});
                                                               }}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Affects Players/Enemies</Form.Label>
                        <SearchableSelect<Func.FuncTargetTeam> id='select-FuncTargetTeam'
                                                               options={Object.values(Func.FuncTargetTeam)}
                                                               labels={new Map<Func.FuncTargetTeam, string>([
                                                                   [Func.FuncTargetTeam.PLAYER_AND_ENEMY, 'Players and Enemies'],
                                                                   [Func.FuncTargetTeam.PLAYER, 'Players only'],
                                                                   [Func.FuncTargetTeam.ENEMY, 'Enemies only'],
                                                               ])}
                                                               selected={this.state.team}
                                                               onChange={(value?: Func.FuncTargetTeam) => {
                                                                   this.setState({team: value});
                                                               }}/>
                    </Form.Group>
                    <Button variant={'primary'} onClick={() => this.search()}>
                        Search
                        {' '}
                        <FontAwesomeIcon icon={faSearch}/>
                    </Button>
                </form>

                <hr/>

                {this.state.searched && <h5>Found <b>{this.state.funcs.length}</b> result{this.state.funcs.length > 1 ? 's' : ''}.</h5>}
                {this.state.funcs.length ? table : null}
            </div>
        );
    }
}

export default FuncsPage;
