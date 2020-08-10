import {CraftEssence, Region} from "@atlasacademy/api-connector";
import React from "react";
import {Table} from "react-bootstrap";
import {formatNumber} from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    craftEssence: CraftEssence;
}

class CraftEssenceStatGrowth extends React.Component<IProps> {
    render() {
        return (
            <div>
                <Table responsive>
                    <thead>
                    <tr>
                        <th>Level</th>
                        <th>HP</th>
                        <th>ATK</th>
                    </tr>
                    </thead>
                    <tbody>
                    {[...Array(this.props.craftEssence.lvMax)].map((_, i) => {
                        const index = this.props.craftEssence.lvMax - i - 1;

                        return (
                            <tr key={i}>
                                <td>{index + 1}</td>
                                <td>{formatNumber(this.props.craftEssence.hpGrowth[index])}</td>
                                <td>{formatNumber(this.props.craftEssence.atkGrowth[index])}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default CraftEssenceStatGrowth;
