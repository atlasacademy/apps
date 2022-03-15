import { Event, Item, Region } from "@atlasacademy/api-connector";

import ItemIcon from "../Component/ItemIcon";
import { FuncDescriptorId } from "../Descriptor/FuncDescriptor";

const PointBuffDescriptor = (props: { region: Region; pointBuff: Event.EventPointBuff }) => {
    const { region, pointBuff } = props;
    const pointBuffItem = {
        id: pointBuff.id,
        name: pointBuff.name,
        type: Item.ItemType.EVENT_ITEM,
        uses: [],
        detail: pointBuff.detail,
        individuality: [],
        icon: pointBuff.icon,
        background: pointBuff.background,
        priority: 0,
        dropPriority: 0,
    };
    return (
        <>
            <ItemIcon region={region} item={pointBuffItem} />
            <b>{pointBuff.name}</b>
            <br />
            <b>Detail:</b> {pointBuff.detail}
            <br />
            {pointBuff.funcIds.length > 0 ? (
                <>
                    <b>Functions:</b>{" "}
                    <ul style={{ margin: 0 }}>
                        {pointBuff.funcIds.map((funcId) => (
                            <li key={funcId}>
                                <FuncDescriptorId region={region} funcId={funcId} />
                            </li>
                        ))}
                    </ul>
                </>
            ) : null}
            <b>Value:</b> {pointBuff.value / 10}%
        </>
    );
};

export default PointBuffDescriptor;
