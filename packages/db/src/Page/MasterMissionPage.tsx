import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { EnumList, Item, MasterMission, Mission, Quest, Region, Servant } from "@atlasacademy/api-connector";

import Api from "../Api";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import MissionConditionDescriptor from "../Descriptor/MissionConditionDescriptor";
import LoadStatus from "../Helper/LoadStatus";
import { getEventStatus, getTimeString } from "../Helper/TimeHelper";
import Manager, { lang } from "../Setting/Manager";

export const MasterMissionCond = (props: {
    region: Region;
    mission: Mission.Mission;
    missionMap: Map<number, Mission.Mission>;
    servants?: Map<number, Servant.ServantBasic>;
    quests?: Map<number, Quest.QuestBasic>;
    items?: Map<number, Item.Item>;
    enums?: EnumList;
}) => {
    const renderedConds = [
        Mission.ProgressType.OPEN_CONDITION,
        Mission.ProgressType.START,
        Mission.ProgressType.CLEAR,
    ].map((progressType) =>
        props.mission.conds
            .filter((cond) => cond.missionProgressType === progressType)
            .map((cond) => (
                <MissionConditionDescriptor
                    key={cond.id}
                    region={props.region}
                    goToQuestSearchOnly={true}
                    cond={cond}
                    missions={props.missionMap}
                    servants={props.servants}
                    quests={props.quests}
                    items={props.items}
                    enums={props.enums}
                />
            ))
    );
    return <>{renderedConds.flat()}</>;
};

interface MasterMissionLoadStatus extends LoadStatus<MasterMission.MasterMission> {
    enumList?: EnumList;
    servantCache?: Map<number, Servant.ServantBasic>;
    itemCache?: Map<number, Item.Item>;
}

const MasterMissionPage = (props: { region: Region; masterMissionId: number }) => {
    const { region, masterMissionId } = props;
    const [{ loading, data: masterMission, enumList, servantCache, itemCache, error }, setLoadStatus] =
        useState<MasterMissionLoadStatus>({
            loading: true,
        });
    const { t } = useTranslation();

    useEffect(() => {
        const controller = new AbortController();
        Manager.setRegion(region);
        Promise.all([Api.masterMission(masterMissionId), Api.enumList(), Api.servantList(), Api.itemList()])
            .then(([mmData, enumList, servants, items]) => {
                if (controller.signal.aborted) return;
                document.title = `[${region}] Master Mission ${masterMissionId} - Atlas Academy DB`;
                setLoadStatus({
                    loading: false,
                    data: mmData,
                    enumList,
                    servantCache: new Map(servants.map((servant) => [servant.id, servant])),
                    itemCache: new Map(items.map((item) => [item.id, item])),
                });
            })
            .catch((e) => {
                if (controller.signal.aborted) return;
                setLoadStatus({ loading: true, error: e });
            });
        return () => {
            controller.abort();
        };
    }, [region, masterMissionId]);

    if (loading) return <Loading />;

    if (error !== undefined) return <ErrorStatus error={error} />;

    if (masterMission === undefined) return null;

    const missionMap = new Map(masterMission.missions.map((mission) => [mission.id, mission]));
    const questCache = new Map(masterMission.quests.map((quest) => [quest.id, quest]));

    return (
        <>
            <h1>
                {t("Master Mission")} {masterMissionId}
            </h1>
            <br />

            <div className="mb-5">
                <DataTable
                    data={[
                        { label: t("ID"), value: masterMissionId },
                        { label: t("Status"), value: getEventStatus(masterMission.startedAt, masterMission.endedAt) },
                        { label: t("Start"), value: getTimeString(masterMission.startedAt) },
                        { label: t("End"), value: getTimeString(masterMission.endedAt) },
                        { label: t("Close"), value: getTimeString(masterMission.closedAt) },
                        {
                            label: "Raw",
                            value: (
                                <Row>
                                    <Col>
                                        <RawDataViewer
                                            text="Nice"
                                            data={masterMission}
                                            url={Api.getUrl("nice", "mm", masterMissionId)}
                                        />
                                    </Col>
                                    <Col>
                                        <RawDataViewer text="Raw" data={Api.getUrl("raw", "mm", masterMissionId)} />
                                    </Col>
                                </Row>
                            ),
                        },
                    ]}
                />
            </div>
            <h2>{t("Missions")}</h2>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th className="text-center">#</th>
                        <th>{t("Detail")}</th>
                        <th>{t("Reward")}</th>
                    </tr>
                </thead>
                <tbody>
                    {masterMission.missions.map((mission) => (
                        <tr key={mission.id}>
                            <th scope="row" className="text-center">
                                {mission.dispNo}
                            </th>
                            <td>
                                <b className="text-prewrap" lang={lang(region)}>
                                    {mission.name}
                                </b>
                                <br />
                                <MasterMissionCond
                                    region={region}
                                    mission={mission}
                                    missionMap={missionMap}
                                    servants={servantCache}
                                    quests={questCache}
                                    items={itemCache}
                                    enums={enumList}
                                />
                            </td>
                            <td>
                                {mission.gifts.map((gift) => (
                                    <div key={`${gift.objectId}-${gift.priority}`}>
                                        <GiftDescriptor region={region} gift={gift} items={itemCache} />
                                        <br />
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default MasterMissionPage;
