import React from "react";
import {Table} from "react-bootstrap";
import Region from "../../Api/Data/Region";
import Servant from "../../Api/Data/Servant";
import BuffIcon from "../../Component/BuffIcon";
import {formatNumber} from "../../Helper/OutputHelper";

const grailIcon = 'https://assets.atlasacademy.io/GameData/NA/Items/7999.png';

interface IProps {
    region: Region;
    servant: Servant;
}

class ServantStatGrowth extends React.Component<IProps> {
    render() {
        return (
            <div>
                <Table responsive>
                    <thead>
                    <tr>
                        <th style={{width: 1}}>&nbsp;</th>
                        <th>Level</th>
                        <th>HP</th>
                        <th>ATK</th>
                    </tr>
                    </thead>
                    <tbody>
                    {[...Array(100)].map((_, i) => {
                        const index = 100 - i - 1;

                        return (
                            <tr key={i}>
                                <td>
                                    {index >= this.props.servant.lvMax ? <BuffIcon location={grailIcon}/> : null}
                                </td>
                                <td>{index + 1}</td>
                                <td>{formatNumber(this.props.servant.hpGrowth[index])}</td>
                                <td>{formatNumber(this.props.servant.atkGrowth[index])}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default ServantStatGrowth;
