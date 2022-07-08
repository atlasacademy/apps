import React from "react";
import { Table } from "react-bootstrap";
import { withTranslation, WithTranslation } from "react-i18next";

import { Profile, Region } from "@atlasacademy/api-connector";

interface IProps extends WithTranslation {
    region: Region;
    profile?: Profile.Profile;
}

class ServantProfileStats extends React.Component<IProps> {
    render() {
        const t = this.props.t;
        const stats = this.props.profile?.stats;

        if (stats === undefined) return <></>;

        return (
            <>
                <h3>{t("Parameter")}</h3>

                <Table responsive>
                    <thead>
                        <tr>
                            <th>{t("Strength")}</th>
                            <th>{t("Endurance")}</th>
                            <th>{t("Agility")}</th>
                            <th>{t("Magic")}</th>
                            <th>{t("Luck")}</th>
                            <th>{t("NP")}</th>
                            <th>{t("Divinity")}</th>
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

export default withTranslation()(ServantProfileStats);
