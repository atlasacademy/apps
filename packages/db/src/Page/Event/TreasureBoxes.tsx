import { Event, Item, Region } from "@atlasacademy/api-connector";
import { Table } from "react-bootstrap";
import GiftDescriptor from "../../Descriptor/GiftDescriptor";
import ItemDescriptor from "../../Descriptor/ItemDescriptor";
import { MultipleGifts } from "../../Descriptor/MultipleDescriptors";
import { sum } from "../../Helper/NumberHelper";
import { mergeElements } from "../../Helper/OutputHelper";

import "../ListingPage.css";

const TreasureBoxGiftTable = ({
    region,
    treasureBoxGifts,
    itemCache,
}: {
    region: Region;
    treasureBoxGifts: Event.EventTreasureBoxGift[];
    itemCache: Map<number, Item.Item>;
}) => {
    return (
        <Table hover responsive className="listing-table">
            <thead>
                <tr>
                    <th className="col-center">#</th>
                    <th>Reward</th>
                    <th className="col-center">Limit</th>
                </tr>
            </thead>
            <tbody>
                {treasureBoxGifts.map((boxGift) => {
                    return (
                        <tr key={`${boxGift.id}-${boxGift.idx}`}>
                            <td className="col-center">{boxGift.idx}</td>
                            <td>
                                <MultipleGifts
                                    region={region}
                                    gifts={boxGift.gifts}
                                    itemMap={itemCache}
                                />
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
    return (
        <>
            <h4>
                Treasure Box {treasureBox.id}-{treasureBox.idx}
            </h4>
            <ul>
                <li>Maximum number of draws: {treasureBox.maxDrawNumOnce}</li>
                <li>
                    Draw Currency:{" "}
                    <ItemDescriptor
                        region={region}
                        item={treasureBox.commonConsumeItem}
                    />
                </li>
                <li>
                    Extra Gifts:{" "}
                    <MultipleGifts
                        region={region}
                        gifts={treasureBox.extraGifts}
                        itemMap={itemCache}
                    />
                </li>
            </ul>
            <TreasureBoxGiftTable
                region={region}
                treasureBoxGifts={treasureBox.treasureBoxGifts}
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
            <br />
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
