import React, { useCallback } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { ConnectedProps, connect } from "react-redux";

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

const BattleActorAttackDisplay: React.FC<Props> = (props) => {
    const queueAction = useCallback(
        (card: Card) => {
            props.queueAction(props.actor.id, card);
        },
        [props]
    );

    return (
        <div>
            <ButtonGroup className="battle-actor-action-display">
                <Button className="action" variant="danger" onClick={(e) => queueAction(Card.BUSTER)}>
                    B
                </Button>
                <Button className="action" variant="success" onClick={(e) => queueAction(Card.QUICK)}>
                    Q
                </Button>
                <Button className="action" variant="primary" onClick={(e) => queueAction(Card.ARTS)}>
                    A
                </Button>
                <Button className="action" variant="secondary">
                    NP
                </Button>
            </ButtonGroup>
        </div>
    );
};

export default connector(BattleActorAttackDisplay);
