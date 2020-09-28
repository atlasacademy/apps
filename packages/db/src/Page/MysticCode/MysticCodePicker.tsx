import {Region} from "@atlasacademy/api-connector";
import MysticCodeBasic from "@atlasacademy/api-connector/dist/Schema/MysticCodeBasic";
import React from "react";
import {FormControl} from "react-bootstrap";
import {withRouter} from "react-router";
import {RouteComponentProps} from "react-router-dom";

interface Event extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    mysticCodes: MysticCodeBasic[];
}

class MysticCodePicker extends React.Component<IProps> {
    private changeMysticCode(id: number) {
        this.props.history.push(`/${this.props.region}/mystic-code/${id}`);
    }

    render() {
        return (
            <div>
                Jump to:
                <FormControl as={"select"} custom
                             onChange={(ev: Event) => {
                                 this.changeMysticCode(parseInt(ev.target.value));
                             }}
                             value={this.props.id}>
                    {this.props.mysticCodes
                        .map((mysticCode, index) => {
                            return (
                                <option key={index} value={mysticCode.id}>
                                    {mysticCode.name}
                                </option>
                            );
                        })
                    }
                </FormControl>
            </div>
        );
    }
}

export default withRouter(MysticCodePicker);
