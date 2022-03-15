import React from "react";

import { DataVal } from "@atlasacademy/api-connector";

import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";

interface IProps {
    dataVal: DataVal.DataVal;
}

class DataValMainData extends React.Component<IProps> {
    render() {
        return (
            <DataTable
                data={{
                    Raw: <RawDataViewer data={this.props.dataVal} />,
                    ...this.props.dataVal,
                }}
            />
        );
    }
}

export default DataValMainData;
