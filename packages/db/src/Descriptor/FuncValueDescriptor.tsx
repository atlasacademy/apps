import React from "react";

import { DataVal, Func, Region } from "@atlasacademy/api-connector";
import { FuncDescriptor } from "@atlasacademy/api-descriptor";

import Description from "./Description";

interface IProps {
    region: Region;
    func: Func.BasicFunc;
    staticDataVal: DataVal.DataVal;
    dataVal: DataVal.DataVal;
    hideRate?: boolean;
}

class FuncValueDescriptor extends React.Component<IProps> {
    render() {
        const descriptor = FuncDescriptor.describeValue(
            this.props.func,
            this.props.staticDataVal,
            this.props.dataVal,
            this.props.hideRate
        );

        return descriptor ? <Description region={this.props.region} descriptor={descriptor} /> : "-";
    }
}

export default FuncValueDescriptor;
