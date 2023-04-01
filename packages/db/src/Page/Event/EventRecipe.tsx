import React from "react";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Event, Item, Region } from "@atlasacademy/api-connector";

import ItemIcon from "../../Component/ItemIcon";
import CommonConsumeDescriptor from "../../Descriptor/CommonConsumeDescriptor";
import CondTargetValueDescriptor from "../../Descriptor/CondTargetValueDescriptor";
import GiftDescriptor from "../../Descriptor/GiftDescriptor";
import { flatten } from "../../Helper/PolyFill";
import { lang } from "../../Setting/Manager";

import "./EventTable.css";

const EventRecipe = ({
    region,
    recipes,
    itemMap,
}: {
    region: Region;
    recipes: Event.EventRecipe[];
    itemMap: Map<number, Item.Item>;
}) => {
    const { t } = useTranslation();

    return (
        <Table hover responsive className="event-table">
            <thead>
                <tr>
                    <th className="text-center">#</th>
                    <th className="text-center width-1px">{t("Icon")}</th>
                    <th className="text-center">{t("Name")}</th>
                    <th className="text-center">{t("Limit")}</th>
                    <th className="text-center">{t("Point")}</th>
                    <th className="text-center">{t("Cost")}</th>
                    <th className="text-center">{t("Rewards")}</th>
                </tr>
            </thead>
            <tbody>
                {recipes.map((recipe) => (
                    <tr key={recipe.id}>
                        <td>{recipe.id}</td>
                        <td>
                            <img src={recipe.icon} alt={`${recipe.name} Icon`} height="32px" />
                        </td>
                        <td>
                            <span lang={lang(region)}>{recipe.name}</span>
                            <div className="text-prewrap fs-075">
                                {recipe.releaseConditions.length > 0 && recipe.closedMessage !== "" ? (
                                    <>
                                        {t("Release Condition")}:{" "}
                                        <span lang={lang(region)}>{recipe.closedMessage}</span>
                                        <ul className="condition-list">
                                            {recipe.releaseConditions.map((cond, index) => (
                                                <li key={index}>
                                                    <CondTargetValueDescriptor
                                                        region={region}
                                                        cond={cond.condType}
                                                        target={cond.condId}
                                                        value={cond.condNum}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : null}
                            </div>
                        </td>
                        <td>{recipe.maxNum}</td>
                        <td>
                            <ItemIcon region={region} item={recipe.eventPointItem} />×
                            {recipe.eventPointNum.toLocaleString()}
                        </td>
                        <td>
                            {recipe.consumes.map((consume, idx) => (
                                <React.Fragment key={idx}>
                                    <CommonConsumeDescriptor
                                        region={region}
                                        commonConsume={consume}
                                        itemMap={itemMap}
                                    />
                                    <br />
                                </React.Fragment>
                            ))}
                        </td>
                        <td>
                            {flatten(recipe.recipeGifts.map((recipeGift) => recipeGift.gifts)).map((gift, idx) => (
                                <React.Fragment key={idx}>
                                    <GiftDescriptor region={region} gift={gift} items={itemMap} />
                                    <br />
                                </React.Fragment>
                            ))}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default EventRecipe;
