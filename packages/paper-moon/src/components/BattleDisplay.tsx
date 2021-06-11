import {BattleTeam} from "@atlasacademy/battle";
import React from "react";
import {Col, Row} from "react-bootstrap";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../app/store";
import BattleActorDisplay from "./BattleDisplay/BattleActorDisplay";
import BattleEventDisplay from "./BattleDisplay/BattleEventDisplay";

const mapStateToProps = (state: RootState) => ({
        enemyActors: state.battle.enemyActors,
        playerActors: state.battle.playerActors,
        events: state.battle.events,
    }),
    mapDispatchToProps = {
        //
    },
    connector = connect(mapStateToProps, mapDispatchToProps);

type BattleDisplayProps = ConnectedProps<typeof connector>;

class BattleDisplay extends React.Component<BattleDisplayProps> {

    render() {
        return (
            <div>
                <h3>Battle Status</h3>
                <hr/>

                <h5>Enemies</h5>
                <Row>
                    {this.props.enemyActors.map(actor => (
                        <Col key={actor.id} xs={4}>
                            <BattleActorDisplay actor={actor} team={BattleTeam.ENEMY}/>
                        </Col>
                    ))}
                </Row>
                <hr/>

                <h5>Players</h5>
                <Row>
                    {this.props.playerActors.map(actor => (
                        <Col key={actor.id} xs={4}>
                            <BattleActorDisplay actor={actor} team={BattleTeam.PLAYER}/>
                        </Col>
                    ))}
                </Row>
                <hr/>

                <h5>Events</h5>
                {this.props.events.map((event, i) => (
                    <BattleEventDisplay key={i} event={event}/>
                ))}
            </div>
        );
    }

}

export default connector(BattleDisplay);
