import React from "react";
import { Col, Row } from "react-bootstrap";
import { connect, ConnectedProps } from "react-redux";

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

class BattleActorSkillDisplay extends React.Component<Props> {
    render() {
        return (
            <Row className="battle-actor-skill-display">
                {this.props.skills.map((skill, i) => (
                    <Col xs={4} key={i}>
                        <BattleActorSkillIcon actor={this.props.actor} skill={skill} />
                    </Col>
                ))}
            </Row>
        );
    }
}

export default connector(BattleActorSkillDisplay);
