import {Region, Skill} from "@atlasacademy/api-connector";
import React from "react";
import {Link} from "react-router-dom";
import BuffIcon from "../Component/BuffIcon";
import './Descriptor.css';
import getRubyText from "../Helper/StringHelper";

interface IProps {
    region: Region;
    skill: Skill.SkillBasic;
    iconHeight?: number;
}

class SkillDescriptor extends React.Component<IProps> {
    static renderAsString(skill: Skill.SkillBasic): string {
        const name = skill.name ? skill.name : `Skill: ${skill.id}`;

        return `[${name}]`;
    }

    render() {
        return (
            <Link
                to={`/${this.props.region}/skill/${this.props.skill.id}`}
                style={{textDecoration: "none", whiteSpace: "nowrap"}}
            >
                {this.props.skill.icon ? (
                    <BuffIcon location={this.props.skill.icon} height={this.props.iconHeight}/>
                ) : undefined}
                {this.props.skill.icon ? ' ' : undefined}
                <span className="hoverText" style={{whiteSpace: "normal"}}>
                    [{this.props.skill.name
                    ? getRubyText(this.props.region, this.props.skill.name, this.props.skill.ruby, true)
                    : `Skill: ${this.props.skill.id}`}]
                </span>
            </Link>
        );
    }
}

export default SkillDescriptor;
