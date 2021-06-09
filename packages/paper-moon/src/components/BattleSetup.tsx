import {BattleTeam} from "@atlasacademy/battle/dist/Enum/BattleTeam";
import React from "react";
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

    private static extractTeam(event: React.ChangeEvent<HTMLSelectElement>): BattleTeam {
        const value: number = +event.target.value;

        return value as BattleTeam;
    }

    render() {
        if (!this.props.display)
            return null;

        return (
            <div>
                <select value={this.props.selected}
                        onChange={event => this.props.selectServant(+event.target.value)}>
                    <option disabled={true}>Select One</option>
                    {this.props.servants.map(servant => (
                        <option key={servant.id} value={servant.id}>
                            {servant.collectionNo}: {servant.name}
                        </option>
                    ))}
                </select>
                <select value={this.props.team}
                        onChange={event => this.props.selectTeam(BattleSetup.extractTeam(event))}>
                    <option value={BattleTeam.PLAYER}>Player</option>
                    <option value={BattleTeam.ENEMY}>Enemy</option>
                </select>
                <button onClick={this.props.add}>
                    Add
                </button>
                <button onClick={this.props.start}>
                    Start
                </button>
            </div>
        );
    }

}

export default connector(BattleSetup);
