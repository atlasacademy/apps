import React from "react";
import { Form } from "react-bootstrap";
import { WithTranslation, withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { Region, Servant } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import SearchableSelect from "../../Component/SearchableSelect";
import { lang } from "../../Setting/Manager";

interface IProps extends RouteComponentProps, WithTranslation {
    region: Region;
    id: number;
    servants: Servant.ServantBasic[];
}

const getSelectString = (servant: Servant.ServantBasic) => {
    const classString = toTitleCase(servant.className);
    const selectString = `${servant.collectionNo.toString().padStart(3, "0")} - ${servant.name}`;

    if (!servant.name.includes(classString)) return `${selectString} (${classString})`;

    return selectString;
};

const getSearchString = (servant: Servant.ServantBasic) => {
    return (
        getSelectString(servant) +
        ` ${servant.overwriteName ?? ""} ${servant.originalName} ${servant.originalOverwriteName ?? ""}`
    );
};

class ServantPicker extends React.Component<IProps> {
    private changeServant(id: number) {
        this.props.history.push(`/${this.props.region}/servant/${id}`);
    }

    render() {
        const t = this.props.t;
        const servants = this.props.servants.slice().reverse(),
            servantLabels = new Map<number, string>(
                servants.map((servant) => [servant.collectionNo, getSearchString(servant)])
            ),
            servantNiceLabels = new Map(servants.map((servant) => [servant.collectionNo, getSelectString(servant)]));

        return (
            <div>
                <form>
                    <Form.Group>
                        <Form.Label>{t("Jump to")}:</Form.Label>
                        <SearchableSelect<number>
                            id="servantPicker"
                            lang={lang(this.props.region)}
                            options={servants.map((servant) => servant.collectionNo)}
                            labels={servantLabels}
                            niceLabels={servantNiceLabels}
                            selected={this.props.id}
                            selectedAsPlaceholder={true}
                            hideSelected={true}
                            hideReset={true}
                            disableLabelStyling={true}
                            maxResults={20}
                            onChange={(value?: number) => {
                                if (value) {
                                    this.changeServant(value);
                                }
                            }}
                        />
                    </Form.Group>
                </form>
            </div>
        );
    }
}

export default withRouter(withTranslation()(ServantPicker));
