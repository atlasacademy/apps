import React from "react";
import { Link } from "react-router-dom";

import { Region, Skill } from "@atlasacademy/api-connector";

import Api from "../Api";
import SkillDescriptor from "./SkillDescriptor";

interface IProps {
    region: Region;
    id: number;
}

interface IState {
    skill?: Skill.Skill;
}

class SkillReferenceDescriptor extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    async componentDidMount() {
        Api.skill(this.props.id).then((skill) => this.setState({ skill }));
    }

    static renderAsString(id: number): string {
        return `[Skill: ${id}]`;
    }

    render() {
        const route = `/${this.props.region}/skill/${this.props.id}`;

        if (this.state.skill === undefined) {
            return <Link to={route}>[Skill: {this.props.id}]</Link>;
        }

        return <SkillDescriptor region={this.props.region} skill={this.state.skill} />;
    }
}

export default SkillReferenceDescriptor;
