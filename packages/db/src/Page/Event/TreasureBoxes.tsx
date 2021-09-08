import { Event, Item, Region } from "@atlasacademy/api-connector";
import { Table } from "react-bootstrap";
import GiftDescriptor from "../../Descriptor/GiftDescriptor";
import { sum } from "../../Helper/NumberHelper";
import { mergeElements } from "../../Helper/OutputHelper";

import "../ListingPage.css";

const TreasureBoxGiftTable = ({
    region,
    treasureBoxGifts,
    totalProbability,
    itemCache,
}: {
    region: Region;
    treasureBoxGifts: Event.EventTreasureBoxGift[];
    totalProbability: number;
    itemCache: Map<number, Item.Item>;
}) => {
    return (
        <Table hover responsive className="listing-table">
            <thead>
                <tr>
                    <th className="col-center">#</th>
                    <th>Reward</th>
                    <th className="col-center">Chance</th>
                    <th className="col-center">Collateral Lower Limit</th>
                    <th className="col-center">Collateral Upper Limit</th>
                </tr>
            </thead>
            <tbody>
                {treasureBoxGifts.map((boxGift) => {
                    const chance =
                        (boxGift.probability / totalProbability) * 100;
                    return (
                        <tr key={`${boxGift.id}-${boxGift.idx}`}>
                            <td className="col-center">{boxGift.idx}</td>
                            <td>
                                {mergeElements(
                                    boxGift.gifts.map((gift) => (
                                        <GiftDescriptor
                                            key={`${gift.objectId}-${gift.priority}`}
                                            region={region}
                                            gift={gift}
                                            items={itemCache}
                                        />
                                    )),
                                    ", "
                                )}
                            </td>
                            <td className="col-center">
                                {`${chance.toFixed(2)}%`}
                            </td>
                            <td className="col-center">
                                {boxGift.collateralLowerLimit}
                            </td>
                            <td className="col-center">
                                {boxGift.collateralUpperLimit}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

const TreasureBox = ({
    region,
    treasureBox,
    itemCache,
}: {
    region: Region;
    treasureBox: Event.EventTreasureBox;
    itemCache: Map<number, Item.Item>;
}) => {
    const totalProbability = sum(
        treasureBox.treasureBoxGifts.map((gift) => gift.probability)
    );
    return (
        <>
            <h4>
                Treasure Box {treasureBox.id}-{treasureBox.idx}
            </h4>
            Maximum number of draws per roll: {treasureBox.maxDrawNumOnce}
            <TreasureBoxGiftTable
                region={region}
                treasureBoxGifts={treasureBox.treasureBoxGifts}
                totalProbability={totalProbability}
                itemCache={itemCache}
            />
        </>
    );
};

const TreasureBoxes = ({
    region,
    treasureBoxes,
    itemCache,
}: {
    region: Region;
    treasureBoxes: Event.EventTreasureBox[];
    itemCache: Map<number, Item.Item>;
}) => {
    return (
        <>
            {treasureBoxes.map((treasureBox) => (
                <TreasureBox
                    key={`${treasureBox.id}-${treasureBox.idx}`}
                    region={region}
                    treasureBox={treasureBox}
                    itemCache={itemCache}
                />
            ))}
        </>
    );
};

export default TreasureBoxes;
