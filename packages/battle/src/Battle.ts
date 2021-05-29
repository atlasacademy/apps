import {Func, Trait} from "@atlasacademy/api-connector";
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
    stars: number,
    traits: Trait.Trait[],
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
            stars: 0,
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

    actors(): BattleActorManager {
        return this.state.actors;
    }

    addActor(actor: BattleActor) {
        this.state.actors.add(actor);
        actor.setBattle(this);
    }

    addEvent(event: BattleEvent) {
        this.state.events.push(event);
    }

    addStars(stars: number) {
        this.state.stars += Math.floor(stars);
        this.state.stars = Math.min(this.state.stars, 99);
        this.state.stars = Math.max(this.state.stars, 0);
    }

    clearEvents() {
        this.state.events = [];
    }

    getActor(id: number): BattleActor | undefined {
        return this.state.actors.actorById(id);
    }

    getTargets(actor: BattleActor, targetType: Func.FuncTargetType): BattleActor[] {
        return this.state.actors.getTargets(actor, targetType);
    }

    async init() {
        const actors = this.state.actors.all();

        for (let i in actors) {
            const actor = actors[i],
                passives = actor.passives();

            for (let j in passives) {
                const passive = passives[j];

                await passive.activate(this);
            }
        }
    }

    phase(): number {
        return this.state.actors.phase();
    }

    random(): BattleRandom {
        return this.state.random;
    }
}
