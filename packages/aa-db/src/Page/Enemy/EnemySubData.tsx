import {Card, Region} from "@atlasacademy/api-connector";
import Enemy from "@atlasacademy/api-connector/dist/Schema/Enemy";
import React from "react";
import DataTable from "../../Component/DataTable";
import TraitDescriptor from "../../Descriptor/TraitDescriptor";
import {asPercent, mergeElements, Renderable} from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    enemy: Enemy;
}

class EnemySubData extends React.Component<IProps> {
    private cardList(): Renderable {
        const cardCount = new Map<Card, number>();

        this.props.enemy.cards.forEach(card => {
            const count = cardCount.get(card);

            cardCount.set(card, 1 + (count ?? 0));
        });

        const parts: Renderable[] = [];
        cardCount.forEach((value, key) => {
            parts.push(`${key}: ${value} ${value > 1 ? 'cards' : 'card'}`);
        });

        return <div>
            {mergeElements(parts, ', ')}
        </div>
    }

    private hitDistribution() {
        const parts: Renderable[] = [],
            hitDistribution = this.props.enemy.hitsDistribution,
            keys = Object.keys(hitDistribution),
            values = Object.values(hitDistribution);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i],
                hits: number[] = values[i] ?? [],
                hitBreakdown = hits.map(hit => asPercent(hit, 0)).join(', ');

            parts.push(
                `${key}: ${hitBreakdown} - ${hits.length} ${hits.length > 1 ? 'Hits' : 'Hit'}`
            );
        }

        return <div>
            {mergeElements(parts, <br/>)}
        </div>;
    }

    private traitList() {
        const parts = this.props.enemy.traits
            .map(trait => <TraitDescriptor region={this.props.region} trait={trait}/>);

        return <div>
            {mergeElements(parts, <br/>)}
        </div>
    }

    render() {
        return (
            <div>
                <DataTable data={{
                    "Traits": this.traitList(),
                    "Cards": this.cardList(),
                    "Hit Count": this.hitDistribution(),
                }}/>
            </div>
        );
    }
}

export default EnemySubData;
