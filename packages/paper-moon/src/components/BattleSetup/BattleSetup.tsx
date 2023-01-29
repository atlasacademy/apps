import React, { useCallback } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ConnectedProps, connect } from "react-redux";

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

const BattleSetup: React.FC<BattleSetupProps> = (props) => {
    const castTeam = useCallback((value: string) => {
        return +value as BattleTeam;
    }, []);

    if (!props.display) return null;

    return (
        <div>
            <br />
            <h3>Battle Setup</h3>
            <Form>
                <Row>
                    <Col>
                        <Form.Control
                            as="select"
                            value={props.selected}
                            onChange={(event) => props.selectServant(+event.target.value)}
                        >
                            <option disabled={true}>Select One</option>
                            {props.servants.map((servant) => (
                                <option key={servant.id} value={servant.id}>
                                    {servant.collectionNo}: {servant.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Col>
                    <Col>
                        <Form.Control
                            as="select"
                            value={props.team}
                            onChange={(event) => props.selectTeam(castTeam(event.target.value))}
                        >
                            <option value={BattleTeam.PLAYER}>Player</option>
                            <option value={BattleTeam.ENEMY}>Enemy</option>
                        </Form.Control>
                    </Col>
                    <Col>
                        <Button variant="success" onClick={props.add} disabled={props.pending || !props.canAddActor}>
                            Add Servant
                        </Button>
                        &nbsp;
                        <Button variant="primary" onClick={props.start} disabled={props.pending}>
                            Start Battle
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default connector(BattleSetup);
