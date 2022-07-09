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
                data={[
                    { label: "Raw", value: <RawDataViewer data={this.props.dataVal} /> },
                    ...Object.entries(this.props.dataVal).map(([label, value]) => {
                        return { label, value };
                    }),
                ]}
            />
        );
    }
}

export default DataValMainData;
