import React from "react";
import { connect, ConnectedProps } from "react-redux";

import { battleTriggerSkillThunk } from "../../../app/battle/thunks";
import { BattleStateActor, BattleStateActorSkill } from "../../../app/battle/types";
import { RootState } from "../../../app/store";

import "./BattleActorSkillIcon.css";

interface ExternalProps {
    actor: BattleStateActor;
    skill: BattleStateActorSkill;
}

const mapStateToProps = (state: RootState, props: ExternalProps) => ({
        ...props,
    }),
    mapDispatchToProps = {
        battleTriggerSkillThunk,
    },
    connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

class BattleActorSkillIcon extends React.Component<Props> {
    private className(): string {
        const classes = ["battle-actor-skill-icon"];

        if (!this.props.skill.available) classes.push("inactive");

        return classes.join(" ");
    }

    render() {
        return (
            <div className={this.className()}>
                <img
                    className="icon"
                    src={this.props.skill.icon}
                    alt={this.props.skill.name}
                    onClick={() => this.props.battleTriggerSkillThunk(this.props.actor.id, this.props.skill.position)}
                />
                {this.props.skill.cooldown > 0 ? (
                    <span className="cooldown text-primary">{this.props.skill.cooldown}</span>
                ) : null}
            </div>
        );
    }
}

export default connector(BattleActorSkillIcon);
