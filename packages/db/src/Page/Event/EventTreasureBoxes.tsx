import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Event, Item, Region } from "@atlasacademy/api-connector";

import CommonConsumeDescriptor from "../../Descriptor/CommonConsumeDescriptor";
import { MultipleGifts } from "../../Descriptor/MultipleDescriptors";
import { mergeElements } from "../../Helper/OutputHelper";

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
    const { t } = useTranslation();
    return (
        <Table hover responsive className="listing-table">
            <thead>
                <tr>
                    <th className="col-center">#</th>
                    <th>{t("Reward")}</th>
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
    const { t } = useTranslation();
    return (
        <>
            <h4>
                {t("EventTreasureBox")} {treasureBox.idx}
            </h4>
            <ul>
                <li>
                    {t("EventTreasureBoxMaxNumOnceDraw")}: {treasureBox.maxDrawNumOnce}
                </li>
                <li>
                    {t("EventTreasureBoxDrawCost")}:{" "}
                    {mergeElements(
                        treasureBox.consumes.map((consume) => (
                            <CommonConsumeDescriptor region={region} commonConsume={consume} itemMap={itemMap} />
                        )),
                        ", "
                    )}
                </li>
                <li>
                    {t("EventTreasureBoxExtraGift")}:{" "}
                    <MultipleGifts region={region} gifts={treasureBox.extraGifts} itemMap={itemMap} />
                </li>
            </ul>
            <TreasureBoxGiftTable region={region} treasureBoxGifts={treasureBox.treasureBoxGifts} itemMap={itemMap} />
        </>
    );
};

const EventTreasureBoxes = ({
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

export default EventTreasureBoxes;
