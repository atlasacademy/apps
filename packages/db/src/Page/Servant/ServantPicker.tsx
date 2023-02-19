import React from "react";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { Region, Servant } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import SearchableSelect from "../../Component/SearchableSelect";
import { lang } from "../../Setting/Manager";

interface IProps extends RouteComponentProps {
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
        const servants = this.props.servants.slice().reverse(),
            servantLabels = new Map<number, string>(
                servants.map((servant) => [servant.collectionNo, getSearchString(servant)])
            ),
            servantNiceLabels = new Map(servants.map((servant) => [servant.collectionNo, getSelectString(servant)]));

        return (
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
        );
    }
}

export default withRouter(ServantPicker);
