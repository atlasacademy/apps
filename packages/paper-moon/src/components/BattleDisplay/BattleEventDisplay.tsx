import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {BattleEvent} from "../../app/battle/types";
import {RootState} from "../../app/store";
import BattleManager from "../../paper-moon/BattleManager";

interface ExternalProps {
    event: BattleEvent,
}

const mapStateToProps = (state: RootState, props: ExternalProps) => ({
        ...props,
        actor: BattleManager.battle().getActor(props.event.actorId),
        target: BattleManager.battle().getActor(props.event.targetId),
    }),
    mapDispatchToProps = {
        //
    },
    connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

class BattleEventDisplay extends React.Component<Props> {

    render() {
        return (
            <div>
                ({this.props.event.actorId}){this.props.actor?.name()}
                {this.props.event.np
                    ? ' deals NP damage to '
                    : ` attacks with ${this.props.event.card} Card(${this.props.event.num}) against `}
                ({this.props.event.targetId}){this.props.target?.name()}
                <ul>
                    <li>damage: {this.props.event.damage}</li>
                    {this.props.event.stars > 0
                        ? <li>stars: {this.props.event.stars}</li>
                        : null}
                    {this.props.event.npGainedOnAttack > 0
                        ? <li>NP Gained: {this.props.event.npGainedOnAttack}</li>
                        : null}
                    {this.props.event.npGainedOnDefence > 0
                        ? <li>NP Gained: {this.props.event.npGainedOnDefence}</li>
                        : null}
                </ul>
            </div>
        );
    }

}

export default connector(BattleEventDisplay);
