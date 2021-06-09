import {Card} from "@atlasacademy/api-connector";
import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {battleQueueAttack} from "../../app/battle/thunks";
import {BattleStateActor} from "../../app/battle/types";
import {RootState} from "../../app/store";

interface ExternalProps {
    actor: BattleStateActor,
}

const mapStateToProps = (state: RootState, props: ExternalProps) => ({
        ...props,
    }),
    mapDispatchToProps = {
        queueAction: battleQueueAttack,
    },
    connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

class BattleActorActionDisplay extends React.Component<Props> {

    private queueAction(card: Card) {
        this.props.queueAction(this.props.actor.id, card);
    }

    render() {
        return (
            <ul>
                <li>
                    <button onClick={e => this.queueAction(Card.BUSTER)}>Buster</button>
                </li>
                <li>
                    <button onClick={e => this.queueAction(Card.QUICK)}>Quick</button>
                </li>
                <li>
                    <button onClick={e => this.queueAction(Card.ARTS)}>Arts</button>
                </li>
                <li>
                    <button onClick={e => this.queueAction(Card.EXTRA)}>Extra</button>
                </li>
            </ul>
        );
    }

}

export default connector(BattleActorActionDisplay);
