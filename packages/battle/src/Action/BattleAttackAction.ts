import { Card, Trait } from "@atlasacademy/api-connector";

import { BattleActor } from "../Actor/BattleActor";

export class BattleAttackAction {
    constructor(
        public actor: BattleActor,
        public card: Card,
        public critical: boolean,
        public firstCard: Card,
        public grand: boolean,
        public np: boolean,
        public num: number
    ) {
        //
    }

    traits(): Trait.Trait[] {
        if (this.np) return this.actor.noblePhantasm().traits();

        const cardConstant = this.actor.battle().constants().cardConstants(this.card, this.num);
        if (!cardConstant) {
            throw new Error("FAILED TO FIND CARD CONSTANT");
        }

        return cardConstant.individuality;
    }
}

export class BattleAttackActionList {
    public actions: BattleAttackAction[] = [];

    add(actor: BattleActor, card: Card, np: boolean) {
        const firstAction = this.actions[0],
            firstCard = firstAction?.card ?? card;

        this.actions.push(new BattleAttackAction(actor, card, false, firstCard, false, np, this.actions.length + 1));

        const validCards = [Card.BUSTER, Card.QUICK, Card.ARTS],
            actorCards = this.actions
                .filter((action) => action.actor.props.id === actor.props.id)
                .filter((action) => validCards.includes(action.card))
                .map((action) => action.card),
            validCardCount = actorCards.length,
            grand = actorCards.filter((actorCard) => actorCard === card).length === 3;

        if (validCardCount >= 3) {
            this.actions.push(
                new BattleAttackAction(actor, Card.EXTRA, false, firstCard, grand, false, this.actions.length + 1)
            );
        }

        if (grand) {
            for (let i in this.actions) {
                this.actions[i].grand = true;
            }
        }
    }

    get(num: number): BattleAttackAction {
        const action = this.actions[num - 1];
        if (!action) throw new Error("UNKNOWN ACTION");

        return action;
    }
}
