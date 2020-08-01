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
import SearchableSelect from "../Component/SearchableSelect";
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

const buffDescriptions = new Map<BuffType, string>();
Object.values(BuffType).forEach(type => {
    let description;

    for (let x in upDownBuffs) {
        if (upDownBuffs[x].up === type)
            description = upDownBuffs[x].description + ' Up';

        if (upDownBuffs[x].down === type)
            description = upDownBuffs[x].description + ' Down';
    }

    if (description === undefined) {
        description = typeDescriptions.get(type);
    }

    if (description !== undefined) {
        buffDescriptions.set(type, description);
    }
})

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
                        <SearchableSelect<BuffType> id='select-BuffType'
                                                    options={Object.values(BuffType)}
                                                    labels={buffDescriptions}
                                                    onChange={(value?: BuffType) => {
                                                        this.setState({type: value});
                                                    }}/>
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
