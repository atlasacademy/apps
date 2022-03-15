import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { MasterMission, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import { getCurrentTimestamp, getTimeString } from "../Helper/TimeHelper";
import Manager from "../Setting/Manager";

import "./ListingPage.css";

const MasterMissionsPage = (props: { region: Region }) => {
    const { region } = props;
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | undefined>(undefined);
    const [masterMissions, setMasterMissions] = useState<MasterMission.MasterMission[]>([]);

    useEffect(() => {
        Manager.setRegion(region);
        Api.masterMissionList()
            .then((r) => {
                setMasterMissions(r);
                setLoading(false);
            })
            .catch((e) => setError(e));
    }, [region]);

    if (loading) return <Loading />;

    if (error !== undefined) return <ErrorStatus error={error} />;

    document.title = `[${region}] Master Missions - Atlas Academy DB`;

    const currentTimestamp = getCurrentTimestamp();

    return (
        <div id="master-missions" className="listing-page">
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th className="col-center">#</th>
                        <th className="col-center">Ongoing</th>
                        <th>Start</th>
                        <th>End</th>
                    </tr>
                </thead>
                <tbody>
                    {masterMissions.map((masterMission) => {
                        const route = `/${region}/master-mission/${masterMission.id}`;
                        const isOngoing =
                            currentTimestamp >= masterMission.startedAt && currentTimestamp <= masterMission.endedAt;

                        return (
                            <tr key={masterMission.id}>
                                <td className="col-center">
                                    <Link to={route}>{masterMission.id} </Link>
                                </td>
                                <td className="col-center">
                                    {isOngoing ? (
                                        <FontAwesomeIcon
                                            icon={faCheckCircle}
                                            title="Master mission is ongoing right now"
                                        />
                                    ) : null}
                                </td>
                                <td>{getTimeString(masterMission.startedAt)}</td>
                                <td>{getTimeString(masterMission.endedAt)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

export default MasterMissionsPage;
