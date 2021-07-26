import {Region, Skill} from "@atlasacademy/api-connector";
import React from "react";
import {Alert} from "react-bootstrap";
import QuestDescriptor from "../Descriptor/QuestDescriptor";
import SkillDescriptor from "../Descriptor/SkillDescriptor";
import {handleNewLine} from "../Helper/OutputHelper";
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
        return (
            <div>
                <h3>
                    <SkillDescriptor region={this.props.region} skill={skill} iconHeight={33}/>
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
