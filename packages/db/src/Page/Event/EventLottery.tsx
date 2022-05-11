import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Region, Event, Item } from "@atlasacademy/api-connector";

import renderCollapsibleContent from "../../Component/CollapsibleContent";
import ItemIcon from "../../Component/ItemIcon";
import GiftDescriptor from "../../Descriptor/GiftDescriptor";
import { mergeElements } from "../../Helper/OutputHelper";

const EventLotteryBox = ({
    region,
    boxes,
    itemMap,
}: {
    region: Region;
    boxes: Event.EventLotteryBox[];
    itemMap: Map<number, Item.Item>;
}) => {
    return (
        <Table hover responsive>
            <thead>
                <tr>
                    <th className="text-center">#</th>
                    <th>Detail</th>
                    <th>Reward</th>
                    <th className="text-center">Limit</th>
                </tr>
            </thead>
            <tbody>
                {boxes.map((box) => {
                    return (
                        <tr key={box.no}>
                            <th scope="row" className="text-center">
                                {box.no}
                                {box.isRare ? (
                                    <>
                                        {" "}
                                        <FontAwesomeIcon icon={faStar} />
                                    </>
                                ) : null}
                            </th>
                            <td>{box.detail}</td>
                            <td>
                                {mergeElements(
                                    box.gifts.map((gift) => (
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
                            <td className="text-center">{box.maxNum}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

const EventLottery = ({
    region,
    lottery,
    itemMap,
}: {
    region: Region;
    lottery: Event.EventLottery;
    itemMap: Map<number, Item.Item>;
}) => {
    const boxIndexes = Array.from(new Set(lottery.boxes.map((box) => box.boxIndex))).sort((a, b) => a - b);

    return (
        <>
            <div style={{ margin: "1em 0" }}>
                <b>Cost of 1 roll:</b>{" "}
                <Link to={`/${region}/item/${lottery.cost.item.id}`}>
                    <ItemIcon region={region} item={lottery.cost.item} height={40} /> {lottery.cost.item.name}
                </Link>{" "}
                ×{lottery.cost.amount}
            </div>
            {boxIndexes.map((boxIndex) => {
                const boxes = lottery.boxes.filter((box) => box.boxIndex === boxIndex).sort((a, b) => a.no - b.no);

                const title = `Box ${boxIndex + 1}${
                    boxIndex === Math.max(...boxIndexes) && !lottery.limited ? "+" : ""
                }`;

                return (
                    <React.Fragment key={boxIndex}>
                        {renderCollapsibleContent({
                            title: title,
                            content: <EventLotteryBox region={region} boxes={boxes} itemMap={itemMap} />,
                            subheader: true,
                            initialOpen: false,
                        })}
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default EventLottery;
