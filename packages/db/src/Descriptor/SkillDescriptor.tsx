import React from "react";
import { Link } from "react-router-dom";

import { Region, Skill } from "@atlasacademy/api-connector";

import BuffIcon from "../Component/BuffIcon";
import getRubyText from "../Helper/StringHelper";
import useApi from "../Hooks/useApi";
import { lang } from "../Setting/Manager";

import "./Descriptor.css";

interface IProps {
    region: Region;
    skill: Skill.SkillBasic;
    iconHeight?: number;
    whiteSpace?: "normal" | "nowrap";
}

class SkillDescriptor extends React.Component<IProps> {
    static renderAsString(skill: Skill.SkillBasic): string {
        const name = skill.name ? skill.name : `Skill: ${skill.id}`;

        return `[${name}]`;
    }

    render() {
        const textWhiteSpace = this.props.whiteSpace ? this.props.whiteSpace : "normal";
        return (
            <Link to={`/${this.props.region}/skill/${this.props.skill.id}`} className="descriptor-link">
                {this.props.skill.icon ? (
                    <BuffIcon location={this.props.skill.icon} height={this.props.iconHeight} />
                ) : undefined}
                {this.props.skill.icon ? " " : undefined}
                <span className="hover-text" style={{ whiteSpace: textWhiteSpace }} lang={lang(this.props.region)}>
                    [
                    {this.props.skill.name
                        ? getRubyText(this.props.region, this.props.skill.name, this.props.skill.ruby, true)
                        : `Skill: ${this.props.skill.id}`}
                    ]
                </span>
            </Link>
        );
    }
}

export default SkillDescriptor;

export const SkillDescriptorId = (props: {
    region: Region;
    skillId: number;
    iconHeight?: number;
    whiteSpace?: "normal" | "nowrap";
}) => {
    const { data: skill } = useApi("skillBasic", props.skillId);
    if (skill !== undefined) {
        return (
            <SkillDescriptor
                region={props.region}
                skill={skill}
                iconHeight={props.iconHeight}
                whiteSpace={props.whiteSpace}
            />
        );
    } else {
        return null;
    }
};
