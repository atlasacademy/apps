import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Event, Item, Region } from "@atlasacademy/api-connector";

import GiftDescriptor from "../../Descriptor/GiftDescriptor";
import { mergeElements } from "../../Helper/OutputHelper";
import { FGOText } from "../../Helper/StringHelper";
import { lang } from "../../Setting/Manager";

const EventRewardTower = ({
    region,
    tower,
    itemMap,
}: {
    region: Region;
    tower: Event.EventTower;
    itemMap: Map<number, Item.Item>;
}) => {
    const { t } = useTranslation();
    return (
        <Table hover responsive>
            <thead>
                <tr>
                    <th className="text-center">{t("EventTowerFloor")}</th>
                    <th>{t("Message")}</th>
                    <th>{t("Reward")}</th>
                </tr>
            </thead>
            <tbody>
                {tower.rewards.map((reward) => {
                    return (
                        <tr key={reward.floor}>
                            <th scope="row" className="text-center">
                                {reward.floor}
                            </th>
                            <td lang={lang(region)}>
                                <FGOText text={reward.boardMessage} interpolatedVariables={[reward.floor]} />
                            </td>
                            <td>
                                {mergeElements(
                                    reward.gifts.map((gift) => (
                                        <GiftDescriptor
                                            key={`${gift.objectId}-${gift.priority}`}
                                            region={region}
                                            gift={gift}
                                            items={itemMap}
                                        />
                                    )),
                                    ", "
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

export default EventRewardTower;
