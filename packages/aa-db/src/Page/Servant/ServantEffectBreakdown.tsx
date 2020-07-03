import React from "react";
import {Table} from "react-bootstrap";
import Func from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import FuncDescriptor from "../../Descriptor/FuncDescriptor";
import {describeMutators} from "../../Helper/FuncHelper";

import "./ServantEffectBreakdown.css";

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
                        return <td key={level}>{level+1}</td>;
                    })}
                </tr>
                </thead>
                <tbody>
                {this.props.cooldowns ? (
                    <tr>
                        <td className={'effect'}>Cooldown</td>
                        {this.props.cooldowns.map((cooldown, index) => {
                            return <td key={index}>{cooldown}</td>;
                        })}
                    </tr>
                ) : null}
                {this.props.funcs.map((func, index) => {
                    let mutatingDescriptions = describeMutators(this.props.region, func);

                    for (let i = 0; i < this.props.levels; i++) {
                        if (!mutatingDescriptions[i])
                            mutatingDescriptions.push('-');
                    }

                    return (
                        <React.Fragment key={index}>
                            <tr>
                                <td className={'effect'}>
                                    <FuncDescriptor region={this.props.region} func={func}/>
                                </td>
                                {mutatingDescriptions.map((description, index) => {
                                    return (
                                        <td key={index}>{description}</td>
                                    );
                                })}
                            </tr>
                        </React.Fragment>
                    );
                })}
                </tbody>
            </Table>
        );
    }
}

export default ServantEffectBreakdown;
