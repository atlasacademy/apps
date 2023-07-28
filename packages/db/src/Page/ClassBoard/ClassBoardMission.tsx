import { useContext } from "react";

import { Item } from "@atlasacademy/api-connector";

import { ClassBoardContext } from "../../Contexts/ClassBoard";
import Manager from "../../Setting/Manager";
import { MasterMissionCond } from "../MasterMissionPage";

interface Props {
    condTargetId: number;
    items: Item.ItemAmount[];
}

interface NotFoundProps {
    condTargetId: number;
}

const NotFound: React.FC<NotFoundProps> = ({ condTargetId }) => {
    return <h1>Mission {condTargetId} not found</h1>;
};

const ClassBoardMission: React.FC<Props> = ({ condTargetId, items }) => {
    const { missionData } = useContext(ClassBoardContext);
    const { currentMissions, loading } = missionData;

    if (loading) {
        return null;
    }

    const targetedMissions = currentMissions.find((mm) => mm.id < condTargetId);

    if (!targetedMissions) {
        return <NotFound condTargetId={condTargetId} />;
    }

    const mission = targetedMissions.missions.find((m) => m.id === condTargetId);
    const missionMap = new Map(targetedMissions.missions.map((m) => [m.id, m]));
    const itemsMap = new Map(items.map((item) => [item.item.id, item.item]));

    if (!mission) {
        return <NotFound condTargetId={condTargetId} />;
    }

    return (
        <>
            <h4>Mission Requirement</h4>
            <hr />
            <MasterMissionCond mission={mission} items={itemsMap} missionMap={missionMap} region={Manager.region()} />
        </>
    );
};

export default ClassBoardMission;
