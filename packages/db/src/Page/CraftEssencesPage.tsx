import {CraftEssence, Entity, Region} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";
import diacritics from "diacritics";
import minimatch from "minimatch";
import React from "react";
import {Col, Form, Pagination, Row, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import FaceIcon from "../Component/FaceIcon";
import Loading from "../Component/Loading";
import RarityDescriptor from "../Descriptor/RarityDescriptor";
import Manager from "../Setting/Manager";

import "./CraftEssencesPage.css";

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {

}

interface MouseEvent extends React.MouseEvent<HTMLInputElement> {

}

interface IProps {
    region: Region;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    craftEssences: CraftEssence.CraftEssenceBasic[];
    activeRarityFilters: number[];
    perPage: number;
    page: number;
    search?: string;
}

class CraftEssencesPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            craftEssences: [],
            activeRarityFilters: [],
            perPage: 200,
            page: 0,
        };
    }

    componentDidMount() {
        try {
            Manager.setRegion(this.props.region);
            document.title = `[${this.props.region}] Craft Essences - Atlas Academy DB`
            Api.craftEssenceList().then(list => {
                this.setState({
                    loading: false,
                    craftEssences: list
                });
            });
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    private craftEssences(): CraftEssence.CraftEssenceBasic[] {
        let list = this.state.craftEssences.slice().reverse();

        if (this.state.activeRarityFilters.length > 0) {
            list = list.filter(entity => {
                return this.state.activeRarityFilters.indexOf(entity.rarity) !== -1;
            });
        }

        if (this.state.search) {
            const glob = diacritics.remove(this.state.search.toLowerCase())
                .split(' ')
                .filter(word => word)
                .join('*');

            list = list.filter(
                entity => {
                    const normalizedName = diacritics.remove(entity.name.toLowerCase());

                    return minimatch(normalizedName, `*${glob}*`);
                }
            );
        }

        return list;
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

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading)
            return <Loading/>;

        const craftEssences = this.craftEssences(),
            hasPaginator = craftEssences.length > this.state.perPage,
            results = craftEssences.slice(
                this.state.perPage * this.state.page,
                this.state.perPage * (this.state.page + 1)
            );

        return (
            <div id={'craft-essences'}>
                <Row>
                    <Col md={12} lg={{offset: hasPaginator ? 0 : 9, order: 2, span: 3}}>
                        <Form inline style={{justifyContent: 'center', marginBottom: 20}}>
                            <Form.Control style={{marginLeft: 'auto'}}
                                          placeholder={'Search'}
                                          value={this.state.search ?? ''}
                                          onChange={(ev: ChangeEvent) => {
                                              this.setState({search: ev.target.value, page: 0});
                                          }}/>
                        </Form>
                    </Col>
                    {craftEssences.length > this.state.perPage
                        ? <Col md={12} lg={{order: 1, span: 9}}>{this.paginator(craftEssences.length)}</Col>
                        : undefined}
                </Row>

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
                    {results.map((craftEssence, index) => {
                        const route = `/${this.props.region}/craft-essence/${craftEssence.collectionNo}`;

                        return <tr key={index}>
                            <td align={"center"}>
                                <Link to={route}>
                                    {craftEssence.collectionNo}
                                </Link>
                            </td>
                            <td align={"center"}>
                                <Link to={route}>
                                    <FaceIcon type={Entity.EntityType.SERVANT_EQUIP}
                                              rarity={craftEssence.rarity}
                                              location={craftEssence.face}
                                              height={50}/>
                                </Link>
                            </td>
                            <td>
                                <Link to={route}>
                                    {craftEssence.name}
                                </Link>
                            </td>
                            <td>
                                <RarityDescriptor rarity={craftEssence.rarity}/>
                            </td>
                        </tr>
                    })
                    }
                    </tbody>
                </Table>

                {craftEssences.length > this.state.perPage ? this.paginator(craftEssences.length) : undefined}
            </div>
        );
    }
}

export default CraftEssencesPage;
