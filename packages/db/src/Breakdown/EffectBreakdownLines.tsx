import React from "react";
import { Table } from "react-bootstrap";

import { Card, Func, NoblePhantasm, Region, Skill } from "@atlasacademy/api-connector";
import { FuncDescriptor } from "@atlasacademy/api-descriptor";

import CardType from "../Component/CardType";
import { CollapsibleLight } from "../Component/CollapsibleContent";
import { default as FuncDescription } from "../Descriptor/FuncDescriptor";
import { NoblePhantasmDescriptorId } from "../Descriptor/NoblePhantasmDescriptor";
import SkillReferenceDescriptor from "../Descriptor/SkillReferenceDescriptor";
import { describeMutators } from "../Helper/FuncHelper";
import { asPercent } from "../Helper/OutputHelper";
import AdditionalEffectBreakdown from "./AdditionalEffectBreakdown";
import ScriptBreakdown from "./ScriptBreakdown";

import "./EffectBreakdownLines.css";

interface IProps {
    region: Region;
    cooldowns?: number[];
    funcs: Func.Func[];
    triggerSkillIdStack: number[];
    gain?: NoblePhantasm.NoblePhantasmGain;
    level?: number;
    levels?: number[];
    scripts?: Skill.SkillScript;
    relatedSkillId?: number;
    relatedNpId?: number;
    popOver?: boolean;
    additionalSkillId?: number[];
}

class EffectBreakdownLines extends React.Component<IProps> {
    render() {
        const effectStyle = this.props.popOver ? { maxWidth: "400px" } : { width: "45%", minWidth: "300px" };
        return (
            <React.Fragment>
                {this.props.cooldowns && (this.props.level || this.props.levels) ? (
                    <tr>
                        <td style={effectStyle}>Cooldown</td>
                        {this.props.cooldowns.map((cooldown, index) => {
                            return <td key={index}>{cooldown}</td>;
                        })}
                    </tr>
                ) : null}
                {this.props.cooldowns && !this.props.level && !this.props.levels ? (
                    <tr>
                        <td style={effectStyle}>Cooldown {this.props.cooldowns.join(", ")} turn(s)</td>
                    </tr>
                ) : null}
                {this.props.scripts ? (
                    <ScriptBreakdown region={this.props.region} scripts={this.props.scripts} />
                ) : null}
                {this.props.gain ? (
                    <tr>
                        <td style={effectStyle}>NP Gain</td>
                        {[...Array(this.props.level)].map((_, key) => {
                            return (
                                <td key={key}>
                                    {asPercent(this.props.gain?.buster[key], 2)} <CardType card={Card.BUSTER} />
                                    <br />
                                    {asPercent(this.props.gain?.arts[key], 2)} <CardType card={Card.ARTS} />
                                    <br />
                                    {asPercent(this.props.gain?.quick[key], 2)} <CardType card={Card.QUICK} />
                                    <br />
                                    {asPercent(this.props.gain?.extra[key], 2)} <CardType card={Card.EXTRA} />
                                    <br />
                                    {asPercent(this.props.gain?.np[key], 2)} NP
                                    <br />
                                    {asPercent(this.props.gain?.defence[key], 2)} Def
                                </td>
                            );
                        })}
                    </tr>
                ) : null}
                {this.props.funcs.map((func, index) => {
                    let mutatingDescriptions = describeMutators(this.props.region, func),
                        relatedSkillIds = FuncDescriptor.getRelatedSkillIds(func).filter(
                            (skill) => !this.props.triggerSkillIdStack.includes(skill.skillId)
                        ),
                        relatedNpIds = FuncDescriptor.getRelatedNpIds(func),
                        additionalSkillRow = <></>;

                    if (index === this.props.funcs.length - 1 && this.props.additionalSkillId) {
                        relatedSkillIds.push({
                            skillId: this.props.additionalSkillId[0],
                            skillLvs: [this.props.additionalSkillId.length],
                        });

                        additionalSkillRow = (
                            <tr>
                                <td style={effectStyle}>
                                    Additional skill:{" "}
                                    <SkillReferenceDescriptor
                                        region={this.props.region}
                                        id={this.props.additionalSkillId[0]}
                                    />
                                </td>
                            </tr>
                        );
                    }

                    for (let i = 0; i < (this.props.level ?? 0); i++) {
                        if (!mutatingDescriptions[i]) mutatingDescriptions.push("-");
                    }

                    return (
                        <React.Fragment key={index}>
                            <tr>
                                <td style={effectStyle}>
                                    {this.props.relatedSkillId ? (
                                        <>
                                            <SkillReferenceDescriptor
                                                region={this.props.region}
                                                id={this.props.relatedSkillId}
                                            />{" "}
                                        </>
                                    ) : null}
                                    {this.props.relatedNpId ? (
                                        <>
                                            <NoblePhantasmDescriptorId
                                                region={this.props.region}
                                                noblePhantasmId={this.props.relatedNpId}
                                            />{" "}
                                        </>
                                    ) : null}
                                    <FuncDescription
                                        region={this.props.region}
                                        func={func}
                                        levels={this.props.levels}
                                    />
                                </td>
                                {this.props.level
                                    ? mutatingDescriptions.map((description, index) => {
                                          if (this.props.levels) {
                                              if (this.props.levels.includes(index + 1)) {
                                                  return <td key={index}>{description}</td>;
                                              } else if (
                                                  index + 1 >= Math.max(...this.props.levels) &&
                                                  index < (this.props.level ?? 0)
                                              ) {
                                                  return <td key={index}>-</td>;
                                              } else {
                                                  return null;
                                              }
                                          } else {
                                              return <td key={index}>{description}</td>;
                                          }
                                      })
                                    : null}
                            </tr>
                            {additionalSkillRow}
                            {relatedSkillIds.map((relatedSkill) => {
                                return (
                                    <tr className="trigger-skill" key={relatedSkill.skillId}>
                                        <td colSpan={11}>
                                            <CollapsibleLight
                                                title={
                                                    <span className="trigger-skill-name">
                                                        {relatedSkill.skillId}:{" "}
                                                        <SkillReferenceDescriptor
                                                            region={this.props.region}
                                                            id={relatedSkill.skillId}
                                                        />
                                                    </span>
                                                }
                                                content={
                                                    <>
                                                        <Table>
                                                            <tbody>
                                                                <AdditionalEffectBreakdown
                                                                    key={relatedSkill.skillId}
                                                                    region={this.props.region}
                                                                    id={relatedSkill.skillId}
                                                                    triggerSkillIdStack={this.props.triggerSkillIdStack.concat(
                                                                        [relatedSkill.skillId]
                                                                    )}
                                                                    levels={relatedSkill.skillLvs}
                                                                    level={this.props.level}
                                                                    popOver={this.props.popOver}
                                                                />
                                                            </tbody>
                                                        </Table>
                                                    </>
                                                }
                                                eventKey={relatedSkill.skillId.toString()}
                                                defaultActiveKey={relatedSkill.skillId.toString()}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                            {relatedNpIds.map((relatedNp) => {
                                return (
                                    <tr className="trigger-skill" key={relatedNp.npId}>
                                        <td colSpan={6}>
                                            <CollapsibleLight
                                                title={
                                                    <span className="trigger-skill-name">
                                                        {relatedNp.npId}:{" "}
                                                        <NoblePhantasmDescriptorId
                                                            region={this.props.region}
                                                            noblePhantasmId={relatedNp.npId}
                                                        />
                                                    </span>
                                                }
                                                content={
                                                    <>
                                                        <Table>
                                                            <tbody>
                                                                <AdditionalEffectBreakdown
                                                                    key={relatedNp.npId}
                                                                    region={this.props.region}
                                                                    id={relatedNp.npId}
                                                                    isNp={true}
                                                                    triggerSkillIdStack={this.props.triggerSkillIdStack.concat(
                                                                        [relatedNp.npId]
                                                                    )}
                                                                    levels={relatedNp.npLvs}
                                                                    level={this.props.level}
                                                                    popOver={this.props.popOver}
                                                                />
                                                            </tbody>
                                                        </Table>
                                                    </>
                                                }
                                                eventKey={relatedNp.npId.toString()}
                                                defaultActiveKey={relatedNp.npId.toString()}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </React.Fragment>
        );
    }
}

export default EffectBreakdownLines;
