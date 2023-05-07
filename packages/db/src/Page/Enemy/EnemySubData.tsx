import React from "react";

import { Card, Enemy, Region } from "@atlasacademy/api-connector";

import DataTable from "../../Component/DataTable";
import TraitDescription from "../../Descriptor/TraitDescription";
import { Renderable, asPercent, mergeElements } from "../../Helper/OutputHelper";

interface IProps {
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
            parts.push(`${key}: ${value} ${value > 1 ? "cards" : "card"}`);
        });

        return <div>{mergeElements(parts, ", ")}</div>;
    }

    private hitDistribution() {
        const parts: Renderable[] = [],
            hitDistribution = this.props.enemy.hitsDistribution,
            keys = Object.keys(hitDistribution),
            values = Object.values(hitDistribution);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i],
                hits: number[] = values[i] ?? [],
                hitBreakdown = hits.map((hit) => asPercent(hit, 0)).join(", ");

            let attackType = "";

            if (["weak", "strength"].includes(key)) {
                attackType = this.props.enemy.cardDetails[key as "weak" | "strength"]?.attackType ?? "";

                attackTypeLadder: switch (attackType) {
                    case "one":
                        attackType = " [One Enemy]";
                        break attackTypeLadder;
                    case "all":
                        attackType = " [All Enemies]";
                        break attackTypeLadder;
                    default:
                        break attackTypeLadder;
                }
            }

            parts.push(`${key}: ${hitBreakdown} - ${hits.length} ${hits.length > 1 ? "Hits" : "Hit"}${attackType}`);
        }

        return <div>{mergeElements(parts, <br />)}</div>;
    }

    private traitList() {
        const parts = this.props.enemy.traits.map((trait) => (
            <TraitDescription region={this.props.region} trait={trait} />
        ));

        return <div>{mergeElements(parts, <br />)}</div>;
    }

    render() {
        return (
            <div>
                <DataTable
                    data={[
                        { label: "Traits", value: this.traitList() },
                        { label: "Cards", value: this.cardList() },
                        { label: "Hit Count", value: this.hitDistribution() },
                    ]}
                />
            </div>
        );
    }
}

export default EnemySubData;
