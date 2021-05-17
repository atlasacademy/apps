import {Card} from "@atlasacademy/api-connector";
import {BattleActor} from "../Actor/BattleActor";

export default class BattleAttackAction {

    public actions: { actor: BattleActor, card: Card }[] = [];

    add(actor: BattleActor, card: Card) {
        this.actions.push({actor, card});

        const validCards = [Card.BUSTER, Card.QUICK, Card.ARTS],
            validCardCount = this.actions
                .filter(action => action.actor.props.id === actor.props.id)
                .filter(action => validCards.includes(action.card))
                .length;

        if (validCardCount >= 3)
            this.actions.push({actor, card: Card.EXTRA});
    }
}
