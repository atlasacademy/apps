import {CommandCode, Region} from "@atlasacademy/api-connector";
import React from "react";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import RarityDescriptor from "../../Descriptor/RarityDescriptor";

interface IProps {
    region: Region;
    commandCode: CommandCode;
}

class CommandCodeMainData extends React.Component<IProps> {
    render() {
        const commandCode = this.props.commandCode;

        return (
            <div>
                <h1>
                    {commandCode.name}
                </h1>

                <DataTable data={{
                    "Data": <RawDataViewer data={commandCode}/>,
                    "Raw": <RawDataViewer
                        data={`https://api.atlasacademy.io/raw/${this.props.region}/CC/${commandCode.id}?expand=true`}/>,
                    "ID": commandCode.id,
                    "Collection": commandCode.collectionNo,
                    "Name": commandCode.name,
                    "Rarity": <RarityDescriptor rarity={commandCode.rarity}/>,
                    "Comment": commandCode.comment,
                }}/>
            </div>
        );
    }
}

export default CommandCodeMainData;
