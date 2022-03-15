import React from "react";
import { ProgressBar } from "react-bootstrap";
import { connect, ConnectedProps } from "react-redux";

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

class BattleActorDisplay extends React.Component<BattleActorDisplayProps> {
    private shouldDisplayAttacks() {
        return (
            this.props.running &&
            this.props.team === BattleTeam.PLAYER &&
            this.props.playerTurn &&
            this.props.playerAttacking
        );
    }

    private shouldDisplaySkills() {
        return (
            this.props.running &&
            this.props.team === BattleTeam.PLAYER &&
            this.props.playerTurn &&
            this.props.playerActing
        );
    }

    private displayGauge() {
        if (this.props.actor.team === BattleTeam.ENEMY) return null;

        const max = this.props.actor.gaugeLineMax,
            current = this.props.actor.currentGauge,
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
    }

    render() {
        return (
            <div className="battle-actor-display">
                <img className="battle-actor-face" src={this.props.actor.face} alt={this.props.actor.name} />
                <div className="battle-actor-name">
                    ({this.props.actor.id}) {this.props.actor.name}
                </div>
                <div className="battle-actor-health">
                    {this.props.actor.currentHealth} / {this.props.actor.maxHealth}
                </div>
                <ProgressBar variant="success" now={this.props.actor.currentHealth / this.props.actor.maxHealth} />
                {this.displayGauge()}
                {this.shouldDisplaySkills() ? <BattleActorSkillDisplay actor={this.props.actor} /> : null}
                {this.shouldDisplayAttacks() ? <BattleActorAttackDisplay actor={this.props.actor} /> : null}
            </div>
        );
    }
}

export default connector(BattleActorDisplay);
