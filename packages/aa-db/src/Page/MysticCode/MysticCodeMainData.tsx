import React from "react";
import MysticCode from "../../Api/Data/MysticCode";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";

interface IProps {
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
                    "Raw": <RawDataViewer data={mysticCode}/>,
                    "ID": mysticCode.id,
                    "Name": mysticCode.name,
                    "Detail": mysticCode.detail,
                }}/>
            </div>
        );
    }
}

export default MysticCodeMainData;
