import { QuestEnemy, Region } from "@atlasacademy/api-connector";

import { QuestDropDescriptor } from "../../Component/QuestEnemy";

const QuestDrops = ({ region, drops }: { region: Region; drops: QuestEnemy.EnemyDrop[] }) => {
    if (drops.length === 0) {
        return <></>;
    }

    drops.sort((a, b) => a.type.localeCompare(b.type) || a.objectId - b.objectId || a.num - b.num);

    return <QuestDropDescriptor region={region} drops={drops} />;
};

export default QuestDrops;
