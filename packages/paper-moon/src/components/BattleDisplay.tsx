import {BattleTeam} from "@atlasacademy/battle";
import React from "react";
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
                <h4>Enemies</h4>
                {this.props.enemyActors.map(actor => (
                    <BattleActorDisplay key={actor.id}
                                        actor={actor}
                                        team={BattleTeam.ENEMY}/>
                ))}
                <h5>Players</h5>
                {this.props.playerActors.map(actor => (
                    <BattleActorDisplay key={actor.id}
                                        actor={actor}
                                        team={BattleTeam.PLAYER}/>
                ))}
                <h5>Events</h5>
                {this.props.events.map((event, i) => (
                    <BattleEventDisplay key={i}
                                        event={event}/>
                ))}
            </div>
        );
    }

}

export default connector(BattleDisplay);
