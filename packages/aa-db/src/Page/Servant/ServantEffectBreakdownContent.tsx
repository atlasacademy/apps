import React from "react";
import Func from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import FuncDescriptor from "../../Descriptor/FuncDescriptor";
import SkillReferenceDescriptor from "../../Descriptor/SkillReferenceDescriptor";
import {describeMutators, getRelatedSkillIds} from "../../Helper/FuncHelper";
import ServantAdditionalEffectBreakdown from "./ServantAdditionalEffectBreakdown";

interface IProps {
    region: Region;
    cooldowns?: number[];
    funcs: Func[];
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
