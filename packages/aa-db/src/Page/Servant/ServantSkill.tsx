import React from "react";
import Skill from "../../Api/Data/Skill";

interface IProps {
    skill: Skill;
}

class ServantSkill extends React.Component<IProps, any>{
    render() {
        return (
            <div>
                Skill: {this.props.skill.name}
            </div>
        );
    }
}

export default ServantSkill;
