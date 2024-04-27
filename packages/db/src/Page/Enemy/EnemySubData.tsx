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
            cardDetails = this.props.enemy.cardDetails,
            keys = Object.keys(cardDetails) as Card[],
            details = Object.values(cardDetails),
            t = this.props.t;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i],
                detail = details[i],
                hits: number[] = detail.hitsDistribution ?? [],
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

            const isAoe = detail.attackType === CardDetail.AttackType.ALL ? this.props.t("AOE") : "";

            parts.push(
                `${toTitleCase(key)} ${isAoe}: ${hitBreakdown} - ${t("Hits", { count: hits.length })}${attackType}`
            );
            if (
                detail.damageRate !== undefined ||
                detail.attackNpRate !== undefined ||
                detail.defenseNpRate !== undefined ||
                detail.dropStarRate !== undefined
            ) {
                parts.push(
                    <ul className="mb-0">
                        {detail.damageRate !== undefined && (
                            <li>
                                {toTitleCase(key)} {this.props.t("Damage Mod")}: {asPercent(detail.damageRate, 1)}
                            </li>
                        )}
                        {detail.attackNpRate !== undefined && (
                            <li>
                                {toTitleCase(key)} {this.props.t("Attack NP Mod")}: {asPercent(detail.attackNpRate, 1)}
                            </li>
                        )}
                        {detail.defenseNpRate !== undefined && (
                            <li>
                                {toTitleCase(key)} {this.props.t("Defense NP Mod")}:{" "}
                                {asPercent(detail.defenseNpRate, 1)}
                            </li>
                        )}
                        {detail.dropStarRate !== undefined && (
                            <li>
                                {toTitleCase(key)} {this.props.t("Star Drop Mod")}: {asPercent(detail.dropStarRate, 1)}
                            </li>
                        )}
                    </ul>
                );
            }
        }

        return <div>{mergeElements(parts, <br />)}</div>;
    }

    private traitList() {
        return (
            <>
                {this.props.enemy.traits.map((trait) => (
                    <React.Fragment key={trait.id}>
                        <TraitDescription region={this.props.region} trait={trait} />
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
