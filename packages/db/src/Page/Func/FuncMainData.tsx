import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Link } from "react-router";

import { Func, Region } from "@atlasacademy/api-connector";

import { Host } from "../../Api";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import BuffDescription from "../../Descriptor/BuffDescription";
import TraitDescription from "../../Descriptor/TraitDescription";
import { lang } from "../../Setting/Manager";

interface IProps extends WithTranslation {
    region: Region;
    func: Func.Func;
}

class FuncMainData extends React.Component<IProps> {
    render() {
        const func = this.props.func;
        const t = this.props.t;

        return (
            <>
                <DataTable
                    responsive
                    data={[
                        { label: t("ID"), value: func.funcId },
                        {
                            label: t("Type"),
                            value: (
                                <Link to={`/${this.props.region}/funcs?type=${func.funcType}`}>{func.funcType}</Link>
                            ),
                        },
                        { label: t("Target"), value: func.funcTargetType },
                        {
                            label: t("Affects Players/Enemies"),
                            value: new Map<Func.FuncTargetTeam, string>([
                                [Func.FuncTargetTeam.ENEMY, t("FuncTargetTeam.ENEMY")],
                                [Func.FuncTargetTeam.PLAYER, t("FuncTargetTeam.PLAYER")],
                                [Func.FuncTargetTeam.PLAYER_AND_ENEMY, t("FuncTargetTeam.PLAYER_AND_ENEMY")],
                            ]).get(func.funcTargetTeam),
                        },
                        {
                            label: t("Popup Text"),
                            value: <span lang={lang(this.props.region)}>{func.funcPopupText}</span>,
                        },
                        {
                            label: t("Target Traits"),
                            value: (
                                <div>
                                    {func.functvals.map((trait) => {
                                        return (
                                            <TraitDescription key={trait.id} region={this.props.region} trait={trait} />
                                        );
                                    })}
                                </div>
                            ),
                        },
                        {
                            label: t("Affects Traits"),
                            value: (
                                <div>
                                    {func.traitVals?.map((trait) => {
                                        return (
                                            <TraitDescription
                                                key={trait.id}
                                                region={this.props.region}
                                                trait={trait}
                                                owner="buffs"
                                                ownerParameter="vals"
                                            />
                                        );
                                    })}
                                </div>
                            ),
                        },
                        {
                            label: t("Buff"),
                            value: (
                                <div>
                                    {func.buffs.map((buff) => {
                                        return <BuffDescription key={buff.id} region={this.props.region} buff={buff} />;
                                    })}
                                </div>
                            ),
                        },
                    ]}
                />
                <div style={{ marginBottom: "3%" }}>
                    <RawDataViewer text="Nice" data={func} />
                    <RawDataViewer
                        text="Raw"
                        data={`${Host}/raw/${this.props.region}/function/${func.funcId}?expand=true`}
                    />
                </div>
            </>
        );
    }
}

export default withTranslation()(FuncMainData);
