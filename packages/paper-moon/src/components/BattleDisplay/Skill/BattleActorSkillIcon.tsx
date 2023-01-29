import React, { useCallback } from "react";
import { ConnectedProps, connect } from "react-redux";

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

const BattleActorSkillIcon: React.FC<Props> = (props) => {
    const className = useCallback(() => {
        const classes = ["battle-actor-skill-icon"];
        if (!props.skill.available) classes.push("inactive");
        return classes.join(" ");
    }, [props]);

    return (
        <div className={className()}>
            <img
                className="icon"
                src={props.skill.icon}
                alt={props.skill.name}
                onClick={() => props.battleTriggerSkillThunk(props.actor.id, props.skill.position)}
            />
            {props.skill.cooldown > 0 ? <span className="cooldown text-primary">{props.skill.cooldown}</span> : null}
        </div>
    );
};

export default connector(BattleActorSkillIcon);
