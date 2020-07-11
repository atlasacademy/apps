import React from "react";
import Card from "../../Api/Data/Card";
import Func from "../../Api/Data/Func";
import {NoblePhantasmGain} from "../../Api/Data/NoblePhantasm";
import Region from "../../Api/Data/Region";
import CardType from "../../Component/CardType";
import FuncDescriptor from "../../Descriptor/FuncDescriptor";
import SkillReferenceDescriptor from "../../Descriptor/SkillReferenceDescriptor";
import {describeMutators, getRelatedSkillIds} from "../../Helper/FuncHelper";
import {asPercent} from "../../Helper/OutputHelper";
import ServantAdditionalEffectBreakdown from "./ServantAdditionalEffectBreakdown";

interface IProps {
    region: Region;
    cooldowns?: number[];
    funcs: Func[];
    gain?: NoblePhantasmGain;
    levels: number;
    relatedSkillId?: number;
}

class ServantEffectBreakdownContent extends React.Component<IProps> {
    render() {
        return (
            <React.Fragment>
                {this.props.cooldowns ? (
                    <tr>
                        <td className={'effect'}>Cooldown</td>
                        {this.props.cooldowns.map((cooldown, index) => {
                            return <td key={index}>{cooldown}</td>;
                        })}
                    </tr>
                ) : null}
                {this.props.gain ? (
                    <tr>
                        <td className={'effect'}>NP Gain</td>
                        {[...Array(this.props.levels)].map((_, key) => {
                            return <td key={key}>
                                {asPercent(this.props.gain?.buster[key], 2)} <CardType card={Card.BUSTER}/><br/>
                                {asPercent(this.props.gain?.arts[key], 2)} <CardType card={Card.ARTS}/><br/>
                                {asPercent(this.props.gain?.quick[key], 2)} <CardType card={Card.QUICK}/><br/>
                                {asPercent(this.props.gain?.extra[key], 2)} <CardType card={Card.EXTRA}/><br/>
                                {asPercent(this.props.gain?.np[key], 2)} NP<br/>
                                {asPercent(this.props.gain?.defence[key], 2)} Def
                            </td>;
                        })}
                    </tr>
                ) : null}
                {this.props.funcs.map((func, index) => {
                    let mutatingDescriptions = describeMutators(this.props.region, func),
                        relatedSkillIds = getRelatedSkillIds(func);

                    for (let i = 0; i < this.props.levels; i++) {
                        if (!mutatingDescriptions[i])
                            mutatingDescriptions.push('-');
                    }

                    return (
                        <React.Fragment key={index}>
                            <tr>
                                <td className={'effect'}>
                                    {
                                        this.props.relatedSkillId
                                            ? <SkillReferenceDescriptor region={this.props.region}
                                                                        id={this.props.relatedSkillId}/>
                                            : null
                                    }
                                    {this.props.relatedSkillId ? ' ' : ''}
                                    <FuncDescriptor region={this.props.region} func={func}/>
                                </td>
                                {mutatingDescriptions.map((description, index) => {
                                    return (
                                        <td key={index}>{description}</td>
                                    );
                                })}
                            </tr>
                            {relatedSkillIds.map((skillId, index) => {
                                return <ServantAdditionalEffectBreakdown key={skillId}
                                                                         region={this.props.region}
                                                                         skillId={skillId}
                                                                         levels={this.props.levels}/>
                            })}
                        </React.Fragment>
                    );
                })}
            </React.Fragment>
        );
    }
}

export default ServantEffectBreakdownContent;
