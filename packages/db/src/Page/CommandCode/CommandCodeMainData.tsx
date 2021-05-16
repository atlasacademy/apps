import {CommandCode, Region} from "@atlasacademy/api-connector";
import {Host} from "../../Api";
import React from "react";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import RarityDescriptor from "../../Descriptor/RarityDescriptor";
import { handleNewLine } from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    commandCode: CommandCode.CommandCode;
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
                    "ID": commandCode.id,
                    "Collection": commandCode.collectionNo,
                    "Name": commandCode.name,
                    "Rarity": <RarityDescriptor rarity={commandCode.rarity}/>,
                    "Illustrator": commandCode.illustrator,
                    "Comment": handleNewLine(commandCode.comment),
                }}/>
                <span>
                    <RawDataViewer text="Nice" data={commandCode}/>
                    <RawDataViewer
                        text="Raw"
                        data={`${Host}/raw/${this.props.region}/CC/${commandCode.id}?expand=true`}/>
                </span>
            </div>
        );
    }
}

export default CommandCodeMainData;
