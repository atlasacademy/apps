import { AxiosError } from "axios";
import diacritics from "diacritics";
import escapeStringRegexp from "escape-string-regexp";
import React from "react";
import { Col, Form, Pagination, Row, Table, Button, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Bgm, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import BgmDescriptor, { getBgmName } from "../Descriptor/BgmDescriptor";
import ItemDescriptor from "../Descriptor/ItemDescriptor";
import Manager from "../Setting/Manager";

import "./ListingPage.css";

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

interface IProps {
    region: Region;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    bgms: Bgm.BgmEntity[];
    releaseOnlyFilter: boolean;
    perPage: number;
    page: number;
    search?: string;
}

class CraftEssencesPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            bgms: [],
            releaseOnlyFilter: false,
            perPage: 50,
            page: 0,
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        document.title = `[${this.props.region}] BGMs - Atlas Academy DB`;
        Api.bgmList()
            .then((bgms) => this.setState({ bgms, loading: false }))
            .catch((error) => this.setState({ error }));
    }

    private bgms(): Bgm.BgmEntity[] {
        let list = this.state.bgms
            .filter((bgm) => bgm.audioAsset && bgm.fileName !== "")
            .sort((a, b) => a.priority - b.priority);

        if (this.state.releaseOnlyFilter) {
            list = list.filter((bgm) => !bgm.notReleased);
        }

        if (this.state.search !== undefined && this.state.search !== "") {
            const glob = diacritics
                .remove(this.state.search.toLowerCase())
                .split(" ")
                .filter((word) => word)
                .map((word) => escapeStringRegexp(word))
                .join(".*");

            list = list.filter((bgm) => {
                const normalizedName = diacritics
                    .remove(bgm.name !== "" && bgm.name !== "0" ? `${bgm.name} ${bgm.fileName}` : bgm.fileName)
                    .toLowerCase();
                const searchName = `${bgm.id} ${normalizedName}`;

                return searchName.match(new RegExp(glob, "g"));
            });
        }

        return list;
    }

    private pageItem(label: string, page: number, key: string | number, active: boolean, disabled: boolean) {
        return (
            <li key={key} className={"page-item" + (active ? " active" : "") + (disabled ? " disabled" : "")}>
                {disabled ? (
                    <span className={"page-link"}>{label}</span>
                ) : (
                    <button className={"page-link"} onClick={() => this.setPage(page)}>
                        {label}
                    </button>
                )}
            </li>
        );
    }

    private toggleReleaseOnlyFilter(): void {
        this.setState({ releaseOnlyFilter: !this.state.releaseOnlyFilter });
    }

    private paginator(count: number): JSX.Element {
        const items = [],
            maxPage = Math.ceil(count / this.state.perPage) - 1,
            bounds = 2,
            nearbyPrev = [],
            nearbyNext = [],
            nearbyCount = bounds * 2 + 1;

        for (let i = 0; i < bounds * 2; i++) {
            const prev = this.state.page - i - 1;
            if (prev >= 0) {
                nearbyPrev.unshift(prev);
            }

            const next = this.state.page + i + 1;
            if (next <= maxPage) {
                nearbyNext.push(next);
            }
        }

        while (nearbyPrev.length + nearbyNext.length + 1 > nearbyCount) {
            if (nearbyNext.length > nearbyPrev.length) {
                nearbyNext.pop();
            } else {
                nearbyPrev.shift();
            }
        }

        const pages = nearbyPrev.concat([this.state.page], nearbyNext);

        items.push(this.pageItem("<", this.state.page - 1, "prev", false, this.state.page <= 0));

        if (pages[0] > 0) {
            items.push(this.pageItem("1", 0, "first", false, false));

            if (pages[0] === 2) {
                items.push(this.pageItem("2", 1, 1, false, false));
            } else if (pages[0] > 2) {
                items.push(this.pageItem("…", 0, "firstEllipsis", false, true));
            }
        }

        items.push(...pages.map((i) => this.pageItem((i + 1).toString(), i, i, i === this.state.page, false)));

        const lastNearbyPage = pages[pages.length - 1];
        if (lastNearbyPage < maxPage) {
            if (lastNearbyPage === maxPage - 2) {
                items.push(this.pageItem(maxPage.toString(), maxPage - 1, maxPage - 1, false, false));
            } else if (lastNearbyPage < maxPage - 2) {
                items.push(this.pageItem("…", maxPage, "lastEllipsis", false, true));
            }

            items.push(this.pageItem((maxPage + 1).toString(), maxPage, "last", false, false));
        }

        items.push(this.pageItem(">", this.state.page + 1, "next", false, this.state.page >= maxPage));

        return (
            <div className="page-navigator">
                <Pagination>{items}</Pagination>
            </div>
        );
    }

    private setPage(page: number) {
        this.setState({ page });
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading) return <Loading />;

        const bgms = this.bgms(),
            results = bgms.slice(this.state.perPage * this.state.page, this.state.perPage * (this.state.page + 1));

        const pageNavigator = this.paginator(bgms.length);

        return (
            <div id="bgms" className="listing-page">
                <Row>
                    <Col md={12} lg={3} id="item-type">
                        <ButtonGroup>
                            <Button
                                variant={this.state.releaseOnlyFilter ? "success" : "outline-dark"}
                                onClick={(_) => this.toggleReleaseOnlyFilter()}
                            >
                                Can be bought in my room
                            </Button>
                        </ButtonGroup>
                    </Col>
                    <Col md={12} lg={3} id="item-search">
                        <Form inline>
                            <Form.Control
                                placeholder={"Search"}
                                value={this.state.search ?? ""}
                                onChange={(ev: ChangeEvent) => {
                                    this.setState({
                                        search: ev.target.value,
                                        page: 0,
                                    });
                                }}
                            />
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col>{pageNavigator}</Col>
                </Row>
                <hr />

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th className="col-center">#</th>
                            <th className="col-center">Logo</th>
                            <th>Name</th>
                            <th>Unlock Cost</th>
                            <th>Player</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((bgm) => {
                            const route = `/${this.props.region}/bgm/${bgm.id}`;
                            const showName = getBgmName(bgm);

                            const shopDetail = bgm.shop ? (
                                <>
                                    <ItemDescriptor region={this.props.region} item={bgm.shop.cost.item} /> x
                                    {bgm.shop.cost.amount}
                                </>
                            ) : null;

                            return (
                                <tr key={bgm.id}>
                                    <td className="col-center">
                                        <Link to={route}>{bgm.id}</Link>
                                    </td>
                                    <td className="col-center">
                                        <Link to={route}>
                                            <img src={bgm.logo} style={{ height: "1.5em" }} alt="BGM Logo" />
                                        </Link>
                                    </td>
                                    <td
                                        style={{
                                            whiteSpace: Manager.showingJapaneseText() ? "pre-wrap" : "normal",
                                        }}
                                    >
                                        <Link to={route}>{showName}</Link>
                                    </td>
                                    <td>{shopDetail}</td>
                                    <td>
                                        <BgmDescriptor region={this.props.region} bgm={bgm} showName="Download" />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>

                {pageNavigator}
            </div>
        );
    }
}

export default CraftEssencesPage;
