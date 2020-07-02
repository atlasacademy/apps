import React from "react";
import {Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import Connection from "../Api/Connection";
import BasicListEntity from "../Api/Data/BasicListEntity";
import Region from "../Api/Data/Region";
import FaceIcon from "../Component/FaceIcon";
import Loading from "../Component/Loading";
import RarityDescriptor from "../Descriptor/RarityDescriptor";

import "./CraftEssencesPage.css";

interface Event extends React.MouseEvent<HTMLInputElement> {

}

interface IProps {
    region: Region;
}

interface IState {
    loading: boolean;
    craftEssences: BasicListEntity[];
    activeRarityFilters: number[];
}

class CraftEssencesPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            craftEssences: [],
            activeRarityFilters: [1, 2, 3, 4, 5],
        };
    }

    componentDidMount() {
        Connection.craftEssenceList(this.props.region).then(list => {
            this.setState({
                loading: false,
                craftEssences: list
            });
        });
    }

    private toggleRarityFilter(rarity: number): void {
        const exists = this.state.activeRarityFilters.indexOf(rarity) !== -1;

        if (exists) {
            this.setState({
                activeRarityFilters: this.state.activeRarityFilters.filter(activeRarity => activeRarity !== rarity)
            });
        } else {
            this.setState({
                activeRarityFilters: [
                    ...this.state.activeRarityFilters,
                    rarity
                ]
            });
        }
    }

    private craftEssences(): BasicListEntity[] {
        let list = this.state.craftEssences.slice().reverse();

        if (this.state.activeRarityFilters.length !== 5) {
            list = list.filter(entity => {
                return this.state.activeRarityFilters.indexOf(entity.rarity) !== -1;
            });
        }

        return list;
    }

    render() {
        if (this.state.loading)
            return <Loading/>;

        return (
            <div id={'craft-essences'}>
                <p className={'text-center'}>
                    {[1, 2, 3, 4, 5].map(rarity => {
                        const active = this.state.activeRarityFilters.indexOf(rarity) !== -1;

                        return (
                            <span key={rarity}
                                  className={'filter'}
                                  style={{opacity: active ? 1 : 0.5}}
                                  onClick={(ev: Event) => {
                                      this.toggleRarityFilter(rarity);
                                  }}>
                                <RarityDescriptor rarity={rarity} height={20}/>
                            </span>
                        );
                    })}
                </p>

                <hr/>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th style={{textAlign: "center", width: '1px'}}>#</th>
                        <th style={{textAlign: "center", width: '1px'}}>Thumbnail</th>
                        <th>Name</th>
                        <th>Rarity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.craftEssences()
                        .map((craftEssence, index) => {
                            const route = `/${this.props.region}/craft-essence/${craftEssence.collectionNo}`;

                            return <tr key={index}>
                                <td align={"center"}>
                                    <Link to={route}>
                                        {craftEssence.collectionNo}
                                    </Link>
                                </td>
                                <td align={"center"}>
                                    <Link to={route}>
                                        <FaceIcon type={craftEssence.type}
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
            </div>
        );
    }
}

export default CraftEssencesPage;
