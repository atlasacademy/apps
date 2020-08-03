import React from "react";
import {Table} from "react-bootstrap";
import Func from "../Api/Data/Func";
import {NoblePhantasmGain} from "../Api/Data/NoblePhantasm";
import Region from "../Api/Data/Region";
import {SkillScript} from "../Api/Data/Skill";
import EffectBreakdownLines from "./EffectBreakdownLines";

import "./EffectBreakdown.css";

interface IProps {
    region: Region;
    cooldowns?: number[];
    funcs: Func[];
    gain?: NoblePhantasmGain;
    levels?: number;
    scripts?: SkillScript;
}

class EffectBreakdown extends React.Component<IProps> {
    render() {
        return (
            <Table responsive className={'effect-breakdown'}>
                <thead>
                <tr>
                    <th>Effect</th>
                    {this.props.levels ? Array.from(Array(this.props.levels).keys()).map(level => {
                        return <td key={level}>{level + 1}</td>;
                    }) : null}
                </tr>
                </thead>
                <tbody>
                <EffectBreakdownLines region={this.props.region}
                                      cooldowns={this.props.cooldowns}
                                      funcs={this.props.funcs}
                                      gain={this.props.gain}
                                      levels={this.props.levels}
                                      scripts={this.props.scripts}/>
                </tbody>
            </Table>
        );
    }
}

export default EffectBreakdown;
