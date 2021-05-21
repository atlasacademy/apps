import {FuncTargetType} from "@atlasacademy/api-connector/dist/Schema/Func";
import {Trait} from "@atlasacademy/api-connector/dist/Schema/Trait";
import {BattleActor} from "./Actor/BattleActor";
import BattleActorManager from "./Actor/BattleActorManager";
import {BattleRandom, BattleRandomType} from "./BattleRandom";
import {BattleTeam} from "./Enum/BattleTeam";
import BattleEvent from "./Event/BattleEvent";

export interface BattleState {
    actors: BattleActorManager,
    control: BattleTeam,
    events: BattleEvent[],
    random: BattleRandom,
    selectExtra: number,
    traits: Trait[],
    turn: number,
}

export class Battle {
    public state: BattleState;

    constructor(state: BattleState | null) {
        this.state = state ?? {
            actors: new BattleActorManager(null),
            control: BattleTeam.PLAYER,
            events: [],
            random: new BattleRandom(BattleRandomType.AVERAGE),
            selectExtra: 1,
            traits: [],
            turn: 1,
        };
    }

    clone(): Battle {
        const battle = new Battle({
            ...this.state,
            actors: this.state.actors.clone(),
            random: this.state.random.clone(),
        });

        this.state.actors.setBattle(battle);

        return battle;
    }

    addActor(actor: BattleActor) {
        this.state.actors.add(actor);
        actor.setBattle(this);
    }

    addEvent(event: BattleEvent) {
        this.state.events.push(event);
    }

    clearEvents() {
        this.state.events = [];
    }

    getActor(id: number): BattleActor | undefined {
        return this.state.actors.actorById(id);
    }

    getTargets(actor: BattleActor, targetType: FuncTargetType): BattleActor[] {
        return this.state.actors.getTargets(actor, targetType);
    }

    phase(): number {
        return this.state.actors.phase();
    }

    random(min: number, max: number): number {
        return this.state.random.generate(min, max);
    }

}
