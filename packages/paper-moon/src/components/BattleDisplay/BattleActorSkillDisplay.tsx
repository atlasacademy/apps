import React from "react";
import {Col, Row} from "react-bootstrap";
import {connect, ConnectedProps} from "react-redux";
import {BattleStateActor} from "../../app/battle/types";
import {RootState} from "../../app/store";

import "./BattleActorSkillDisplay.css";

interface ExternalProps {
    actor: BattleStateActor,
}

const mapStateToProps = (state: RootState, props: ExternalProps) => ({
        ...props,
        skills: state.battle.actorSkills
            .filter(skill => skill.actorId === props.actor.id)
            .sort((a, b) => a.position - b.position),
    }),
    mapDispatchToProps = {
        //
    },
    connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

class BattleActorSkillDisplay extends React.Component<Props> {
    render() {
        return (
            <Row className='battle-actor-skill-display'>
                {this.props.skills.map((skill, i) => (
                    <Col xs={4} key={i}>
                        <img className='skill-icon' src={skill.icon} alt={skill.name}/>
                    </Col>
                ))}
            </Row>
        );
    }
}

export default connector(BattleActorSkillDisplay);
