import React from "react";

import { MysticCode, Region } from "@atlasacademy/api-connector";

import { Host } from "../../Api";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import { lang } from "../../Setting/Manager";

import "../../Helper/StringHelper.css";

interface IProps {
    region: Region;
    mysticCode: MysticCode.MysticCode;
}

class MysticCodeMainData extends React.Component<IProps> {
    render() {
        const mysticCode = this.props.mysticCode;

        return (
            <div>
                <h1 lang={lang(this.props.region)}>{mysticCode.name}</h1>

                <DataTable
                    data={{
                        ID: mysticCode.id,
                        Name: <span lang={lang(this.props.region)}>{mysticCode.name}</span>,
                        ...(mysticCode.name !== mysticCode.originalName && {
                            "Original Name": <span lang={lang(this.props.region)}>{mysticCode.originalName}</span>,
                        }),
                        Detail: (
                            <span className="newline" lang={lang(this.props.region)}>
                                {mysticCode.detail}
                            </span>
                        ),
                    }}
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

export default MysticCodeMainData;
