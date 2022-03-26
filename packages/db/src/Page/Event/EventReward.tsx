import { Table } from "react-bootstrap";

import { Region, Event, Item, Gift } from "@atlasacademy/api-connector";

import GiftDescriptor from "../../Descriptor/GiftDescriptor";
import PointBuffDescriptor from "../../Descriptor/PointBuffDescriptor";
import { mergeElements } from "../../Helper/OutputHelper";

const EventReward = ({
    region,
    rewards,
    allPointBuffs,
    itemMap,
}: {
    region: Region;
    rewards: Event.EventReward[];
    allPointBuffs: Event.EventPointBuff[];
    itemMap: Map<number, Item.Item>;
}) => {
    const pointBuffMap = new Map(allPointBuffs.map((pointBuff) => [pointBuff.id, pointBuff]));
    const pointBuffPointMap = new Map(allPointBuffs.map((pointBuff) => [pointBuff.eventPoint, pointBuff]));
    return (
        <Table hover responsive>
            <thead>
                <tr>
                    <th>Point</th>
                    <th>Reward</th>
                </tr>
            </thead>
            <tbody>
                {rewards.map((reward) => {
                    const pointBuff = pointBuffPointMap.get(reward.point);
                    let pointBuffDescription = null;
                    if (pointBuff !== undefined) {
                        const pointBuffGifts = reward.gifts
                            .filter((gift) => gift.type === Gift.GiftType.EVENT_POINT_BUFF)
                            .map((gift) => gift.objectId);
                        // In Oniland, point buffs are listed as rewards but in MIXA event, they aren't.
                        // If point buffs are rewards, Gift Descriptor can handle them.
                        // Otherwise, pointBuffDescription is used.
                        if (!pointBuffGifts.includes(pointBuff.id)) {
                            pointBuffDescription = (
                                <>
                                    <br />
                                    <PointBuffDescriptor region={region} pointBuff={pointBuff} />
                                </>
                            );
                        }
                    }
                    return (
                        <tr key={reward.point}>
                            <th scope="row">{reward.point.toLocaleString()}</th>
                            <td>
                                {mergeElements(
                                    reward.gifts.map((gift) => (
                                        <GiftDescriptor
                                            key={`${gift.objectId}-${gift.priority}`}
                                            region={region}
                                            gift={gift}
                                            items={itemMap}
                                            pointBuffs={pointBuffMap}
                                        />
                                    )),
                                    ", "
                                )}
                                {pointBuffDescription}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

export default EventReward;
