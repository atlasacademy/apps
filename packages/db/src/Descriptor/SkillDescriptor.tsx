import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Region, Skill } from "@atlasacademy/api-connector";

import Api from "../Api";
import BuffIcon from "../Component/BuffIcon";
import getRubyText from "../Helper/StringHelper";

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
                <span className="hover-text" style={{ whiteSpace: textWhiteSpace }}>
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
    const [skill, setSkill] = useState<Skill.SkillBasic>(null as any);
    useEffect(() => {
        Api.skillBasic(props.skillId).then((s) => setSkill(s));
    }, [props.skillId]);
    if (skill !== null) {
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
