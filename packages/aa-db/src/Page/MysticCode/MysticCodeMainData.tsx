import {MysticCode, Region} from "@atlasacademy/api-connector";
import React from "react";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";

interface IProps {
    region: Region;
    mysticCode: MysticCode;
}

class MysticCodeMainData extends React.Component<IProps> {
    render() {
        const mysticCode = this.props.mysticCode;

        return (
            <div>
                <h1>
                    {mysticCode.name}
                </h1>

                <DataTable data={{
                    "Data": <RawDataViewer data={mysticCode}/>,
                    "Raw": <RawDataViewer
                        data={`https://api.atlasacademy.io/raw/${this.props.region}/MC/${mysticCode.id}?expand=true`}/>,
                    "ID": mysticCode.id,
                    "Name": mysticCode.name,
                    "Detail": mysticCode.detail,
                }}/>
            </div>
        );
    }
}

export default MysticCodeMainData;
