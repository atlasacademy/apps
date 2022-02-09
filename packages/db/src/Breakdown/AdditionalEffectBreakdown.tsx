import Api from "../Api";
import EffectBreakdownLines from "./EffectBreakdownLines";
import { NoblePhantasm, Region, Skill } from "@atlasacademy/api-connector";
import React from "react";

interface IProps {
    region: Region;
    id: number;
    triggerSkillIdStack: number[];
    isNp?: boolean;
    level?: number;
    levels?: number[];
    popOver?: boolean;
}

interface IState {
    skill?: Skill.Skill;
    noblePhantasm?: NoblePhantasm.NoblePhantasm;
}

class AdditionalEffectBreakdown extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    async componentDidMount() {
        if (this.props.isNp) {
            Api.noblePhantasm(this.props.id).then((np) =>
                this.setState({ noblePhantasm: np })
            );
        } else {
            Api.skill(this.props.id).then((skill) => this.setState({ skill }));
        }
    }

    render() {
        if (this.props.isNp && this.state.noblePhantasm !== undefined) {
            return (
                <EffectBreakdownLines
                    region={this.props.region}
                    funcs={this.state.noblePhantasm.functions}
                    triggerSkillIdStack={this.props.triggerSkillIdStack}
                    level={this.props.level}
                    levels={this.props.levels}
                    relatedNpId={this.state.noblePhantasm.id}
                    popOver={this.props.popOver}
                />
            );
        }

        if (this.state.skill !== undefined) {
            return (
                <EffectBreakdownLines
                    region={this.props.region}
                    funcs={this.state.skill.functions}
                    triggerSkillIdStack={this.props.triggerSkillIdStack}
                    level={this.props.level}
                    levels={this.props.levels}
                    relatedSkillId={this.state.skill.id}
                    popOver={this.props.popOver}
                />
            );
        }

        return null;
    }
}

export default AdditionalEffectBreakdown;
