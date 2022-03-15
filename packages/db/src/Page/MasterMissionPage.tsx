import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";

import { MasterMission, Region, Mission, Servant, EnumList, Item, Quest } from "@atlasacademy/api-connector";

import Api, { Host } from "../Api";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import GiftDescriptor from "../Descriptor/GiftDescriptor";
import MissionConditionDescriptor from "../Descriptor/MissionConditionDescriptor";
import { mergeElements } from "../Helper/OutputHelper";
import { getEventStatus, getTimeString } from "../Helper/TimeHelper";
import Manager from "../Setting/Manager";

import "../Helper/StringHelper.css";

const MasterMissionCond = (props: {
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
    ].map((progressType) => {
        const conds = props.mission.conds.filter((cond) => cond.missionProgressType === progressType);
        if (conds.length > 0) {
            return (
                <MissionConditionDescriptor
                    key={conds[0].id}
                    region={props.region}
                    goToQuestSearchOnly={true}
                    cond={conds[0]}
                    missions={props.missionMap}
                    servants={props.servants}
                    quests={props.quests}
                    items={props.items}
                    enums={props.enums}
                />
            );
        } else {
            return "";
        }
    });
    return <>{mergeElements(renderedConds, "")}</>;
};

const MasterMissionPage = (props: { region: Region; masterMissionId: number }) => {
    const { region, masterMissionId } = props;
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | undefined>(undefined);
    const [masterMission, setMasterMission] = useState<MasterMission.MasterMission | undefined>(undefined);
    const [enumList, setEnumList] = useState<EnumList | undefined>(undefined);
    const [servantCache, setServantCache] = useState<Map<number, Servant.ServantBasic> | undefined>(undefined);
    const [itemCache, setItemCache] = useState<Map<number, Item.Item> | undefined>(undefined);

    useEffect(() => {
        Manager.setRegion(region);
        Promise.all([Api.masterMission(masterMissionId), Api.enumList(), Api.servantList(), Api.itemList()])
            .then(([mmData, enums, servants, items]) => {
                setMasterMission(mmData);
                setEnumList(enums);
                setServantCache(new Map(servants.map((servant) => [servant.id, servant])));
                setItemCache(new Map(items.map((item) => [item.id, item])));
                setLoading(false);
            })
            .catch((e) => {
                setError(e);
                setLoading(false);
            });
    }, [region, masterMissionId]);

    if (loading) return <Loading />;

    if (error !== undefined) return <ErrorStatus error={error} />;

    if (masterMission === undefined) return null;

    document.title = `[${region}] Master Mission ${masterMissionId} - Atlas Academy DB`;

    const missionMap = new Map(masterMission.missions.map((mission) => [mission.id, mission]));
    const questCache = new Map(masterMission.quests.map((quest) => [quest.id, quest]));

    return (
        <>
            <h1>Master Mission {masterMissionId}</h1>
            <br />

            <div style={{ marginBottom: "3%" }}>
                <DataTable
                    data={{
                        ID: masterMissionId,
                        Status: getEventStatus(masterMission.startedAt, masterMission.endedAt),
                        Start: getTimeString(masterMission.startedAt),
                        End: getTimeString(masterMission.endedAt),
                        Close: getTimeString(masterMission.closedAt),
                        Raw: (
                            <Row>
                                <Col>
                                    <RawDataViewer text="Nice" data={masterMission} />
                                </Col>
                                <Col>
                                    <RawDataViewer text="Raw" data={`${Host}/raw/${region}/mm/${masterMissionId}`} />
                                </Col>
                            </Row>
                        ),
                    }}
                />
            </div>
            <h2>Missions</h2>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>#</th>
                        <th>Detail</th>
                        <th>Reward</th>
                    </tr>
                </thead>
                <tbody>
                    {masterMission.missions.map((mission) => (
                        <tr key={mission.id}>
                            <th scope="row" style={{ textAlign: "center" }}>
                                {mission.dispNo}
                            </th>
                            <td>
                                <b className="newline">{mission.name}</b>
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
