import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import diacritics from "diacritics";
import escapeStringRegexp from "escape-string-regexp";
import React from "react";
import { Col, Form, Pagination, Row, Table, ButtonGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Event, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import { getCurrentTimestamp } from "../Helper/TimeHelper";
import Manager from "../Setting/Manager";

import "./ListingPage.css";

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

interface IProps {
    region: Region;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    events: Event.EventBasic[];
    activeEventTypeFilters: Event.EventType[];
    perPage: number;
    page: number;
    search?: string;
}

class EventsPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            events: [],
            activeEventTypeFilters: [],
            perPage: 50,
            page: 0,
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        document.title = `[${this.props.region}] Events - Atlas Academy DB`;
        Api.eventList()
            .then((events) => this.setState({ events, loading: false }))
            .catch((error) => this.setState({ error }));
    }

    private toggleEventTypeFilter(eventType: Event.EventType): void {
        if (this.state.activeEventTypeFilters.includes(eventType)) {
            this.setState({
                activeEventTypeFilters: this.state.activeEventTypeFilters.filter(
                    (activeType) => activeType !== eventType
                ),
            });
        } else {
            this.setState({
                activeEventTypeFilters: [...this.state.activeEventTypeFilters, eventType],
            });
        }
    }

    private events(): Event.EventBasic[] {
        let list = this.state.events.sort((a, b) => b.startedAt - a.startedAt);

        if (this.state.activeEventTypeFilters.length > 0) {
            list = list.filter((event) => this.state.activeEventTypeFilters.includes(event.type));
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
                const searchName = `${entity.id} ${normalizedName}`;

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

        const events = this.events(),
            results = events.slice(this.state.perPage * this.state.page, this.state.perPage * (this.state.page + 1));

        const pageNavigator = this.paginator(events.length);

        const currentTimestamp = getCurrentTimestamp();

        return (
            <div id="events" className="listing-page">
                <Row>
                    <Col md={12} lg={6} id="item-type">
                        <ButtonGroup>
                            {[
                                [Event.EventType.EVENT_QUEST, "Event"],
                                [Event.EventType.COMBINE_CAMPAIGN, "Servant Lvl Up"],
                                [Event.EventType.SVTEQUIP_COMBINE_CAMPAIGN, "CE Lvl Up"],
                                [Event.EventType.QUEST_CAMPAIGN, "AP Cost"],
                                [Event.EventType.WAR_BOARD, "Grail Front"],
                            ].map(([eventType, buttonText]) => {
                                return (
                                    <Button
                                        variant={
                                            this.state.activeEventTypeFilters.includes(eventType as Event.EventType)
                                                ? "success"
                                                : "outline-dark"
                                        }
                                        key={eventType}
                                        onClick={(_) => this.toggleEventTypeFilter(eventType as Event.EventType)}
                                    >
                                        {buttonText}
                                    </Button>
                                );
                            })}
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
                    <Col sm={12}>{pageNavigator}</Col>
                </Row>
                <hr />

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th className="col-center">#</th>
                            <th className="col-center">Ongoing</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((event) => {
                            const route = `/${this.props.region}/event/${event.id}`;
                            const isOngoing = currentTimestamp >= event.startedAt && currentTimestamp <= event.endedAt;

                            return (
                                <tr key={event.id}>
                                    <td className="col-center">
                                        <Link to={route}>{event.id}</Link>
                                    </td>
                                    <td className="col-center">
                                        {isOngoing ? (
                                            <FontAwesomeIcon
                                                icon={faCheckCircle}
                                                title="Master mission is ongoing right now"
                                            />
                                        ) : null}
                                    </td>
                                    <td>
                                        <Link to={route}>{event.name}</Link>
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

export default EventsPage;
