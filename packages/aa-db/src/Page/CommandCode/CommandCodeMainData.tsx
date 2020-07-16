import React from "react";
import CommandCode from "../../Api/Data/CommandCode";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import RarityDescriptor from "../../Descriptor/RarityDescriptor";

interface IProps {
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
                    "Raw": <RawDataViewer data={commandCode}/>,
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
