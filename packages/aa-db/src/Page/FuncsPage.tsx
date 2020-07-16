import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AxiosError} from "axios";
import React from "react";
import {Button, Form, Table} from "react-bootstrap";
import Connection from "../Api/Connection";
import Func, {FuncTargetTeam, FuncTargetType, FuncType} from "../Api/Data/Func";
import Region from "../Api/Data/Region";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import {funcDescriptions} from "../Descriptor/Func/handleActionSection";
import FuncDescriptor from "../Descriptor/FuncDescriptor";

let stateCache = new Map<Region, IState>([]);

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps {
    region: Region;
}

interface IState {
    error?: AxiosError;
    searching: boolean;
    funcs: Func[];
    text?: string;
    type?: FuncType;
    target?: FuncTargetType;
    team?: FuncTargetTeam;
}

class FuncsPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = stateCache.get(props.region) ?? {
            searching: false,
            funcs: []
        };
    }

    componentDidUpdate() {
        stateCache.set(this.props.region, {...this.state});
    }

    private describeFuncType(type: FuncType): string {
        const description = funcDescriptions.get(type);

        return description
            ? `${description} - ${type}`
            : `(${type})`;
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

            const funcs = await Connection.searchFuncs(
                this.props.region,
                this.state.text,
                this.state.type,
                this.state.target,
                this.state.team
            );

            this.setState({searching: false, funcs});
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        return (
            <div>
                {this.state.searching ? <Loading/> : null}

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
                        <Form.Control as={'select'}
                                      value={this.state.type ?? 'all'}
                                      onChange={(ev: ChangeEvent) => {
                                          if (ev.target.value === 'all')
                                              this.setState({type: undefined});
                                          else
                                              this.setState({type: ev.target.value as FuncType});
                                      }}>
                            <option value={'all'}>All</option>
                            {Object.values(FuncType).map((type, index) => {
                                return (
                                    <option key={index} value={type}>
                                        {this.describeFuncType(type)}
                                    </option>
                                );
                            })}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Target</Form.Label>
                        <Form.Control as={'select'}
                                      value={this.state.target ?? 'all'}
                                      onChange={(ev: ChangeEvent) => {
                                          if (ev.target.value === 'all')
                                              this.setState({target: undefined});
                                          else
                                              this.setState({target: ev.target.value as FuncTargetType});
                                      }}>
                            <option value={'all'}>All</option>
                            {Object.values(FuncTargetType).map((target, index) => {
                                return (
                                    <option key={index} value={target}>
                                        {target}
                                    </option>
                                );
                            })}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Affects Players/Enemies</Form.Label>
                        <Form.Control as={'select'}
                                      value={this.state.team ?? 'all'}
                                      onChange={(ev: ChangeEvent) => {
                                          if (ev.target.value === 'all')
                                              this.setState({team: undefined});
                                          else
                                              this.setState({team: ev.target.value as FuncTargetTeam});
                                      }}>
                            <option value={'all'}>All</option>
                            {Object.values(FuncTargetTeam).map((team, index) => {
                                return (
                                    <option key={index} value={team}>
                                        {team}
                                    </option>
                                );
                            })}
                        </Form.Control>
                    </Form.Group>
                    <Button variant={'primary'} onClick={() => this.search()}>
                        Search
                        {' '}
                        <FontAwesomeIcon icon={faSearch}/>
                    </Button>
                </form>

                <hr/>

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
                                    {func.reverseTds.length + func.reverseSkills.length}
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default FuncsPage;
