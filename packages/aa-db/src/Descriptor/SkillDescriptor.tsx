import React from "react";
import {Link} from "react-router-dom";
import Region from "../Api/Data/Region";
import Skill from "../Api/Data/Skill";
import BuffIcon from "../Component/BuffIcon";

interface IProps {
    region: Region;
    skill: Skill;
    iconHeight?: number;
}

class SkillDescriptor extends React.Component<IProps> {
    render() {
        return (
            <Link to={`/${this.props.region}/skill/${this.props.skill.id}`}>
                <BuffIcon location={this.props.skill.icon} height={this.props.iconHeight}/>
                {' '}
                [{this.props.skill.name ? this.props.skill.name : `Skill: ${this.props.skill.id}`}]
            </Link>
        );
    }
}

export default SkillDescriptor;
