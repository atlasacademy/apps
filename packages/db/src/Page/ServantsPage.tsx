import {ClassName, Region, Servant} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";
import diacritics from 'diacritics';
import escape from 'escape-string-regexp';
import React from "react";
import {Button, ButtonGroup, Col, Form, Pagination, Row, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import Api from "../Api";
import ClassIcon from "../Component/ClassIcon";
import ErrorStatus from "../Component/ErrorStatus";
import FaceIcon from "../Component/FaceIcon";
import Loading from "../Component/Loading";
import RarityDescriptor from "../Descriptor/RarityDescriptor";
import Manager from "../Setting/Manager";

import './ServantsPage.css';

const classFilters: ClassName[] = [
        ClassName.SABER,
        ClassName.ARCHER,
        ClassName.LANCER,
        ClassName.RIDER,
        ClassName.CASTER,
        ClassName.ASSASSIN,
        ClassName.BERSERKER,

        ClassName.RULER,
        ClassName.ALTER_EGO,
        ClassName.AVENGER,
        ClassName.MOON_CANCER,
        ClassName.FOREIGNER,
        ClassName.UNKNOWN
    ],
    normalClasses: ClassName[] = [
        ClassName.SABER,
        ClassName.ARCHER,
        ClassName.LANCER,
        ClassName.RIDER,
        ClassName.CASTER,
        ClassName.ASSASSIN,
        ClassName.BERSERKER,
    ],
    extraClasses: ClassName[] = [
        ClassName.RULER,
        ClassName.ALTER_EGO,
        ClassName.AVENGER,
        ClassName.MOON_CANCER,
        ClassName.FOREIGNER,
        ClassName.UNKNOWN
    ];

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {

}

interface MouseEvent extends React.MouseEvent<HTMLInputElement> {

}

interface IProps {
    region: Region,
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    servants: Servant.ServantBasic[];
    activeClassFilters: ClassName[];
    activeRarityFilters: number[];
    perPage: number;
    page: number;
    search?: string;
}

class ServantsPage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            servants: [],
            activeClassFilters: [],
            activeRarityFilters: [],
            perPage: 100,
            page: 0,
        };
    }

    componentDidMount() {
        try {
            Manager.setRegion(this.props.region);
            Api.servantList().then(servantList => {
                this.setState({
                    loading: false,
                    servants: servantList
                });
            });
            document.title = `[${this.props.region}] Servants - Atlas Academy DB`
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    componentDidUpdate(_ : Readonly<IProps>, prevState : Readonly<IState>) {
        // reset the search page, should any part of the filter changes.
        if (prevState.search !== this.state.search
            /**
             * Comparing arrays are okay in this case,
             * since we never create two identical arrays with the same content.
             * If the references don't match, it's likely that the contents differ anyway.
             */
            || prevState.activeClassFilters !== this.state.activeClassFilters
            || prevState.activeRarityFilters !== this.state.activeRarityFilters)
            this.setPage(0);
    }

    private isClassFilterActive(className: ClassName): boolean {
        return this.state.activeClassFilters.indexOf(className) !== -1;
    }

    private isUnknown(className: ClassName): boolean {
        return !classFilters.includes(className);
    }

    private pageItem(label: string, page: number, key: string | number, active: boolean, disabled: boolean) {
        return <li key={key} className={'page-item' + (active ? ' active' : '') + (disabled ? ' disabled' : '')}>
            {
                disabled
                    ? <span className={'page-link'}>{label}</span>
                    : <button className={'page-link'} onClick={() => this.setPage(page)}>{label}</button>
            }
        </li>
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

        items.push(this.pageItem('<', this.state.page - 1, 'prev', false, this.state.page <= 0));

        if (pages[0] > 0) {
            items.push(this.pageItem('1', 0, 'first', false, false));

            if (pages[0] > 1)
                items.push(this.pageItem('…', 0, 'firstEllipsis', false, true));
        }

        items.push(...pages.map(i => this.pageItem((i + 1).toString(), i, i, i === this.state.page, false)));

        if (pages[pages.length - 1] < maxPage) {
            items.push(this.pageItem('…', maxPage, 'lastEllipsis', false, true));

            if (pages[pages.length - 1] < maxPage)
                items.push(this.pageItem((maxPage + 1).toString(), maxPage, 'last', false, false));
        }

        items.push(this.pageItem('>', this.state.page + 1, 'next', false, this.state.page >= maxPage));

        return <div>
            <Pagination>{items}</Pagination>
        </div>;
    }

    private setPage(page: number) {
        this.setState({page});
    }

    private toggleClassFilter(className: ClassName): void {
        let exists = false,
            activeFilters = this.state.activeClassFilters.filter(activeClassName => {
                if (activeClassName === ClassName.ALL)
                    return false;

                if (activeClassName === className) {
                    exists = true;
                    return false;
                }

                return true;
            });

        if (!exists)
            activeFilters.push(className);

        this.setState({activeClassFilters: activeFilters});
        // reset the page number if anything changed
        this.setPage(0);
    }

    private toggleRarityFilter(rarity: number): void {
        if (this.state.activeRarityFilters.includes(rarity)) {
            this.setState({
                activeRarityFilters: this.state.activeRarityFilters.filter(activeRarity => activeRarity !== rarity)
            });
        } else {
            this.setState({
                activeRarityFilters: [...this.state.activeRarityFilters, rarity]
            });
        }
    }

    private servants(): Servant.ServantBasic[] {
        let list = this.state.servants.slice().reverse();

        if (this.state.activeRarityFilters.length > 0) {
            list = list.filter(entity => {
                return this.state.activeRarityFilters.includes(entity.rarity);
            });
        }

        if (this.state.activeClassFilters.length > 0) {
            list = list.filter(entity => {
                for (let className of this.state.activeClassFilters) {
                    if (className === ClassName.UNKNOWN && this.isUnknown(entity.className)) return true;
                    if (entity.className === className) return true;
                }

                return false;
            });
        }

        if (this.state.search) {
            const glob = diacritics.remove(this.state.search.toLowerCase())
                .split(' ')
                .filter(word => word)
                .map(word => escape(word))
                .join('.*');

            list = list.filter(
                entity => {
                    const normalizedName = diacritics.remove(entity.name.toLowerCase());

                    return normalizedName.match(new RegExp(glob, 'g'));
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

        const servants = this.servants(),
            hasPaginator = servants.length > this.state.perPage,
            results = servants.slice(
                this.state.perPage * this.state.page,
                this.state.perPage * (this.state.page + 1)
            );

        return (
            <div id="servants">
                <Row>
                    <Col md={12} lg="auto" style={{justifyContent: 'center', display: 'flex', flexFlow: 'row wrap', marginBottom: "1rem"}}>
                        {normalClasses.map(className => {
                            const active = this.isClassFilterActive(className);
                            return (
                                <span key={className}
                                    className={'filter'}
                                    style={{opacity: active ? 1 : 0.5}}
                                    onClick={(ev: MouseEvent) => {
                                        this.toggleClassFilter(className);
                                    }}>
                                    <ClassIcon height={37} rarity={active ? 5 : 3} className={className}/>
                                </span>
                            );
                        })}
                        <div className={"d-block d-lg-none"} style={{flexBasis: "100%", height: 0}}></div>
                        {extraClasses.map(className => {
                            const active = this.isClassFilterActive(className);
                            return (
                                <span key={className}
                                      className={'filter'}
                                      style={{opacity: active ? 1 : 0.5}}
                                      onClick={(ev: MouseEvent) => {
                                          this.toggleClassFilter(className);
                                      }}>
                                    <ClassIcon height={37} rarity={active ? 5 : 3} className={className}/>
                                </span>
                            );
                        })}
                    </Col>
                    <Col sm={12} lg={3} style={{marginLeft: "auto", marginBottom: "1rem"}}>
                        <Form>
                            <Form.Control
                                style={{width: "100%", height: 37, textAlign: 'center'}}
                                placeholder={'Search'}
                                value={this.state.search ?? ''}
                                onChange={(ev: ChangeEvent) => {
                                    this.setState({search: ev.target.value});
                                }}/>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={6} lg={5} style={{marginBottom: "1rem"}}>
                        <ButtonGroup style={{width: "100%"}}>
                            {
                                [...new Set(this.state.servants.map(s => s.rarity))]
                                    // deduplicate star counts
                                    .sort((a, b) => a - b)
                                    // sort
                                    .map(rarity => (
                                        <Button
                                            variant={
                                                this.state.activeRarityFilters.includes(rarity)
                                                ? "success"
                                                : "outline-dark"
                                            }
                                            key={rarity}
                                            onClick={(ev: MouseEvent) => this.toggleRarityFilter(rarity)}>
                                            {rarity} ☆
                                        </Button>
                                    ))
                            }
                        </ButtonGroup>
                    </Col>
                    <Col sm={12} md={6} lg={7}>
                        <div style={{ float: 'right' }}>
                            {this.paginator(servants.length)}
                        </div>
                    </Col>
                </Row>
                <hr style={{marginTop: 0}}/>

                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th style={{textAlign: "center", width: '1px'}}>#</th>
                        <th style={{textAlign: "center", width: '1px'}}>Class</th>
                        <th style={{textAlign: "center", width: '1px'}}>Thumbnail</th>
                        <th>Name</th>
                        <th>Rarity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {results.map((servant) => {
                        const route = `/${this.props.region}/servant/${servant.collectionNo}`;

                        return <tr key={servant.id}>
                            <td align={"center"}>
                                <Link to={route}>
                                    {servant.collectionNo} (<span style={{fontFamily: 'monospace', fontSize: '0.9rem'}}>{servant.id}</span>)
                                </Link>
                            </td>
                            <td align={"center"}>
                                <ClassIcon className={servant.className} rarity={servant.rarity} height={50}/>
                            </td>
                            <td align={"center"}>
                                <Link to={route}>
                                    <FaceIcon type={servant.type}
                                              rarity={servant.rarity}
                                              location={servant.face}
                                              height={50}/>
                                </Link>
                            </td>
                            <td>
                                <Link to={route}>
                                    {servant.name}
                                </Link>
                            </td>
                            <td>
                                <RarityDescriptor rarity={servant.rarity}/>
                            </td>
                        </tr>
                    })
                    }
                    </tbody>
                </Table>

                <div style={{ float: 'right' }}>
                    {hasPaginator ? this.paginator(servants.length) : undefined}
                </div>
            </div>
        );
    }

}

export default ServantsPage;
