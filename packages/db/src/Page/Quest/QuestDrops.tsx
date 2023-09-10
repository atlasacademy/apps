import { QuestEnemy, Region } from "@atlasacademy/api-connector";

import { QuestDropDescriptor } from "../../Component/QuestEnemy";

const QuestDrops = ({
    region,
    drops,
    questHash,
    questHashAverageGoTo,
}: {
    region: Region;
    drops: QuestEnemy.EnemyDrop[];
    questHash?: string | "average";
    questHashAverageGoTo?: () => void;
}) => {
    if (drops.length === 0) {
        return <></>;
    }

    drops.sort((a, b) => a.type.localeCompare(b.type) || a.objectId - b.objectId || a.num - b.num);

    return (
        <QuestDropDescriptor
            region={region}
            drops={drops}
            questHash={questHash}
            questHashAverageGoTo={questHashAverageGoTo}
        />
    );
};

export default QuestDrops;
