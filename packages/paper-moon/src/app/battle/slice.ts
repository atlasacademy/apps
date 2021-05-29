import {BattleActor} from "@atlasacademy/battle/dist/Actor/BattleActor";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BattleState} from "./types";

const initialState: BattleState = {
    running: false,
    playerActors: [],
    enemyActors: [],
};

export const battleSlice = createSlice({
    name: 'battle',
    initialState,
    reducers: {
        addPlayerActor: (state, action: PayloadAction<BattleActor>) => {
            state.playerActors.push({
                id: action.payload.props.id
            });
        },
        addEnemyActor: (state, action: PayloadAction<BattleActor>) => {
            state.enemyActors.push({
                id: action.payload.props.id
            });
        },
        startBattle: state => {
            state.running = true;
        }
    }
})
