import { useEffect, useState } from "react";

import { Region, Event } from "@atlasacademy/api-connector";

import Api from "../Api";
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
    const [alloutBattle, setAlloutBattle] = useState<Event.EventAlloutBattle[]>([]);

    useEffect(() => {
        Api.eventAlloutBattle(eventId).then((allouts) => setAlloutBattle(allouts));
    }, [eventId]);

    const chosenBattle = alloutBattle.find((battle) => battle.alloutBattleId === alloutBattleId);
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
