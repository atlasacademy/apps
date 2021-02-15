import {MysticCode, Region} from "@atlasacademy/api-connector";
import {Host} from "../../Api";
import React from "react";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";

interface IProps {
    region: Region;
    mysticCode: MysticCode.MysticCode;
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
                    "ID": mysticCode.id,
                    "Name": mysticCode.name,
                    "Detail": mysticCode.detail,
                }}/>
                <span>
                    <RawDataViewer text="Nice" data={mysticCode}/>
                    <RawDataViewer
                        text="Raw"
                        data={`${Host}/raw/${this.props.region}/MC/${mysticCode.id}?expand=true`}/>
                </span>
            </div>
        );
    }
}

export default MysticCodeMainData;
