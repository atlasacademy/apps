import { Region } from "@atlasacademy/api-connector";

import useApi from "../Hooks/useApi";
import { WarDescriptorId } from "./WarDescriptor";

const EventAllOutDescription = ({
    region,
    eventId,
    alloutBattleId,
}: {
    region: Region;
    eventId: number;
    alloutBattleId: number;
}) => {
    const { data: alloutBattle } = useApi("eventAlloutBattle", eventId);
    const chosenBattle = (alloutBattle ?? []).find((battle) => battle.alloutBattleId === alloutBattleId);

    if (chosenBattle !== undefined) {
        return <WarDescriptorId region={region} warId={chosenBattle.warId} />;
    }
    return (
        <>
            Event {eventId} All out battle {alloutBattleId}
        </>
    );
};

export default EventAllOutDescription;
