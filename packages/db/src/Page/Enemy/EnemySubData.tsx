import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

import { Card, CardDetail, Enemy, Region } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import DataTable from "../../Component/DataTable";
import TraitDescription from "../../Descriptor/TraitDescription";
import { Renderable, asPercent, mergeElements } from "../../Helper/OutputHelper";

interface IProps extends WithTranslation {
    region: Region;
    enemy: Enemy.Enemy;
}

class EnemySubData extends React.Component<IProps> {
    private cardList(): Renderable {
        const cardCount = new Map<Card, number>();

        this.props.enemy.cards.forEach((card) => {
            const count = cardCount.get(card);

            cardCount.set(card, 1 + (count ?? 0));
        });

        const parts: Renderable[] = [];
        cardCount.forEach((value, key) => {
            parts.push(`${toTitleCase(key)}: ${this.props.t("Cards", { count: value })}`);
        });

        return <div>{mergeElements(parts, ", ")}</div>;
    }

    private hitDistribution() {
        const parts: Renderable[] = [],
            hitDistribution = this.props.enemy.hitsDistribution,
            keys = Object.keys(hitDistribution) as Card[],
            values = Object.values(hitDistribution),
            t = this.props.t;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i],
                hits: number[] = values[i] ?? [],
                hitBreakdown = hits.map((hit) => asPercent(hit, 0)).join(", ");

            let attackType = "";

            if ([Card.WEAK, Card.STRENGTH].includes(key)) {
                attackType = this.props.enemy.cardDetails[key]?.attackType ?? "";

                switch (attackType) {
                    case CardDetail.AttackType.ONE:
                        attackType = ` [${t("One Enemy")}]`;
                        break;
                    case CardDetail.AttackType.ALL:
                        attackType = ` [${t("All Enemies")}]`;
                        break;
                }
            }

            parts.push(`${toTitleCase(key)}: ${hitBreakdown} - ${t("Hits", { count: hits.length })}${attackType}`);
        }

        return <div>{mergeElements(parts, <br />)}</div>;
    }

    private traitList() {
        return (
            <>
                {this.props.enemy.traits.map((trait) => (
                    <React.Fragment key={trait.id}>
                        <TraitDescription region={this.props.region} trait={trait} />
                        <br />
                    </React.Fragment>
                ))}
            </>
        );
    }

    render() {
        const t = this.props.t;
        return (
            <div>
                <DataTable
                    data={[
                        { label: t("Traits"), value: this.traitList() },
                        { label: t("Cards"), value: this.cardList() },
                        { label: t("Hit Count"), value: this.hitDistribution() },
                    ]}
                />
            </div>
        );
    }
}

export default withTranslation()(EnemySubData);
