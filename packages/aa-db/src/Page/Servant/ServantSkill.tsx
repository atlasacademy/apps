import React from "react";
import {Alert} from "react-bootstrap";
import Region from "../../Api/Data/Region";
import Skill from "../../Api/Data/Skill";
import QuestDescriptor from "../../Descriptor/QuestDescriptor";
import SkillDescriptor from "../../Descriptor/SkillDescriptor";
import {handleNewLine} from "../../Helper/OutputHelper";
import ServantEffectBreakdown from "./ServantEffectBreakdown";

interface IProps {
    region: Region;
    skill: Skill;
}

class ServantSkill extends React.Component<IProps, any> {
    render() {
        const skill = this.props.skill;
        return (
            <div>
                <h3>
                    <SkillDescriptor region={this.props.region} skill={skill} iconHeight={33}/>
                </h3>

                {skill.condQuestId && skill.condQuestPhase ? (
                    <Alert variant={'primary'}>
                        Available after <QuestDescriptor region={this.props.region}
                                                         questId={skill.condQuestId}
                                                         questPhase={skill.condQuestPhase}/>
                    </Alert>
                ) : null}

                <p>{handleNewLine(skill.detail)}</p>

                <ServantEffectBreakdown region={this.props.region}
                                        cooldowns={skill.coolDown}
                                        funcs={this.props.skill.functions}
                                        levels={10}/>
            </div>
        );
    }
}

export default ServantSkill;
