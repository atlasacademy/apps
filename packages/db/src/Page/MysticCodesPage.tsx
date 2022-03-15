import { AxiosError } from "axios";
import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { MysticCode, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import FaceIcon from "../Component/FaceIcon";
import Loading from "../Component/Loading";
import Manager from "../Setting/Manager";

import "./ListingPage.css";

interface IProps {
    region: Region;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    mysticCodes: MysticCode.MysticCodeBasic[];
}

class MysticCodesPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            mysticCodes: [],
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        document.title = `[${this.props.region}] Mystic Codes - Atlas Academy DB`;
        Api.mysticCodeList()
            .then((mysticCodes) => this.setState({ mysticCodes, loading: false }))
            .catch((error) => this.setState({ error }));
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading) return <Loading />;

        return (
            <div id="mystic-codes" className="listing-page">
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th className="col-center">#</th>
                            <th style={{ textAlign: "center", width: "140px" }}>Thumbnail</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.mysticCodes.map((mysticCode) => {
                            const route = `/${this.props.region}/mystic-code/${mysticCode.id}`;

                            return (
                                <tr key={mysticCode.id}>
                                    <td className="col-center">
                                        <Link to={route}>{mysticCode.id}</Link>
                                    </td>
                                    <td className="col-center">
                                        <Link to={route}>
                                            <FaceIcon location={mysticCode.item.male} height={50} />
                                            <FaceIcon location={mysticCode.item.female} height={50} />
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={route}>{mysticCode.name}</Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default MysticCodesPage;
