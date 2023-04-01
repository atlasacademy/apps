import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

import { MysticCode, Region } from "@atlasacademy/api-connector";

import Api from "../../Api";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import { lang } from "../../Setting/Manager";

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
                                <span className="text-prewrap" lang={lang(this.props.region)}>
                                    {mysticCode.detail}
                                </span>
                            ),
                        },
                    ]}
                />
                <span>
                    <RawDataViewer
                        text="Nice"
                        data={mysticCode}
                        url={Api.getUrl("nice", "MC", mysticCode.id, { expand: true })}
                    />
                    <RawDataViewer text="Raw" data={Api.getUrl("raw", "MC", mysticCode.id, { expand: true })} />
                </span>
            </div>
        );
    }
}

export default withTranslation()(MysticCodeMainData);
