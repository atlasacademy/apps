import React from "react";

import { CommandCode, Region } from "@atlasacademy/api-connector";

import { Host } from "../../Api";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import IllustratorDescriptor from "../../Descriptor/IllustratorDescriptor";
import RarityDescriptor from "../../Descriptor/RarityDescriptor";
import getRubyText from "../../Helper/StringHelper";
import { lang } from "../../Setting/Manager";

import "../../Helper/StringHelper.css";

interface IProps {
    region: Region;
    commandCode: CommandCode.CommandCode;
}

class CommandCodeMainData extends React.Component<IProps> {
    render() {
        const commandCode = this.props.commandCode;

        return (
            <div>
                <h1 lang={lang(this.props.region)}>{commandCode.name}</h1>

                <DataTable
                    data={{
                        ID: commandCode.id,
                        Collection: commandCode.collectionNo,
                        Name: <span lang={lang(this.props.region)}>{commandCode.name}</span>,
                        ...(commandCode.name !== commandCode.originalName && {
                            "Original Name": (
                                <span lang={lang(this.props.region)}>
                                    {getRubyText(this.props.region, commandCode.originalName, commandCode.ruby)}
                                </span>
                            ),
                        }),
                        ...(commandCode.name === commandCode.originalName &&
                            commandCode.name !== commandCode.ruby &&
                            commandCode.ruby !== "-" && { Ruby: commandCode.ruby }),
                        Rarity: <RarityDescriptor rarity={commandCode.rarity} />,
                        Illustrator: (
                            <IllustratorDescriptor
                                region={this.props.region}
                                illustrator={commandCode.illustrator}
                                hideTypeText={true}
                            />
                        ),
                        Comment: (
                            <span className="newline" lang={lang(this.props.region)}>
                                {commandCode.comment}
                            </span>
                        ),
                    }}
                />
                <span>
                    <RawDataViewer text="Nice" data={commandCode} />
                    <RawDataViewer
                        text="Raw"
                        data={`${Host}/raw/${this.props.region}/CC/${commandCode.id}?expand=true`}
                    />
                </span>
            </div>
        );
    }
}

export default CommandCodeMainData;
