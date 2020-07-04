import React from "react";
import {Table} from "react-bootstrap";
import Func from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";

import "./ServantEffectBreakdown.css";
import ServantEffectBreakdownContent from "./ServantEffectBreakdownContent";

interface IProps {
    region: Region;
    cooldowns?: number[];
    funcs: Func[];
    levels: number;
}

class ServantEffectBreakdown extends React.Component<IProps> {
    render() {
        return (
            <Table responsive className={'effect-breakdown'}>
                <thead>
                <tr>
                    <th>Effect</th>
                    {Array.from(Array(this.props.levels).keys()).map(level => {
                        return <td key={level}>{level + 1}</td>;
                    })}
                </tr>
                </thead>
                <tbody>
                <ServantEffectBreakdownContent region={this.props.region}
                                               funcs={this.props.funcs}
                                               levels={this.props.levels}/>
                </tbody>
            </Table>
        );
    }
}

export default ServantEffectBreakdown;
