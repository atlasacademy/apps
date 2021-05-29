import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BattleState, BattleStateActor} from "./types";

const initialState: BattleState = {
    running: false,
    playerActors: [],
    enemyActors: [],
};

export const battleSlice = createSlice({
    name: 'battle',
    initialState,
    reducers: {
        setEnemyActors: (state, action: PayloadAction<BattleStateActor[]>) => {
            state.enemyActors = action.payload;
        },
        setPlayerActors: (state, action: PayloadAction<BattleStateActor[]>) => {
            state.playerActors = action.payload;
        },
        startBattle: state => {
            state.running = true;
        }
    }
})
