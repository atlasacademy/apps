import {AxiosError} from "axios";
import React from "react";
import {Form, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import Connection from "../Api/Connection";
import CommandCode from "../Api/Data/CommandCode";
import Region from "../Api/Data/Region";
import ErrorStatus from "../Component/ErrorStatus";
import FaceIcon from "../Component/FaceIcon";
import Loading from "../Component/Loading";
import RarityDescriptor from "../Descriptor/RarityDescriptor";

import "./CommandCodesPage.css";

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps {
    region: Region;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    commandCodes: CommandCode[];
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
            Connection.commandCodeList(this.props.region).then(list => {
                this.setState({
                    loading: false,
                    commandCodes: list
                });
            });
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    private commandCodes(): CommandCode[] {
        let list = this.state.commandCodes.slice().reverse();

        if (this.state.search) {
            const words = this.state.search
                .split(' ')
                .filter(word => word)
                .map(word => word.toLowerCase());

            list = list.filter(entity => words.every(word => entity.name.toLowerCase().includes(word)));
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
                        .map((commandCode, index) => {
                            const route = `/${this.props.region}/command-code/${commandCode.id}`;

                            return <tr key={index}>
                                <td align={"center"}>
                                    <Link to={route}>
                                        {commandCode.collectionNo}
                                    </Link>
                                </td>
                                <td align={"center"}>
                                    <Link to={route}>
                                        <FaceIcon rarity={commandCode.rarity}
                                                  location={commandCode.extraAssets.faces.cc[commandCode.id] ?? ''}
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
