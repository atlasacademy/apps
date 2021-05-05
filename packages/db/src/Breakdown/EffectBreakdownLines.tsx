import {Card, Func, NoblePhantasm, Region, Skill} from "@atlasacademy/api-connector";
import {FuncDescriptor} from "@atlasacademy/api-descriptor";
import React from "react";
import CardType from "../Component/CardType";
import {default as FuncDescription} from "../Descriptor/FuncDescriptor";
import SkillReferenceDescriptor from "../Descriptor/SkillReferenceDescriptor";
import {describeMutators} from "../Helper/FuncHelper";
import {asPercent} from "../Helper/OutputHelper";
import AdditionalEffectBreakdown from "./AdditionalEffectBreakdown";
import ScriptBreakdown from "./ScriptBreakdown";

interface IProps {
    region: Region;
    cooldowns?: number[];
    funcs: Func.Func[];
    gain?: NoblePhantasm.NoblePhantasmGain;
    level?: number;
    levels?: number[];
    scripts?: Skill.SkillScript;
    relatedSkillId?: number;
    narrowWidth?: boolean; // Set the table width to be as small as possible;
}

class EffectBreakdownLines extends React.Component<IProps> {
    render() {
        const effectStyle =  this.props.narrowWidth ? {} : {
            maxWidth: "45%",
            minWidth: "300px",
            width: "45%"}
        return (
            <React.Fragment>
                {this.props.cooldowns ? (
                    <tr>
                        <td style={effectStyle}>Cooldown</td>
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
                        <td style={effectStyle}>NP Gain</td>
                        {[...Array(this.props.level)].map((_, key) => {
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
                        relatedSkillIds = FuncDescriptor.getRelatedSkillIds(func);

                    for (let i = 0; i < (this.props.level ?? 0); i++) {
                        if (!mutatingDescriptions[i])
                            mutatingDescriptions.push('-');
                    }

                    return (
                        <React.Fragment key={index}>
                            <tr>
                                <td style={effectStyle}>
                                    {
                                        this.props.relatedSkillId
                                            ? <SkillReferenceDescriptor region={this.props.region}
                                                                        id={this.props.relatedSkillId}/>
                                            : null
                                    }
                                    {this.props.relatedSkillId ? ' ' : ''}
                                    <FuncDescription region={this.props.region} func={func} levels={this.props.levels}/>
                                </td>
                                {this.props.level ? mutatingDescriptions.map((description, index) => {
                                    if (this.props.levels) {
                                        if (this.props.levels.includes(index + 1)) {
                                            return <td key={index}>{description}</td>
                                        } else if ((index + 1) >= Math.max(...this.props.levels) && index < (this.props.level ?? 0)) {
                                            return <td key={index}>-</td>
                                        } else {
                                            return null
                                        }
                                    } else {
                                        return <td key={index}>{description}</td>
                                    }
                                }) : null}
                            </tr>
                            {relatedSkillIds.map((relatedSkill, _) => {
                                return <AdditionalEffectBreakdown key={relatedSkill.skillId}
                                                                  region={this.props.region}
                                                                  skillId={relatedSkill.skillId}
                                                                  levels={relatedSkill.skillLvs}
                                                                  level={this.props.level}/>
                            })}
                        </React.Fragment>
                    );
                })}
            </React.Fragment>
        );
    }
}

export default EffectBreakdownLines;
