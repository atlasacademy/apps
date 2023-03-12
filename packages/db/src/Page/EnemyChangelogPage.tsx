import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Quest, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import QuestPhaseTable from "../Component/QuestPhaseTable";
import LoadStatus from "../Helper/LoadStatus";
import Manager from "../Setting/Manager";

import "./ListingPage.css";

const EnemyChangelogPage = ({ region }: { region: Region }) => {
    const { t } = useTranslation();
    const [{ loading, data: quests, error }, setLoadStatus] = useState<LoadStatus<Quest.QuestPhaseBasic[]>>({
        loading: true,
    });

    useEffect(() => {
        const controller = new AbortController();
        Manager.setRegion(region);
        Api.questEnemyChangelog()
            .then((quests) => {
                if (controller.signal.aborted) return;
                setLoadStatus({ loading: false, data: quests });
            })
            .catch((error) => {
                if (controller.signal.aborted) return;
                setLoadStatus({ loading: false, error });
            });
        return () => {
            controller.abort();
        };
    }, [region]);

    if (loading || quests === undefined) return <Loading />;

    if (error !== undefined) return <ErrorStatus error={error} />;

    return (
        <div className="listing-page">
            <h3>{t("EnemyChangelogPageTitle")}</h3>
            <br />
            <QuestPhaseTable region={region} quests={quests} />
        </div>
    );
};

export default EnemyChangelogPage;
