import { Table } from "react-bootstrap";

import { Event, Item, Region } from "@atlasacademy/api-connector";

import CommonConsumeDescriptor from "../../Descriptor/CommonConsumeDescriptor";
import { MultipleGifts } from "../../Descriptor/MultipleDescriptors";

import "../ListingPage.css";

const TreasureBoxGiftTable = ({
    region,
    treasureBoxGifts,
    itemMap,
}: {
    region: Region;
    treasureBoxGifts: Event.EventTreasureBoxGift[];
    itemMap: Map<number, Item.Item>;
}) => {
    return (
        <Table hover responsive className="listing-table">
            <thead>
                <tr>
                    <th className="col-center">#</th>
                    <th>Reward</th>
                </tr>
            </thead>
            <tbody>
                {treasureBoxGifts.map((boxGift) => {
                    return (
                        <tr key={`${boxGift.id}-${boxGift.idx}`}>
                            <td className="col-center">{boxGift.idx}</td>
                            <td>
                                <MultipleGifts region={region} gifts={boxGift.gifts} itemMap={itemMap} />
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
    itemMap,
}: {
    region: Region;
    treasureBox: Event.EventTreasureBox;
    itemMap: Map<number, Item.Item>;
}) => {
    return (
        <>
            <h4>Treasure Box {treasureBox.idx}</h4>
            <ul>
                <li>Maximum number of draws at once: {treasureBox.maxDrawNumOnce}</li>
                <li>
                    Draw Cost:{" "}
                    <CommonConsumeDescriptor
                        region={region}
                        commonConsume={treasureBox.commonConsume}
                        itemMap={itemMap}
                    />
                </li>
                <li>
                    Extra Gifts per box:{" "}
                    <MultipleGifts region={region} gifts={treasureBox.extraGifts} itemMap={itemMap} />
                </li>
            </ul>
            <TreasureBoxGiftTable region={region} treasureBoxGifts={treasureBox.treasureBoxGifts} itemMap={itemMap} />
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
                    itemMap={itemCache}
                />
            ))}
        </>
    );
};

export default TreasureBoxes;
