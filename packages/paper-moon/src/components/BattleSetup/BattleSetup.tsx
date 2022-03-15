import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { connect, ConnectedProps } from "react-redux";

import { BattleTeam } from "@atlasacademy/battle";

import { battleStartThunk } from "../../app/battle/thunks";
import {
    battleSetupAddActorThunk,
    battleSetupSelectServantThunk,
    battleSetupSelectTeamThunk,
} from "../../app/battleSetup/thunks";
import { RootState } from "../../app/store";

const mapStateToProps = (state: RootState) => ({
        canAddActor: state.battleSetup.canAddActor,
        display: !state.battle.running,
        pending: state.battleSetup.pending,
        servants: state.battleSetup.servantList,
        selected: state.battleSetup.selectedServant,
        team: state.battleSetup.selectedTeam,
    }),
    mapDispatchToProps = {
        selectServant: battleSetupSelectServantThunk,
        selectTeam: battleSetupSelectTeamThunk,
        add: battleSetupAddActorThunk,
        start: battleStartThunk,
    },
    connector = connect(mapStateToProps, mapDispatchToProps);

type BattleSetupProps = ConnectedProps<typeof connector>;

class BattleSetup extends React.Component<BattleSetupProps> {
    private static castTeam(value: string): BattleTeam {
        return +value as BattleTeam;
    }

    render() {
        if (!this.props.display) return null;

        return (
            <div>
                <br />
                <h3>Battle Setup</h3>
                <Form>
                    <Row>
                        <Col>
                            <Form.Control
                                as="select"
                                value={this.props.selected}
                                onChange={(event) => this.props.selectServant(+event.target.value)}
                            >
                                <option disabled={true}>Select One</option>
                                {this.props.servants.map((servant) => (
                                    <option key={servant.id} value={servant.id}>
                                        {servant.collectionNo}: {servant.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Col>
                        <Col>
                            <Form.Control
                                as="select"
                                value={this.props.team}
                                onChange={(event) => this.props.selectTeam(BattleSetup.castTeam(event.target.value))}
                            >
                                <option value={BattleTeam.PLAYER}>Player</option>
                                <option value={BattleTeam.ENEMY}>Enemy</option>
                            </Form.Control>
                        </Col>
                        <Col>
                            <Button
                                variant="success"
                                onClick={this.props.add}
                                disabled={this.props.pending || !this.props.canAddActor}
                            >
                                Add Servant
                            </Button>
                            &nbsp;
                            <Button variant="primary" onClick={this.props.start} disabled={this.props.pending}>
                                Start Battle
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default connector(BattleSetup);
