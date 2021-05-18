import {Card} from "@atlasacademy/api-connector";
import {BattleActor} from "../Actor/BattleActor";

export interface BattleAttackAction {
    actor: BattleActor,
    card: Card,
    np: boolean,
    num: number,
}

export class BattleAttackActionList {

    public actions: BattleAttackAction[] = [];

    add(actor: BattleActor, card: Card, np: boolean) {
        this.actions.push({actor, card, np, num: this.actions.length + 1});

        const validCards = [Card.BUSTER, Card.QUICK, Card.ARTS],
            validCardCount = this.actions
                .filter(action => action.actor.props.id === actor.props.id)
                .filter(action => validCards.includes(action.card))
                .length;

        if (validCardCount >= 3)
            this.actions.push({actor, card: Card.EXTRA, np: false, num: this.actions.length + 1});
    }

    get(num: number): BattleAttackAction | undefined {
        return this.actions[num - 1];
    }

}
