import { AxiosError } from "axios";
import diacritics from "diacritics";
import escapeStringRegexp from "escape-string-regexp";
import React from "react";
import { Form, Table, Row, Col, ButtonGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { CommandCode, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import FaceIcon from "../Component/FaceIcon";
import Loading from "../Component/Loading";
import RarityDescriptor from "../Descriptor/RarityDescriptor";
import Manager from "../Setting/Manager";

import "./ListingPage.css";

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

interface IProps {
    region: Region;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    commandCodes: CommandCode.CommandCodeBasic[];
    activeRarityFilters: number[];
    search?: string;
}

class CommandCodesPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            commandCodes: [],
            activeRarityFilters: [],
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        document.title = `[${this.props.region}] Command Codes - Atlas Academy DB`;
        Api.commandCodeList()
            .then((commandCodes) => this.setState({ commandCodes, loading: false }))
            .catch((error) => this.setState({ error }));
    }

    private toggleRarityFilter(rarity: number): void {
        if (this.state.activeRarityFilters.includes(rarity)) {
            this.setState({
                activeRarityFilters: this.state.activeRarityFilters.filter((activeRarity) => activeRarity !== rarity),
            });
        } else {
            this.setState({
                activeRarityFilters: [...this.state.activeRarityFilters, rarity],
            });
        }
    }

    private commandCodes(): CommandCode.CommandCodeBasic[] {
        let list = this.state.commandCodes.slice().reverse();

        if (this.state.activeRarityFilters.length > 0) {
            list = list.filter((entity) => {
                return this.state.activeRarityFilters.includes(entity.rarity);
            });
        }

        if (this.state.search) {
            const glob = diacritics
                .remove(this.state.search.toLowerCase())
                .split(" ")
                .filter((word) => word)
                .map((word) => escapeStringRegexp(word))
                .join(".*");

            list = list.filter((entity) => {
                const normalizedName = diacritics.remove(entity.name.toLowerCase());
                const searchName = `${entity.id} ${entity.collectionNo} ${normalizedName}`;

                return searchName.match(new RegExp(glob, "g"));
            });
        }

        return list;
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading) return <Loading />;

        return (
            <div id="command-codes" className="listing-page">
                <Row>
                    <Col sm={6} md={5} id="item-rarity">
                        <ButtonGroup>
                            {[...new Set(this.state.commandCodes.map((s) => s.rarity))]
                                // deduplicate star counts
                                .sort((a, b) => a - b)
                                // sort
                                .map((rarity) => (
                                    <Button
                                        variant={
                                            this.state.activeRarityFilters.includes(rarity) ? "success" : "outline-dark"
                                        }
                                        key={rarity}
                                        onClick={(_) => this.toggleRarityFilter(rarity)}
                                    >
                                        {rarity} ★
                                    </Button>
                                ))}
                        </ButtonGroup>
                    </Col>
                    <Col sm={6} md={3} id="item-search">
                        <Form inline>
                            <Form.Control
                                placeholder={"Search"}
                                value={this.state.search ?? ""}
                                onChange={(ev: ChangeEvent) => {
                                    this.setState({ search: ev.target.value });
                                }}
                            />
                        </Form>
                    </Col>
                </Row>

                <hr />

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th className="col-center">#</th>
                            <th className="col-center">Thumbnail</th>
                            <th>Name</th>
                            <th>Rarity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.commandCodes().map((commandCode) => {
                            const route = `/${this.props.region}/command-code/${commandCode.collectionNo}`;

                            return (
                                <tr key={commandCode.id}>
                                    <td className="col-center">
                                        <Link to={route}>{commandCode.collectionNo}</Link>
                                    </td>
                                    <td className="col-center">
                                        <Link to={route}>
                                            <FaceIcon
                                                rarity={commandCode.rarity}
                                                location={commandCode.face}
                                                height={50}
                                            />
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={route}>{commandCode.name}</Link>
                                    </td>
                                    <td>
                                        <RarityDescriptor rarity={commandCode.rarity} />
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

export default CommandCodesPage;
