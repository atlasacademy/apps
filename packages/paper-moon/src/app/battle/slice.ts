import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { BattleEvent, BattleQueuedAttack, BattleState, BattleStateActor, BattleStateActorSkill } from "./types";

const initialState: BattleState = {
    running: false,
    actorSkills: [],
    playerActing: true,
    playerAttacking: false,
    playerTurn: true,
    playerActors: [],
    enemyActors: [],
    queuedAttacks: [],
    events: [],
};

export const battleSlice = createSlice({
    name: "battle",
    initialState,
    reducers: {
        queueAction: (state, action: PayloadAction<BattleQueuedAttack>) => {
            state.queuedAttacks.push(action.payload);
        },
        setActorSkills: (state, action: PayloadAction<BattleStateActorSkill[]>) => {
            state.actorSkills = action.payload;
        },
        setEvents: (state, action: PayloadAction<BattleEvent[]>) => {
            state.events = action.payload;
        },
        setEnemyActors: (state, action: PayloadAction<BattleStateActor[]>) => {
            state.enemyActors = action.payload;
        },
        setPlayerActors: (state, action: PayloadAction<BattleStateActor[]>) => {
            state.playerActors = action.payload;
        },
        startBattle: (state) => {
            state.running = true;
        },
        startPlayerAttacking: (state) => {
            state.playerActing = false;
            state.playerAttacking = true;
            state.playerTurn = true;
        },
        startPlayerTurn: (state) => {
            state.playerActing = true;
            state.playerAttacking = false;
            state.playerTurn = true;
        },
        stopPlayerAction: (state) => {
            state.playerActing = false;
            state.playerAttacking = false;
        },
    },
});
