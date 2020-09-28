import {Region} from "@atlasacademy/api-connector";
import CommandCodeBasic from "@atlasacademy/api-connector/dist/Schema/CommandCodeBasic";
import React from "react";
import {FormControl} from "react-bootstrap";
import {withRouter} from "react-router";
import {RouteComponentProps} from "react-router-dom";

interface Event extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    commandCodes: CommandCodeBasic[];
}

class CommandCodePicker extends React.Component<IProps> {
    private changeCommandCode(id: number) {
        this.props.history.push(`/${this.props.region}/command-code/${id}`);
    }

    render() {
        return (
            <div>
                Jump to:
                <FormControl as={"select"} custom
                             onChange={(ev: Event) => {
                                 this.changeCommandCode(parseInt(ev.target.value));
                             }}
                             value={this.props.id}>
                    {this.props.commandCodes
                        .slice()
                        .reverse()
                        .map((commandCode, index) => {
                            return (
                                <option key={index} value={commandCode.id}>
                                    {commandCode.name}
                                </option>
                            );
                        })
                    }
                </FormControl>
            </div>
        );
    }
}

export default withRouter(CommandCodePicker);
