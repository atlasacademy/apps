import {AxiosError} from "axios";
import React from "react";
import {Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import Connection from "../Api/Connection";
import BasicListEntity from "../Api/Data/BasicListEntity";
import Region from "../Api/Data/Region";
import ErrorStatus from "../Component/ErrorStatus";
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
    error?: AxiosError;
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
            activeRarityFilters: [],
        };
    }

    componentDidMount() {
        try {
            Connection.craftEssenceList(this.props.region).then(list => {
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

    private craftEssences(): BasicListEntity[] {
        let list = this.state.craftEssences.slice().reverse();

        if (this.state.activeRarityFilters.length > 0) {
            list = list.filter(entity => {
                return this.state.activeRarityFilters.indexOf(entity.rarity) !== -1;
            });
        }

        return list;
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading)
            return <Loading/>;

        return (
            <div id={'craft-essences'}>
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
