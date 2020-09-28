import {Buff, Region} from "@atlasacademy/api-connector";
import {BuffDescriptor} from "@atlasacademy/api-descriptor";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AxiosError} from "axios";
import React from "react";
import {Button, Form, Table} from "react-bootstrap";
import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import SearchableSelect from "../Component/SearchableSelect";
import BuffDescription from "../Descriptor/BuffDescription";
import Manager from "../Setting/Manager";

let stateCache = new Map<Region, IState>([]);

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps {
    region: Region;
}

interface IState {
    error?: AxiosError;
    searching: boolean;
    buffs: Buff.Buff[];
    name?: string;
    type?: Buff.BuffType;
}

const buffDescriptions = new Map<Buff.BuffType, string>(
    Object.values(Buff.BuffType).map(type => {
        return [type, BuffDescriptor.describeType(type)];
    })
);

class BuffsPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = stateCache.get(props.region) ?? {
            searching: false,
            buffs: []
        };

        Manager.setRegion(this.props.region);
    }

    componentDidUpdate() {
        stateCache.set(this.props.region, {...this.state});
    }

    componentDidMount() {
        document.title = `[${this.props.region}] Buffs - Atlas Academy DB`
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

            const buffs = await Api.searchBuffs(
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

                <h1>Buffs Search</h1>

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
                        <SearchableSelect<Buff.BuffType> id='select-BuffType'
                                                         options={Object.values(Buff.BuffType)}
                                                         labels={buffDescriptions}
                                                         selected={this.state.type}
                                                         onChange={(value?: Buff.BuffType) => {
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
                                    <BuffDescription region={this.props.region} buff={buff}/>
                                </td>
                                <td>
                                    {(buff.reverse?.nice?.function ?? []).length}
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
