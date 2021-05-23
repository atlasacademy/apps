import {Card} from "@atlasacademy/api-connector";
import {Trait} from "@atlasacademy/api-connector/dist/Schema/Trait";
import {BattleActor} from "../Actor/BattleActor";
import GameConstantManager from "../Game/GameConstantManager";

export class BattleAttackAction {
    constructor(public actor: BattleActor,
                public card: Card,
                public np: boolean,
                public num: number) {
        //
    }

    traits(): Trait[] {
        if (this.np) return this.actor.noblePhantasm().traits();

        const cardConstant = GameConstantManager.cardConstants(this.card, this.num);
        if (!cardConstant) {
            throw new Error('FAILED TO FIND CARD CONSTANT');
        }

        return cardConstant.individuality;
    }
}

export class BattleAttackActionList {

    public actions: BattleAttackAction[] = [];

    add(actor: BattleActor, card: Card, np: boolean) {
        this.actions.push(new BattleAttackAction(actor, card, np, this.actions.length + 1));

        const validCards = [Card.BUSTER, Card.QUICK, Card.ARTS],
            validCardCount = this.actions
                .filter(action => action.actor.props.id === actor.props.id)
                .filter(action => validCards.includes(action.card))
                .length;

        if (validCardCount >= 3)
            this.actions.push(new BattleAttackAction(actor, Card.EXTRA, false, this.actions.length + 1));
    }

    get(num: number): BattleAttackAction {
        const action = this.actions[num - 1];
        if (!action)
            throw new Error('UNKNOWN ACTION');

        return action;
    }

}
