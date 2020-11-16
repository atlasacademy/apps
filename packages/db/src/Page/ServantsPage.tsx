import {ClassName, Region, Servant} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";
import diacritics from 'diacritics';
import escape from 'escape-string-regexp';
import React from "react";
import {Form, Pagination, Table} from "react-bootstrap";
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
    ClassName.EXTRA,
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
        // reset the search page, should the search term changes
        if (prevState.search !== this.state.search)
            this.setPage(0);
    }

    private isClassFilterActive(className: ClassName): boolean {
        return this.state.activeClassFilters.indexOf(className) !== -1;
    }

    private isExtra(className: ClassName): boolean {
        return !(className === ClassName.SABER
            || className === ClassName.ARCHER
            || className === ClassName.LANCER
            || className === ClassName.RIDER
            || className === ClassName.CASTER
            || className === ClassName.ASSASSIN
            || className === ClassName.BERSERKER);
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

        return <div style={{marginBottom: 20}}>
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
        const exists = this.state.activeRarityFilters.indexOf(rarity) !== -1;

        if (exists) {
            this.setState({
                activeClassFilters: this.state.activeClassFilters.filter(activeClass => activeClass !== ClassName.ALL),
                activeRarityFilters: this.state.activeRarityFilters.filter(activeRarity => activeRarity !== rarity)
            });
        } else {
            this.setState({
                activeClassFilters: this.state.activeClassFilters.filter(activeClass => activeClass !== ClassName.ALL),
                activeRarityFilters: [
                    ...this.state.activeRarityFilters,
                    rarity
                ]
            });
        }
    }

    private servants(): Servant.ServantBasic[] {
        let list = this.state.servants.slice().reverse();

        if (this.state.activeRarityFilters.length > 0) {
            list = list.filter(entity => {
                return this.state.activeRarityFilters.indexOf(entity.rarity) !== -1;
            });
        }

        if (this.state.activeClassFilters.length > 0) {
            list = list.filter(entity => {
                for (let x in this.state.activeClassFilters) {
                    const className = this.state.activeClassFilters[x];

                    if (className === ClassName.EXTRA && this.isExtra(entity.className)) {
                        return true;
                    } else if (entity.className === className) {
                        return true;
                    }
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
                <Form inline style={{justifyContent: 'center'}}>
                    {classFilters.map(className => {
                        const active = this.isClassFilterActive(className);
                        return (
                            <span key={className}
                                  className={'filter'}
                                  style={{opacity: active ? 1 : 0.5}}
                                  onClick={(ev: MouseEvent) => {
                                      this.toggleClassFilter(className);
                                  }}>
                                <ClassIcon height={50} rarity={active ? 5 : 3} className={className}/>
                            </span>
                        );
                    })}
                    <Form.Control style={{marginLeft: 'auto'}} placeholder={'Search'} value={this.state.search ?? ''}
                                  onChange={(ev: ChangeEvent) => {
                                      this.setState({search: ev.target.value});
                                  }}/>
                </Form>

                <br/>

                {hasPaginator
                    ? <div>{this.paginator(servants.length)}</div>
                    : undefined}

                <hr/>

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
                    {results.map((servant, index) => {
                        const route = `/${this.props.region}/servant/${servant.collectionNo}`;

                        return <tr key={index}>
                            <td align={"center"}>
                                <Link to={route}>
                                    {servant.collectionNo}
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

                {hasPaginator ? this.paginator(servants.length) : undefined}
            </div>
        );
    }

}

export default ServantsPage;
