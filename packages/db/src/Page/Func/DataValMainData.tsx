import React from "react";
import { Link } from "react-router-dom";

import { DataVal, Region } from "@atlasacademy/api-connector";

import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";

interface IProps {
    region: Region;
    dataVal: DataVal.DataVal;
}

class DataValMainData extends React.Component<IProps> {
    render() {
        return (
            <DataTable
                data={[
                    { label: "Raw", value: <RawDataViewer data={this.props.dataVal} /> },
                    ...Object.entries(this.props.dataVal).map(([label, value]) => {
                        switch (label) {
                            case "DependFuncId":
                                return {
                                    label,
                                    value: <Link to={`/${this.props.region}/func/${value}`}>{value}</Link>,
                                };
                            case "DependFunc":
                            case "DependFuncVals":
                                return {
                                    label,
                                    value: (
                                        <div className="text-prewrap text-left">
                                            <code>{JSON.stringify(value, null, 2)}</code>
                                        </div>
                                    ),
                                };
                            default:
                                return { label, value };
                        }
                    }),
                ]}
            />
        );
    }
}

export default DataValMainData;
