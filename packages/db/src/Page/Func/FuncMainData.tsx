import React from "react";
import { Col, Row } from "react-bootstrap";
import { WithTranslation, withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Func, Region } from "@atlasacademy/api-connector";

import Api from "../../Api";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import BuffDescription from "../../Descriptor/BuffDescription";
import TraitDescription from "../../Descriptor/TraitDescription";
import { mergeElements } from "../../Helper/OutputHelper";
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
                                    {mergeElements(
                                        func.overWriteTvalsList.map((traits) => (
                                            <>
                                                (
                                                {mergeElements(
                                                    traits.map((trait) => (
                                                        <TraitDescription region={this.props.region} trait={trait} />
                                                    )),
                                                    " and "
                                                )}
                                                )
                                            </>
                                        )),
                                        " or "
                                    )}
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
                <Row className="mb-3">
                    <Col>
                        <RawDataViewer
                            text="Nice"
                            data={func}
                            url={Api.getUrl("nice", "function", func.funcId, { expand: true })}
                        />
                    </Col>
                    <Col>
                        <RawDataViewer text="Raw" data={Api.getUrl("raw", "function", func.funcId, { expand: true })} />
                    </Col>
                </Row>
            </>
        );
    }
}

export default withTranslation()(FuncMainData);
