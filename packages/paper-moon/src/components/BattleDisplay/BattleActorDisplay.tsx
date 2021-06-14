import {BattleTeam} from "@atlasacademy/battle";
import React from "react";
import {Button, Col, ProgressBar, Row} from "react-bootstrap";
import {connect, ConnectedProps} from "react-redux";
import {BattleStateActor} from "../../app/battle/types";
import {RootState} from "../../app/store";
import BattleActorActionDisplay from "./BattleActorActionDisplay";

import './BattleActorDisplay.css';

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

    private displayGauge() {
        if (this.props.actor.team === BattleTeam.ENEMY)
            return null;

        const max = this.props.actor.gaugeLineMax,
            current = this.props.actor.currentGauge,
            level = Math.min(Math.floor(current / max), 2),
            mod = current % max,
            remaining = level > 0 ? max - mod : 0,
            styles = [
                'info',
                'warning',
                'danger',
            ];

        return <div>
            <div className='battle-actor-gauge'>{this.props.actor.currentGauge}%</div>
            <ProgressBar now={this.props.actor.currentGauge / 1000}>
                <ProgressBar variant={styles[level]} now={mod / max}/>
                {remaining > 0 && level > 0 ? (
                    <ProgressBar variant={styles[level - 1]} now={remaining / max}/>
                ) : null}
            </ProgressBar>
        </div>
    }

    render() {
        return (
            <div className='battle-actor-display'>
                <Row>
                    <Col xs={3}>
                        <img className='battle-actor-face' src={this.props.actor.face} alt={this.props.actor.name}/>
                        <div className='text-center'>
                            <Button variant='outline-secondary'>Buffs</Button>
                        </div>
                    </Col>
                    <Col>
                        <div className='battle-actor-name'>({this.props.actor.id}) {this.props.actor.name}</div>
                        <div
                            className='battle-actor-health'>{this.props.actor.currentHealth} / {this.props.actor.maxHealth}</div>
                        <ProgressBar variant='success'
                                     now={this.props.actor.currentHealth / this.props.actor.maxHealth}/>
                        {this.displayGauge()}
                    </Col>
                </Row>
                {this.shouldDisplayActions() ? (
                    <BattleActorActionDisplay actor={this.props.actor}/>
                ) : null}
            </div>
        );
    }

}

export default connector(BattleActorDisplay);
