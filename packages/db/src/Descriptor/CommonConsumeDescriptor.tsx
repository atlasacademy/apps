import { CommonConsume, Item, Region } from "@atlasacademy/api-connector";

import { IconDescriptorMap } from "./ItemDescriptor";

const CommonConsumeDescriptor = ({
    region,
    commonConsume,
    itemMap,
}: {
    region: Region;
    commonConsume: CommonConsume.CommonConsume;
    itemMap: Map<number, Item.Item>;
}) => {
    switch (commonConsume.type) {
        case CommonConsume.CommonConsumeType.ITEM:
            return (
                <>
                    <IconDescriptorMap region={region} itemId={commonConsume.objectId} items={itemMap} /> x
                    {commonConsume.num}
                </>
            );
    }
};

export default CommonConsumeDescriptor;
