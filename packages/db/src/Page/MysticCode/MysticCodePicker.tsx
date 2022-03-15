import React from "react";
import { FormControl } from "react-bootstrap";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { MysticCode, Region } from "@atlasacademy/api-connector";

interface Event extends React.ChangeEvent<HTMLInputElement> {}

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    mysticCodes: MysticCode.MysticCodeBasic[];
}

class MysticCodePicker extends React.Component<IProps> {
    private changeMysticCode(id: number) {
        this.props.history.push(`/${this.props.region}/mystic-code/${id}`);
    }

    render() {
        return (
            <div>
                Jump to:
                <FormControl
                    as={"select"}
                    custom
                    onChange={(ev: Event) => {
                        this.changeMysticCode(parseInt(ev.target.value));
                    }}
                    value={this.props.id}
                >
                    {this.props.mysticCodes.map((mysticCode) => {
                        return (
                            <option key={mysticCode.id} value={mysticCode.id}>
                                {mysticCode.name}
                            </option>
                        );
                    })}
                </FormControl>
            </div>
        );
    }
}

export default withRouter(MysticCodePicker);
