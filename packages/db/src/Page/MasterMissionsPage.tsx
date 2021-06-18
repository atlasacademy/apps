import { MasterMission, Region } from "@atlasacademy/api-connector";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import { Link } from "react-router-dom";
import Manager from "../Setting/Manager";
import { getTimeString } from "../Helper/TimeHelper";

const MasterMissionsPage = (props: { region: Region }) => {
    const { region } = props;
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | undefined>(undefined);
    const [masterMissions, setMasterMissions] = useState<
        MasterMission.MasterMission[]
    >([]);

    useEffect(() => {
        Manager.setRegion(region);
        Api.masterMissionList()
            .then((r) => setMasterMissions(r))
            .catch((e) => setError(e));
        setLoading(false);
    }, [region]);

    if (loading) return <Loading />;

    if (error !== undefined) return <ErrorStatus error={error} />;

    document.title = `[${region}] Master Missions - Atlas Academy DB`;

    return (
        <>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th style={{ textAlign: "center", width: "1px" }}>#</th>
                        <th>Start</th>
                        <th>End</th>
                    </tr>
                </thead>
                <tbody>
                    {masterMissions.map((masterMission) => {
                        const route = `/${region}/master-mission/${masterMission.id}`;

                        return (
                            <tr key={masterMission.id}>
                                <td align={"center"}>
                                    <Link to={route}>{masterMission.id} </Link>
                                </td>
                                <td>
                                    {getTimeString(masterMission.startedAt)}
                                </td>
                                <td>{getTimeString(masterMission.endedAt)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </>
    );
};

export default MasterMissionsPage;
