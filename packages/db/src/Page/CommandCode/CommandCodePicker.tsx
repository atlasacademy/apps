import React from "react";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { CommandCode, Region } from "@atlasacademy/api-connector";

import SearchableSelect from "../../Component/SearchableSelect";
import { lang } from "../../Setting/Manager";

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    commandCodes: CommandCode.CommandCodeBasic[];
}

class CommandCodePicker extends React.Component<IProps> {
    private changeCommandCode(id: number) {
        this.props.history.push(`/${this.props.region}/command-code/${id}`);
    }

    render() {
        const commandCodes = this.props.commandCodes.slice().reverse(),
            commandCodeLabels = new Map<number, string>(
                commandCodes.map((commandCode) => [
                    commandCode.collectionNo,
                    `${commandCode.collectionNo.toString().padStart(3, "0")} - ${commandCode.name}`,
                ])
            );

        return (
            <SearchableSelect<number>
                id="commandCodePicker"
                lang={lang(this.props.region)}
                options={commandCodes.map((commandCodes) => commandCodes.collectionNo)}
                labels={commandCodeLabels}
                selected={this.props.id}
                selectedAsPlaceholder={true}
                hideSelected={true}
                hideReset={true}
                disableLabelStyling={true}
                maxResults={20}
                onChange={(value?: number) => {
                    if (value) {
                        this.changeCommandCode(value);
                    }
                }}
            />
        );
    }
}
export default withRouter(CommandCodePicker);
