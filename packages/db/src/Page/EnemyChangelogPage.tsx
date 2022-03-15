import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { Quest, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import QuestPhaseTable from "../Component/QuestPhaseTable";
import Manager from "../Setting/Manager";

import "./ListingPage.css";

const EnemyChangelogPage = ({ region }: { region: Region }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | undefined>(undefined);
    const [quests, setQuests] = useState<Quest.QuestPhaseBasic[]>([]);

    useEffect(() => {
        Manager.setRegion(region);
        Api.questEnemyChangelog()
            .then((quests) => {
                setQuests(quests);
                setLoading(false);
            })
            .catch((error) => setError(error));
    }, [region]);

    if (loading) return <Loading />;

    if (error !== undefined) return <ErrorStatus error={error} />;

    return (
        <div className="listing-page">
            <h3>Latest uploaded enemy data</h3>
            <br />
            <QuestPhaseTable region={region} quests={quests} />
        </div>
    );
};

export default EnemyChangelogPage;
