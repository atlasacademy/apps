import React from "react";
import Connection from "../Api/Connection";
import Region from "../Api/Data/Region";
import Skill from "../Api/Data/Skill";
import EffectBreakdownLines from "./EffectBreakdownLines";

interface IProps {
    region: Region;
    levels?: number;
    skillId: number;
}

interface IState {
    skill?: Skill;
}

class AdditionalEffectBreakdown extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    async componentDidMount() {
        try {
            this.setState({
                skill: await Connection.skill(this.props.region, this.props.skillId)
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
                                  levels={this.props.levels}
                                  relatedSkillId={this.state.skill.id}/>
        );
    }
}

export default AdditionalEffectBreakdown;
