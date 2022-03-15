import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { Quest, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import Manager from "../Setting/Manager";

const QuestRedirect = ({ region, id }: { region: Region; id: number }) => {
    const [error, setError] = useState<AxiosError | undefined>(undefined);
    const [quest, setQuest] = useState<Quest.Quest | undefined>(undefined);

    useEffect(() => {
        Manager.setRegion(region);
        Api.quest(id)
            .then((quest) => setQuest(quest))
            .catch((e) => setError(e));
    }, [region, id]);

    if (error !== undefined) return <ErrorStatus error={error} />;

    if (quest !== undefined) {
        const firstPhase = Math.min(...quest.phases);
        return <Redirect to={`/${region}/quest/${id}/${firstPhase}`} />;
    }

    return <Loading />;
};

export default QuestRedirect;
