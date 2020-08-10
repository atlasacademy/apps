import {ClassName, Region, ServantBasic} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";

import diacritics from 'diacritics';
import React from "react";
import {Form, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import Api from "../Api";
import ClassIcon from "../Component/ClassIcon";
import ErrorStatus from "../Component/ErrorStatus";
import FaceIcon from "../Component/FaceIcon";
import Loading from "../Component/Loading";
import RarityDescriptor from "../Descriptor/RarityDescriptor";
import Manager from "../Setting/Manager";
import minimatch from "minimatch";

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
    servants: ServantBasic[];
    activeClassFilters: ClassName[];
    activeRarityFilters: number[];
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
        } catch (e) {
            this.setState({
                error: e
            });
        }
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

    private servants(): ServantBasic[] {
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

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading)
            return <Loading/>;

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
                    {this
                        .servants()
                        .map((servant, index) => {
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
            </div>
        );
    }

}

export default ServantsPage;
