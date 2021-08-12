import {Region, Skill} from "@atlasacademy/api-connector";
import React from "react";
import {Alert, OverlayTrigger, Tooltip} from "react-bootstrap";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QuestDescriptor from "../Descriptor/QuestDescriptor";
import SkillDescriptor from "../Descriptor/SkillDescriptor";
import {handleNewLine} from "../Helper/OutputHelper";
import getRubyText from "../Helper/StringHelper";
import EffectBreakdown from "./EffectBreakdown";

interface IProps {
    region: Region;
    skill: Skill.Skill;
    cooldowns: boolean;
    levels?: number;
    rankUp?: number;
}

class SkillBreakdown extends React.Component<IProps> {
    render() {
        const skill = this.props.skill;
        const skillAdd = this.props.skill.skillAdd.length > 0
            ? (
                <Tooltip id="skillAdd-tooltip" style={{fontSize: "1em"}}>
                    {getRubyText(
                        this.props.region,
                        this.props.skill.skillAdd[0].name,
                        this.props.skill.skillAdd[0].ruby,
                        true
                    )}
                </Tooltip>
            )
            : null;

        return (
            <div>
                <h3>
                    <SkillDescriptor region={this.props.region} skill={skill} iconHeight={33}/>
                    {skillAdd !== null
                        ? (
                            <>{" "}<OverlayTrigger overlay={skillAdd}>
                                <FontAwesomeIcon icon={faInfoCircle} style={{fontSize: "0.75em"}} />
                            </OverlayTrigger></>
                        )
                        : null
                    }
                </h3>

                {this.props.rankUp !== undefined ? (
                    <Alert variant={"primary"}>
                        Rank Up +{this.props.rankUp}
                    </Alert>
                ) : undefined}

                {skill.condQuestId && skill.condQuestPhase ? (
                    <Alert variant={'primary'}>
                        Available after <QuestDescriptor region={this.props.region}
                                                         questId={skill.condQuestId}
                                                         questPhase={skill.condQuestPhase}/>
                    </Alert>
                ) : null}

                <p>{handleNewLine(skill.detail)}</p>

                <EffectBreakdown region={this.props.region}
                                 cooldowns={this.props.cooldowns ? skill.coolDown : undefined}
                                 funcs={this.props.skill.functions}
                                 triggerSkillIdStack={[this.props.skill.id]}
                                 levels={this.props.levels}
                                 scripts={this.props.skill.script}/>
            </div>
        );
    }
}

export default SkillBreakdown;
