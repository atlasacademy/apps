import {Region, Item} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";
import diacritics from 'diacritics';
import escape from 'escape-string-regexp';
import React from "react";
import {Form, Pagination, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import ItemIcon from "../Component/ItemIcon";
import Loading from "../Component/Loading";
import Manager from "../Setting/Manager";

import './MaterialsPage.css';

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
    itemList: Item.Item[];
    perPage: number;
    page: number;
    search?: string;
}

class MaterialsPage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            itemList: [],
            perPage: 100,
            page: 0,
        };
    }

    componentDidMount() {
        try {
            Manager.setRegion(this.props.region);
            Api.itemList().then(itemList => {
                this.setState({
                    loading: false,
                    itemList: itemList
                })
            });
            document.title = `[${this.props.region}] Materials - Atlas Academy DB`
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    componentDidUpdate(_ : Readonly<IProps>, prevState : Readonly<IState>) {
        // reset the search page, should the search term change
        if (prevState.search !== this.state.search)
            this.setPage(0);
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

    private materials(): Item.Item[] {
        let itemList = this.state.itemList.filter(material => (
            material.type === Item.ItemType.SKILL_LV_UP || material.type === Item.ItemType.TD_LV_UP // remove event items
        )).sort((a,b) => (a.id-b.id));//sort by id

        let materialsGems = itemList.filter(material => ( // All Gems
                material.id > 6000 && material.id < 6208
            )),
            materials = itemList.filter(material => ( // All Materials
                material.id > 6500 && material.id < 6600
            )),
            materialsStatues = itemList.filter(material => ( // All Statues
                material.id > 7000 && material.id < 7108
            ));

        let list = materialsGems.concat( // All Gems
            materials.filter(material => (material.background === Item.ItemBackgroundType.BRONZE)), // All Bronze mats
            materials.filter(material => (material.background === Item.ItemBackgroundType.SILVER)), // All Silver mats
            materials.filter(material => (material.background === Item.ItemBackgroundType.GOLD)), // All Gold mats
            materialsStatues // All Statues
        );

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

        const materials = this.materials(),
            hasPaginator = materials.length > this.state.perPage,
            results = materials.slice(
                this.state.perPage * this.state.page,
                this.state.perPage * (this.state.page + 1)
            );

        return (
            <div id="materials">

                <Form inline style={{justifyContent: 'center'}}>
                    {hasPaginator
                        ? <div>{this.paginator(materials.length)}</div>
                        : undefined}

                    <Form.Control style={{marginLeft: 'auto'}} placeholder={'Search'} value={this.state.search ?? ''}
                                  onChange={(ev: ChangeEvent) => {
                                      this.setState({search: ev.target.value});
                                  }}/>
                </Form>

                <hr/>

                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th style={{textAlign: 'center', width: '1px'}}>#</th>
                        <th style={{textAlign: "center", width: '1px'}}>Thumbnail</th>
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {results.map((material, index) => {
                        const route = `/${this.props.region}/material/${material.id}`;

                        return <tr key={index}>
                            <td align={"center"}>
                                <Link to={route}>
                                    {material.id}
                                </Link>
                            </td>
                            <td align={"center"}>
                                <Link to={route}>
                                    <ItemIcon region={this.props.region}
                                              item={material}
                                              height={50}/>
                                </Link>
                            </td>
                            <td>
                                <Link to={route}>
                                    {material.name}
                                </Link>
                            </td>
                        </tr>
                    })
                    }
                    </tbody>
                </Table>

                {hasPaginator ? this.paginator(materials.length) : undefined}
            </div>
        );
    }
}

export default MaterialsPage;
