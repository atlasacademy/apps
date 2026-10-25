import React from "react";
import { FormSelect } from "react-bootstrap";

import { MysticCode, Region } from "@atlasacademy/api-connector";

import { withRouter } from "../../Routing";
import { RouteComponentProps } from "../../Routing";
import { lang } from "../../Setting/Manager";

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
            <FormSelect
                onChange={(ev) => {
                    this.changeMysticCode(parseInt(ev.target.value));
                }}
                value={this.props.id}
                className="mt-2"
                lang={lang(this.props.region)}
            >
                {this.props.mysticCodes.map((mysticCode) => {
                    return (
                        <option key={mysticCode.id} value={mysticCode.id}>
                            {mysticCode.name}
                        </option>
                    );
                })}
            </FormSelect>
        );
    }
}

export default withRouter(MysticCodePicker);
