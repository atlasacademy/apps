import {Quest, Trait} from "@atlasacademy/api-connector";
import {BattleActor, BattleActorProps} from "./Actor/BattleActor";
import {BattleTeam} from "./Enum/BattleTeam";
import {Battle} from "./Battle";

export class BattleFactory {
    private actors: BattleActor[] = [];
    private currentPhase: number = 1;
    private fieldTraits: Trait.Trait[] = [];

    public reset() {
        this.actors = [];
        this.currentPhase = 1;
        this.fieldTraits = [];
    }

    public addEnemyActor(props: BattleActorProps) {
        // const id = this.generateId(),
        //     actor = new BattleActor(
        //         props,
        //         id,
        //         BattleTeam.PLAYER,
        //         this.currentPhase,
        //         [],
        //         null,
        //         null
        //     );
        //
        // this.actors.push(actor);
    }

    public addFieldTraits(traits: Trait.Trait[]) {
        this.fieldTraits.push(...traits);
    }

    // public addPlayerActor(props: BattleActorProps) {
    //     const id = this.generateId(),
    //         actor = new BattleActor(
    //             props,
    //             id,
    //             BattleTeam.PLAYER,
    //             1,
    //             [],
    //             null,
    //             null
    //         );
    //
    //     this.actors.push(actor);
    // }

    public advancePhase() {
        this.currentPhase++;
    }

    // public initState(): BattleState {
    //     return new BattleState(
    //         1,
    //         BattleTeam.PLAYER,
    //         this.actors.map(actor => actor.clone()),
    //         this.fieldTraits
    //     );
    // }

    public setQuest(quest: Quest.QuestPhase) {
        this.addFieldTraits(quest.individuality);

        quest.stages.forEach(stage => {
            stage.enemies.forEach(questEnemy => {
                // this.addEnemyActor({questEnemy});
            });

            this.advancePhase();
        });
    }

    private generateId(): number {
        if (!this.actors.length)
            return 1;

        return this.actors[this.actors.length - 1].props.id + 1;
    }

}
