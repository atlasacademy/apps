import React, { useCallback } from "react";
import { ProgressBar } from "react-bootstrap";
import { ConnectedProps, connect } from "react-redux";

import { BattleTeam } from "@atlasacademy/battle";

import { BattleStateActor } from "../../app/battle/types";
import { RootState } from "../../app/store";
import BattleActorAttackDisplay from "./BattleActorAttackDisplay";
import BattleActorSkillDisplay from "./Skill/BattleActorSkillDisplay";

import "./BattleActorDisplay.css";

interface ExternalProps {
    actor: BattleStateActor;
    team: BattleTeam;
}

const mapStateToProps = (state: RootState, props: ExternalProps) => ({
        ...props,
        running: state.battle.running,
        playerTurn: state.battle.playerTurn,
        playerActing: state.battle.playerActing,
        playerAttacking: state.battle.playerAttacking,
    }),
    mapDispatchToProps = {
        //
    },
    connector = connect(mapStateToProps, mapDispatchToProps);

type BattleActorDisplayProps = ConnectedProps<typeof connector>;

const BattleActorDisplay: React.FC<BattleActorDisplayProps> = (props) => {
    const shouldDisplayAttacks = useCallback(() => {
        return props.running && props.team === BattleTeam.PLAYER && props.playerTurn && props.playerAttacking;
    }, [props]);

    const shouldDisplaySkills = useCallback(() => {
        return props.running && props.team === BattleTeam.PLAYER && props.playerTurn && props.playerActing;
    }, [props]);

    const displayGauge = useCallback(() => {
        if (props.actor.team === BattleTeam.ENEMY) return null;
        const max = props.actor.gaugeLineMax,
            current = props.actor.currentGauge,
            level = Math.min(Math.floor(current / max), 2),
            mod = current % max,
            styles = ["info", "warning", "danger"],
            percent = Math.floor((mod / max) * 1000) / 10,
            remaining = 100 - percent;

        return (
            <div>
                <div className="battle-actor-gauge">{percent}%</div>
                <ProgressBar now={percent}>
                    <ProgressBar variant={styles[level]} now={percent} />
                    {remaining > 0 && level > 0 ? <ProgressBar variant={styles[level - 1]} now={remaining} /> : null}
                </ProgressBar>
            </div>
        );
    }, []);

    return (
        <div className="battle-actor-display">
            <img className="battle-actor-face" src={props.actor.face} alt={props.actor.name} />
            <div className="battle-actor-name">
                ({props.actor.id}) {props.actor.name}
            </div>
            <div className="battle-actor-health">
                {props.actor.currentHealth} / {props.actor.maxHealth}
            </div>
            <ProgressBar variant="success" now={props.actor.currentHealth / props.actor.maxHealth} />
            {displayGauge()}
            {shouldDisplaySkills() ? <BattleActorSkillDisplay actor={props.actor} /> : null}
            {shouldDisplayAttacks() ? <BattleActorAttackDisplay actor={props.actor} /> : null}
        </div>
    );
};

export default connector(BattleActorDisplay);
