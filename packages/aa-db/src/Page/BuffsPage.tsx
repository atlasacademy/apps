import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AxiosError} from "axios";
import React from "react";
import {Button, Form, Table} from "react-bootstrap";
import Connection from "../Api/Connection";
import Buff, {BuffType} from "../Api/Data/Buff";
import Region from "../Api/Data/Region";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import BuffDescriptor, {typeDescriptions, upDownBuffs} from "../Descriptor/BuffDescriptor";

let stateCache = new Map<Region, IState>([]);

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps {
    region: Region;
}

interface IState {
    error?: AxiosError;
    searching: boolean;
    buffs: Buff[];
    name?: string;
    type?: BuffType;
}

class BuffsPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = stateCache.get(props.region) ?? {
            searching: false,
            buffs: []
        };
    }

    componentDidUpdate() {
        stateCache.set(this.props.region, {...this.state});
    }

    private describeBuffType(type: BuffType): string {
        for (let x in upDownBuffs) {
            if (upDownBuffs[x].up === type)
                return upDownBuffs[x].description + ' Up';

            if (upDownBuffs[x].down === type)
                return upDownBuffs[x].description + ' Down';
        }

        return typeDescriptions.get(type) ?? type;
    }

    private async search() {
        // no filter set
        if (!this.state.name && !this.state.type) {
            this.setState({buffs: []});
            alert('Please refine the results before searching');
            return;
        }

        try {
            await this.setState({searching: true, buffs: []});

            const buffs = await Connection.searchBuffs(
                this.props.region,
                this.state.name,
                this.state.type
            );

            this.setState({searching: false, buffs});
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
                        <Form.Label>Name</Form.Label>
                        <Form.Control value={this.state.name ?? ''}
                                      onChange={(ev: ChangeEvent) => {
                                          this.setState({name: ev.target.value});
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
                                              this.setState({type: ev.target.value as BuffType});
                                      }}>
                            <option value={'all'}>All</option>
                            {Object.values(BuffType).map((type, index) => {
                                return (
                                    <option key={index} value={type}>
                                        {this.describeBuffType(type)}
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
                        <th>Buff</th>
                        <th>Usage Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.buffs.map((buff, index) => {
                        return (
                            <tr key={index}>
                                <td>{buff.id}</td>
                                <td>
                                    <BuffDescriptor region={this.props.region} buff={buff}/>
                                </td>
                                <td>
                                    {buff.reverseFunctions.length}
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

export default BuffsPage;
