import {BattleTeam} from "@atlasacademy/battle";
import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {BattleStateActor} from "../../app/battle/types";
import {RootState} from "../../app/store";
import BattleActorActionDisplay from "./BattleActorActionDisplay";

interface ExternalProps {
    actor: BattleStateActor,
    team: BattleTeam,
}

const mapStateToProps = (state: RootState, props: ExternalProps) => ({
        ...props,
        running: state.battle.running,
        playerTurn: state.battle.playerTurn,
        queuedAttackCount: state.battle.queuedAttacks.length,
    }),
    mapDispatchToProps = {
        //
    },
    connector = connect(mapStateToProps, mapDispatchToProps);

type BattleActorDisplayProps = ConnectedProps<typeof connector>;

class BattleActorDisplay extends React.Component<BattleActorDisplayProps> {

    private shouldDisplayActions() {
        return this.props.running
            && this.props.team === BattleTeam.PLAYER
            && this.props.playerTurn
            && this.props.queuedAttackCount < 3;
    }

    render() {
        return (
            <div>
                <img src={this.props.actor.face} alt={this.props.actor.name}/>
                <br/>
                {this.props.actor.name}<br/>
                {this.props.actor.currentHealth} / {this.props.actor.maxHealth}<br/>
                {this.shouldDisplayActions() ? (
                    <BattleActorActionDisplay actor={this.props.actor}/>
                ) : null}
            </div>
        );
    }

}

export default connector(BattleActorDisplay);
