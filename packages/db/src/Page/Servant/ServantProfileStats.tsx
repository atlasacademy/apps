import React from "react";
import { Table } from "react-bootstrap";

import { Profile, Region } from "@atlasacademy/api-connector";

interface IProps {
    region: Region;
    profile?: Profile.Profile;
}

class ServantProfileStats extends React.Component<IProps> {
    render() {
        const stats = this.props.profile?.stats;

        if (stats === undefined) return <></>;

        return (
            <>
                <h3>Stats</h3>

                <Table responsive>
                    <thead>
                        <tr>
                            <th>Strength</th>
                            <th>Endurance</th>
                            <th>Agility</th>
                            <th>Magic</th>
                            <th>Luck</th>
                            <th>NP</th>
                            <th>Divinity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{stats.strength}</td>
                            <td>{stats.endurance}</td>
                            <td>{stats.agility}</td>
                            <td>{stats.magic}</td>
                            <td>{stats.luck}</td>
                            <td>{stats.np}</td>
                            <td>{stats.deity}</td>
                        </tr>
                    </tbody>
                </Table>
            </>
        );
    }
}

export default ServantProfileStats;
