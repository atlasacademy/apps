import React from "react";
import {Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import Connection from "../Api/Connection";
import BasicListEntity from "../Api/Data/BasicListEntity";
import Region from "../Api/Data/Region";
import FaceIcon from "../Component/FaceIcon";
import Loading from "../Component/Loading";
import RarityStars from "../Component/RarityStars";

import "./CraftEssencesPage.css";

interface IProps {
    region: Region;
}

interface IState {
    loading: boolean;
    craftEssences: BasicListEntity[];
}

class CraftEssencesPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            craftEssences: []
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

    render() {
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
                    {this.state.craftEssences.reverse().map((craftEssence, index) => {
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
                                <RarityStars rarity={craftEssence.rarity}/>
                            </td>
                        </tr>
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default CraftEssencesPage;
