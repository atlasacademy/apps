import { AxiosError } from "axios";
import React from "react";
import { Alert, Table } from "react-bootstrap";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Buff, Region } from "@atlasacademy/api-connector";

import Api, { Host } from "../Api";
import BuffClassRelationOverwrite from "../Component/BuffClassRelationOverwrite";
import BuffIcon from "../Component/BuffIcon";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import FuncDescriptor from "../Descriptor/FuncDescriptor";
import TraitDescription from "../Descriptor/TraitDescription";
import { mergeElements } from "../Helper/OutputHelper";
import Manager, { lang } from "../Setting/Manager";

import "../Helper/StringHelper.css";

interface IProps extends WithTranslation {
    region: Region;
    id: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    buff?: Buff.Buff;
}

class BuffPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadBuff();
    }

    loadBuff() {
        Api.buff(this.props.id)
            .then((buff) => {
                document.title = `[${this.props.region}] Buff - ${buff.id} - Atlas Academy DB`;
                this.setState({ buff, loading: false });
            })
            .catch((error) => this.setState({ error }));
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.buff) return <Loading />;

        const { t, region } = this.props;
        const buff = this.state.buff;

        return (
            <div>
                <h1>
                    {buff.icon ? <BuffIcon location={buff.icon} height={48} /> : undefined}
                    {buff.icon ? " " : undefined}
                    {buff.name}
                </h1>

                <br />

                <DataTable
                    data={[
                        { label: "ID", value: buff.id },
                        {
                            label: t("Name"),
                            value: <span lang={lang(region)}>{buff.name}</span>,
                        },
                        {
                            label: t("Detail"),
                            value: (
                                <span className="newline" lang={lang(region)}>
                                    {buff.detail}
                                </span>
                            ),
                        },
                        {
                            label: t("Type"),
                            value: <Link to={`/${this.props.region}/buffs?type=${buff.type}`}>{buff.type}</Link>,
                        },
                        { label: t("Buff Group"), value: buff.buffGroup },
                        {
                            label: t("Buff Traits"),
                            value: (
                                <div>
                                    {mergeElements(
                                        buff.vals.map((trait) => (
                                            <TraitDescription
                                                region={this.props.region}
                                                trait={trait}
                                                owner="buffs"
                                                ownerParameter="vals"
                                            />
                                        )),
                                        " "
                                    )}
                                </div>
                            ),
                        },
                        {
                            label: t("Target Traits"),
                            value: (
                                <div>
                                    {mergeElements(
                                        buff.tvals.map((trait) => (
                                            <TraitDescription
                                                region={this.props.region}
                                                trait={trait}
                                                owner="buffs"
                                                ownerParameter="tvals"
                                            />
                                        )),
                                        " "
                                    )}
                                </div>
                            ),
                        },
                        {
                            label: t("Required Self Traits"),
                            value: (
                                <div>
                                    {mergeElements(
                                        buff.ckSelfIndv.map((trait) => (
                                            <TraitDescription
                                                region={this.props.region}
                                                trait={trait}
                                                owner="buffs"
                                                ownerParameter="vals"
                                            />
                                        )),
                                        " "
                                    )}
                                </div>
                            ),
                        },
                        {
                            label: t("Required Opponent Traits"),
                            value: (
                                <div>
                                    {mergeElements(
                                        buff.ckOpIndv.map((trait) => (
                                            <TraitDescription region={this.props.region} trait={trait} />
                                        )),
                                        " "
                                    )}
                                </div>
                            ),
                        },
                    ]}
                />
                <div style={{ marginBottom: "3%" }}>
                    <RawDataViewer text="Nice" data={buff} />
                    <RawDataViewer text="Raw" data={`${Host}/raw/${this.props.region}/buff/${buff.id}`} />
                </div>

                {buff.script.relationId !== undefined ? (
                    <Alert variant="success">
                        <BuffClassRelationOverwrite relations={buff.script.relationId} />
                    </Alert>
                ) : undefined}

                <h3>{t("Related Functions")}</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>{t("Function")}</th>
                            <th>{t("Usage Count")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buff.reverse?.basic?.function
                            ? buff.reverse.basic.function.map((func) => {
                                  return (
                                      <tr key={func.funcId}>
                                          <td>
                                              <FuncDescriptor region={this.props.region} func={func} />
                                          </td>
                                          <td>
                                              {(func.reverse?.basic?.NP ?? []).length +
                                                  (func.reverse?.basic?.skill ?? []).length}
                                          </td>
                                      </tr>
                                  );
                              })
                            : undefined}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default withTranslation()(BuffPage);
