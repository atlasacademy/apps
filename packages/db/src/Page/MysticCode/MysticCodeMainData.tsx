import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

import { MysticCode, Region } from "@atlasacademy/api-connector";

import { Host } from "../../Api";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import { lang } from "../../Setting/Manager";

import "../../Helper/StringHelper.css";

interface IProps extends WithTranslation {
    region: Region;
    mysticCode: MysticCode.MysticCode;
}

class MysticCodeMainData extends React.Component<IProps> {
    render() {
        const mysticCode = this.props.mysticCode;
        const t = this.props.t;
        return (
            <div>
                <h1 lang={lang(this.props.region)}>{mysticCode.name}</h1>

                <DataTable
                    data={[
                        { label: t("ID"), value: mysticCode.id },
                        { label: t("Name"), value: <span lang={lang(this.props.region)}>{mysticCode.name}</span> },
                        {
                            label: t("Original Name"),
                            value: <span lang={lang(this.props.region)}>{mysticCode.originalName}</span>,
                            hidden: mysticCode.name === mysticCode.originalName,
                        },
                        {
                            label: t("Detail"),
                            value: (
                                <span className="newline" lang={lang(this.props.region)}>
                                    {mysticCode.detail}
                                </span>
                            ),
                        },
                    ]}
                />
                <span>
                    <RawDataViewer text="Nice" data={mysticCode} />
                    <RawDataViewer
                        text="Raw"
                        data={`${Host}/raw/${this.props.region}/MC/${mysticCode.id}?expand=true`}
                    />
                </span>
            </div>
        );
    }
}

export default withTranslation()(MysticCodeMainData);
