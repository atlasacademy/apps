import {BattleTeam} from "@atlasacademy/battle/dist/Enum/BattleTeam";
import React from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import {connect, ConnectedProps} from "react-redux";
import {battleStartThunk} from "../app/battle/thunks";
import {battleSetupSlice} from "../app/battleSetup/slice";
import {battleSetupAddActorThunk, battleSetupSelectServantThunk} from "../app/battleSetup/thunks";
import {RootState} from "../app/store";

const mapStateToProps = (state: RootState) => ({
        display: !state.battle.running,
        servants: state.battleSetup.servantList,
        selected: state.battleSetup.selectedServant,
        team: state.battleSetup.selectedTeam,
    }),
    mapDispatchToProps = {
        selectServant: battleSetupSelectServantThunk,
        selectTeam: battleSetupSlice.actions.selectTeam,
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
        if (!this.props.display)
            return null;

        return (
            <div>
                <br/>
                <h3>Battle Setup</h3>
                <Form>
                    <Row>
                        <Col>
                            <Form.Control as='select' value={this.props.selected}
                                          onChange={event => this.props.selectServant(+event.target.value)}>
                                <option disabled={true}>Select One</option>
                                {this.props.servants.map(servant => (
                                    <option key={servant.id} value={servant.id}>
                                        {servant.collectionNo}: {servant.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Col>
                        <Col>
                            <Form.Control as='select' value={this.props.team}
                                          onChange={event => this.props.selectTeam(BattleSetup.castTeam(event.target.value))}>
                                <option value={BattleTeam.PLAYER}>Player</option>
                                <option value={BattleTeam.ENEMY}>Enemy</option>
                            </Form.Control>
                        </Col>
                        <Col>
                            <Button variant='success' onClick={this.props.add}>
                                Add Servant
                            </Button>
                            &nbsp;
                            <Button variant='primary' onClick={this.props.start}>
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
