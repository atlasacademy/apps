import {Func, Region} from "@atlasacademy/api-connector";
import Card from "@atlasacademy/api-connector/dist/Enum/Card";
import {NoblePhantasmGain} from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import {SkillScript} from "@atlasacademy/api-connector/dist/Schema/Skill";
import React from "react";
import CardType from "../Component/CardType";
import FuncDescriptor from "../Descriptor/FuncDescriptor";
import SkillReferenceDescriptor from "../Descriptor/SkillReferenceDescriptor";
import {describeMutators, getRelatedSkillIds} from "../Helper/FuncHelper";
import {asPercent} from "../Helper/OutputHelper";
import AdditionalEffectBreakdown from "./AdditionalEffectBreakdown";
import ScriptBreakdown from "./ScriptBreakdown";

interface IProps {
    region: Region;
    cooldowns?: number[];
    funcs: Func[];
    gain?: NoblePhantasmGain;
    levels?: number;
    scripts?: SkillScript;
    relatedSkillId?: number;
}

class EffectBreakdownLines extends React.Component<IProps> {
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
                {this.props.scripts
                    ? <ScriptBreakdown region={this.props.region} scripts={this.props.scripts}/>
                    : null}
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

                    for (let i = 0; i < (this.props.levels ?? 0); i++) {
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
                                {this.props.levels ? mutatingDescriptions.map((description, index) => {
                                    return (
                                        <td key={index}>{description}</td>
                                    );
                                }) : null}
                            </tr>
                            {relatedSkillIds.map((skillId, index) => {
                                return <AdditionalEffectBreakdown key={skillId}
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

export default EffectBreakdownLines;
