import {CommandCode, Region} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";
import diacritics from 'diacritics';
import minimatch from "minimatch";
import React from "react";
import {Form, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import FaceIcon from "../Component/FaceIcon";
import Loading from "../Component/Loading";
import RarityDescriptor from "../Descriptor/RarityDescriptor";
import Manager from "../Setting/Manager";

import "./CommandCodesPage.css";

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps {
    region: Region;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    commandCodes: CommandCode.CommandCodeBasic[];
    search?: string;
}

class CommandCodesPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            commandCodes: [],
        };
    }

    componentDidMount() {
        try {
            Manager.setRegion(this.props.region);
            Api.commandCodeList().then(list => {
                this.setState({
                    loading: false,
                    commandCodes: list
                });
                document.title = `[${this.props.region}] Command Codes - Atlas Academy DB`
            });
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    private commandCodes(): CommandCode.CommandCodeBasic[] {
        let list = this.state.commandCodes.slice().reverse();

        if (this.state.search) {
            const glob = diacritics.remove(this.state.search.toLowerCase())
                .split(' ')
                .filter(word => word)
                .join('*');

            list = list.filter(
                entity => {
                    const normalizedName = diacritics.remove(entity.name.toLowerCase());
                    const searchName = `${entity.id} ${entity.collectionNo} ${normalizedName}`;

                    return minimatch(searchName, `*${glob}*`);
                }
            );
        }

        return list;
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading)
            return <Loading/>;

        return (
            <div id={'command-codes'}>
                <Form inline style={{justifyContent: 'center'}}>
                    <Form.Control style={{marginLeft: 'auto'}} placeholder={'Search'} value={this.state.search ?? ''}
                                  onChange={(ev: ChangeEvent) => {
                                      this.setState({search: ev.target.value});
                                  }}/>
                </Form>

                <hr/>

                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th style={{textAlign: "center", width: '1px'}}>#</th>
                        <th style={{textAlign: "center", width: '1px'}}>Thumbnail</th>
                        <th>Name</th>
                        <th>Rarity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.commandCodes()
                        .map((commandCode) => {
                            const route = `/${this.props.region}/command-code/${commandCode.collectionNo}`;

                            return <tr key={commandCode.id}>
                                <td align={"center"}>
                                    <Link to={route}>
                                        {commandCode.collectionNo}
                                    </Link>
                                </td>
                                <td align={"center"}>
                                    <Link to={route}>
                                        <FaceIcon rarity={commandCode.rarity}
                                                  location={commandCode.face}
                                                  height={50}/>
                                    </Link>
                                </td>
                                <td>
                                    <Link to={route}>
                                        {commandCode.name}
                                    </Link>
                                </td>
                                <td>
                                    <RarityDescriptor rarity={commandCode.rarity}/>
                                </td>
                            </tr>
                        })
                    }
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default CommandCodesPage;
