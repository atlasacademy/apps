import React from "react";
import {Col, Row} from "react-bootstrap";
import NoblePhantasm from "../../Api/Data/NoblePhantasm";
import {getTargetVersionValues} from "../../Helper/FuncHelper";
import DataValMainData from "../Func/DataValMainData";
import FuncMainData from "../Func/FuncMainData";

interface IProps {
    noblePhantasm: NoblePhantasm;
    level: number;
    overcharge: number;
}

class NoblePhantasmVersion extends React.Component<IProps> {
    render() {
        return (
            <div>
                {this.props.noblePhantasm.functions.map((func, index) => {
                    const dataVal = getTargetVersionValues(func, this.props.level, this.props.overcharge);

                    return (
                        <div key={index}>
                            <h3>Effect #{index + 1}</h3>

                            <Row>
                                <Col xs={12} md={6}>
                                    <h5>Function</h5>
                                    <FuncMainData func={func}/>
                                </Col>
                                <Col xs={12} md={6}>
                                    <h5>Values</h5>
                                    <DataValMainData dataVal={dataVal}/>
                                </Col>
                            </Row>

                            <hr/>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default NoblePhantasmVersion;
