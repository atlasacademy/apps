import React from "react";
import { FormControl } from "react-bootstrap";
import { withTranslation, WithTranslation } from "react-i18next";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { MysticCode, Region } from "@atlasacademy/api-connector";

import { lang } from "../../Setting/Manager";

interface Event extends React.ChangeEvent<HTMLInputElement> {}

interface IProps extends RouteComponentProps, WithTranslation {
    region: Region;
    id: number;
    mysticCodes: MysticCode.MysticCodeBasic[];
}

class MysticCodePicker extends React.Component<IProps> {
    private changeMysticCode(id: number) {
        this.props.history.push(`/${this.props.region}/mystic-code/${id}`);
    }

    render() {
        const t = this.props.t;
        return (
            <div>
                {t("Jump to")}:
                <FormControl
                    as={"select"}
                    custom
                    onChange={(ev: Event) => {
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
                </FormControl>
            </div>
        );
    }
}

export default withRouter(withTranslation()(MysticCodePicker));
