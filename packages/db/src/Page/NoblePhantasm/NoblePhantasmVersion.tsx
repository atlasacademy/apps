import React from "react";
import { Col, Row } from "react-bootstrap";
import { WithTranslation, withTranslation } from "react-i18next";

import { NoblePhantasm, Region } from "@atlasacademy/api-connector";

import FuncDescriptor from "../../Descriptor/FuncDescriptor";
import { getTargetVersionValues } from "../../Helper/FuncHelper";
import DataValMainData from "../Func/DataValMainData";
import FuncMainData from "../Func/FuncMainData";

interface IProps extends WithTranslation {
    region: Region;
    noblePhantasm: NoblePhantasm.NoblePhantasm;
    level: number;
    overcharge: number;
}

class NoblePhantasmVersion extends React.Component<IProps> {
    render() {
        const t = this.props.t;
        return (
            <div>
                {this.props.noblePhantasm.functions.map((func, index) => {
                    const dataVal = getTargetVersionValues(func, this.props.level, this.props.overcharge);

                    return (
                        <div key={func.funcId}>
                            <h3>
                                {t("Effect")} #{index + 1}
                            </h3>
                            <p>
                                <FuncDescriptor
                                    region={this.props.region}
                                    func={func}
                                    level={this.props.level}
                                    overcharge={this.props.overcharge}
                                />
                            </p>

                            <Row>
                                <Col xs={12} md={6}>
                                    <h5>{t("Function")}</h5>
                                    <FuncMainData region={this.props.region} func={func} />
                                </Col>
                                <Col xs={12} md={6}>
                                    <h5>{t("Values")}</h5>
                                    <DataValMainData region={this.props.region} dataVal={dataVal ?? {}} />
                                </Col>
                            </Row>

                            <hr className="mt-0 mb-2" />
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default withTranslation()(NoblePhantasmVersion);
