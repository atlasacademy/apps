import { AxiosError } from "axios";
import Fuse from "fuse.js";
import React from "react";
import { Button, ButtonGroup, Col, Form, Pagination, Row, Table } from "react-bootstrap";
import { WithTranslation, withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { CraftEssence, Entity, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import FaceIcon from "../Component/FaceIcon";
import Loading from "../Component/Loading";
import RarityDescriptor from "../Descriptor/RarityDescriptor";
import { preventDefault } from "../Helper/Form";
import { fuseGetFn, removeDiacriticalMarks } from "../Helper/StringHelper";
import Manager, { lang } from "../Setting/Manager";

import "./ListingPage.css";

enum CEType {
    VALENTINE = "valentine",
    BOND = "bond",
    COMMEMORATIVE = "commemorative",
    OTHER = "other",
}

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

interface IProps extends WithTranslation {
    region: Region;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    craftEssences: CraftEssence.CraftEssenceBasic[];
    activeRarityFilters: number[];
    activeCETypeFilters: CEType[];
    perPage: number;
    page: number;
    search?: string;
    fuse: Fuse<CraftEssence.CraftEssenceBasic>;
}

class CraftEssencesPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            craftEssences: [],
            activeRarityFilters: [],
            activeCETypeFilters: [],
            perPage: 100,
            page: 0,
            fuse: new Fuse([]),
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        document.title = `[${this.props.region}] Craft Essences - Atlas Academy DB`;
        Api.craftEssenceList()
            .then((craftEssences) =>
                this.setState({
                    craftEssences,
                    loading: false,
                    fuse: new Fuse([...craftEssences], {
                        keys: ["id", "collectionNo", "name", "originalName"],
                        threshold: 0.2,
                        getFn: fuseGetFn,
                        ignoreLocation: true,
                    }),
                })
            )
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

    private toggleCETypeFilter(ceType: CEType): void {
        if (this.state.activeCETypeFilters.includes(ceType)) {
            this.setState({
                activeCETypeFilters: this.state.activeCETypeFilters.filter((activeType) => activeType !== ceType),
            });
        } else {
            this.setState({
                activeCETypeFilters: [...this.state.activeCETypeFilters, ceType],
            });
        }
    }

    private craftEssences(): CraftEssence.CraftEssenceBasic[] {
        let list = this.state.craftEssences.slice().reverse();

        if (this.state.activeRarityFilters.length > 0) {
            list = list.filter((entity) => {
                return this.state.activeRarityFilters.includes(entity.rarity);
            });
        }

        if (this.state.activeCETypeFilters.length > 0) {
            const currentYear = new Date().getFullYear();
            list = list.filter((entity) => {
                const atkMax = entity.atkMax;
                const hpMax = entity.hpMax;

                const isValentine = entity.valentineEquipOwner !== undefined;
                const isBond = entity.bondEquipOwner !== undefined;
                const isCommemorative =
                    !isValentine &&
                    !isBond &&
                    ((atkMax === hpMax && [500, 100, 0].includes(atkMax)) ||
                        (hpMax >= 2016 && hpMax <= currentYear + 1));
                const isOther = !isValentine && !isBond && !isCommemorative;

                return (
                    (this.state.activeCETypeFilters.includes(CEType.VALENTINE) && isValentine) ||
                    (this.state.activeCETypeFilters.includes(CEType.BOND) && isBond) ||
                    (this.state.activeCETypeFilters.includes(CEType.COMMEMORATIVE) && isCommemorative) ||
                    (this.state.activeCETypeFilters.includes(CEType.OTHER) && isOther)
                );
            });
        }

        if (this.state.search) {
            const matchedFuzzyIds = new Set(
                this.state.fuse.search(removeDiacriticalMarks(this.state.search)).map((doc) => doc.item.id)
            );
            list = list.filter((entity) => matchedFuzzyIds.has(entity.id));
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
        const t = this.props.t;
        const craftEssences = this.craftEssences(),
            results = craftEssences.slice(
                this.state.perPage * this.state.page,
                this.state.perPage * (this.state.page + 1)
            );

        const pageNavigator = this.paginator(craftEssences.length);

        return (
            <div id="craft-essences" className="listing-page">
                <Row>
                    <Col md={12} lg={6} xl={5} id="item-type">
                        <ButtonGroup>
                            {[
                                [CEType.OTHER, t("Regular CE")],
                                [CEType.VALENTINE, t("Valentine CE")],
                                [CEType.BOND, t("Bond CE")],
                                [CEType.COMMEMORATIVE, t("EXP CE")],
                            ].map(([ceType, buttonText]) => {
                                return (
                                    <Button
                                        variant={
                                            this.state.activeCETypeFilters.includes(ceType as CEType)
                                                ? "success"
                                                : "outline-dark"
                                        }
                                        key={ceType}
                                        onClick={(_) => this.toggleCETypeFilter(ceType as CEType)}
                                    >
                                        {buttonText}
                                    </Button>
                                );
                            })}
                        </ButtonGroup>
                    </Col>
                    <Col md={12} lg={3} id="item-search">
                        <Form inline onSubmit={preventDefault}>
                            <Form.Control
                                placeholder={t("Search")}
                                value={this.state.search ?? ""}
                                onChange={(ev: ChangeEvent) => {
                                    this.setState({ search: ev.target.value, page: 0 });
                                }}
                                lang={lang(this.props.region)}
                            />
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={5} id="item-rarity">
                        <ButtonGroup>
                            {[...new Set(this.state.craftEssences.map((s) => s.rarity))]
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
                    <Col sm={12} md={7}>
                        {pageNavigator}
                    </Col>
                </Row>
                <hr />

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th className="col-center">#</th>
                            <th className="col-center">{t("Thumbnail")}</th>
                            <th>{t("Name")}</th>
                            <th className="rarity-col">{t("Rarity")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((craftEssence) => {
                            const route = `/${this.props.region}/craft-essence/${craftEssence.collectionNo}`;

                            return (
                                <tr key={craftEssence.id}>
                                    <td className="col-center">
                                        <Link to={route}>
                                            {craftEssence.collectionNo} (
                                            <span className="listing-svtId" lang="en-US">
                                                {craftEssence.id}
                                            </span>
                                            )
                                        </Link>
                                    </td>
                                    <td className="col-center">
                                        <Link to={route}>
                                            <FaceIcon
                                                type={Entity.EntityType.SERVANT_EQUIP}
                                                rarity={craftEssence.rarity}
                                                location={craftEssence.face}
                                                height={50}
                                            />
                                        </Link>
                                    </td>
                                    <td
                                        style={{ whiteSpace: Manager.showingJapaneseText() ? "pre-wrap" : "normal" }}
                                        lang={lang(this.props.region)}
                                    >
                                        <Link to={route}>{craftEssence.name}</Link>
                                    </td>
                                    <td className="rarity-col">
                                        <RarityDescriptor rarity={craftEssence.rarity} />
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

export default withTranslation()(CraftEssencesPage);
