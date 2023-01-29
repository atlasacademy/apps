import React from "react";
import { Col, Row } from "react-bootstrap";
import { ConnectedProps, connect } from "react-redux";

import { battleTriggerSkillThunk } from "../../../app/battle/thunks";
import { BattleStateActor } from "../../../app/battle/types";
import { RootState } from "../../../app/store";
import BattleActorSkillIcon from "./BattleActorSkillIcon";

import "./BattleActorSkillDisplay.css";

interface ExternalProps {
    actor: BattleStateActor;
}

const mapStateToProps = (state: RootState, props: ExternalProps) => ({
        ...props,
        skills: state.battle.actorSkills
            .filter((skill) => skill.actorId === props.actor.id)
            .sort((a, b) => a.position - b.position),
    }),
    mapDispatchToProps = {
        battleTriggerSkillThunk,
    },
    connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

const BattleActorSkillDisplay: React.FC<Props> = (props) => {
    return (
        <Row className="battle-actor-skill-display">
            {props.skills.map((skill, i) => (
                <Col xs={4} key={i}>
                    <BattleActorSkillIcon actor={props.actor} skill={skill} />
                </Col>
            ))}
        </Row>
    );
};
export default connector(BattleActorSkillDisplay);
