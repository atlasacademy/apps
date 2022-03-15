import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { connect, ConnectedProps } from "react-redux";

import { Card } from "@atlasacademy/api-connector";

import { battleQueueAttack } from "../../app/battle/thunks";
import { BattleStateActor } from "../../app/battle/types";
import { RootState } from "../../app/store";

import "./BattleActorAttackDisplay.css";

interface ExternalProps {
    actor: BattleStateActor;
}

const mapStateToProps = (state: RootState, props: ExternalProps) => ({
        ...props,
    }),
    mapDispatchToProps = {
        queueAction: battleQueueAttack,
    },
    connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

class BattleActorAttackDisplay extends React.Component<Props> {
    private queueAction(card: Card) {
        this.props.queueAction(this.props.actor.id, card);
    }

    render() {
        return (
            <div>
                <ButtonGroup className="battle-actor-action-display">
                    <Button className="action" variant="danger" onClick={(e) => this.queueAction(Card.BUSTER)}>
                        B
                    </Button>
                    <Button className="action" variant="success" onClick={(e) => this.queueAction(Card.QUICK)}>
                        Q
                    </Button>
                    <Button className="action" variant="primary" onClick={(e) => this.queueAction(Card.ARTS)}>
                        A
                    </Button>
                    <Button className="action" variant="secondary">
                        NP
                    </Button>
                </ButtonGroup>
            </div>
        );
    }
}

export default connector(BattleActorAttackDisplay);
