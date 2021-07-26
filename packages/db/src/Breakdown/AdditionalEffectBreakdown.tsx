import {Region, Skill} from "@atlasacademy/api-connector";
import React from "react";
import Api from "../Api";
import EffectBreakdownLines from "./EffectBreakdownLines";

interface IProps {
    region: Region;
    skillId: number;
    triggerSkillIdStack: number[];
    level?: number;
    levels?: number[];
    popOver?: boolean;
}

interface IState {
    skill?: Skill.Skill;
}

class AdditionalEffectBreakdown extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    async componentDidMount() {
        try {
            this.setState({
                skill: await Api.skill(this.props.skillId)
            });
        } catch (e) {
            // do nothing on failure
        }
    }

    render() {
        if (this.state.skill === undefined) {
            return null;
        }

        return (
            <EffectBreakdownLines region={this.props.region}
                                  funcs={this.state.skill.functions}
                                  triggerSkillIdStack={this.props.triggerSkillIdStack}
                                  level={this.props.level}
                                  levels={this.props.levels}
                                  relatedSkillId={this.state.skill.id}
                                  popOver={this.props.popOver}/>
        );
    }
}

export default AdditionalEffectBreakdown;
