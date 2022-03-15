import React from "react";

import { Buff, DataVal, Region } from "@atlasacademy/api-connector";
import { BuffDescriptor } from "@atlasacademy/api-descriptor";

import Description from "./Description";

interface IProps {
    region: Region;
    buff: Buff.Buff;
    dataVal: DataVal.DataVal;
}

class BuffValueDescription extends React.Component<IProps> {
    static renderAsString(buff: Buff.Buff, dataVal: DataVal.DataVal): string {
        const descriptor = BuffDescriptor.describeValue(buff, dataVal);

        return descriptor ? Description.renderAsString(descriptor) : "-";
    }

    render() {
        const descriptor = BuffDescriptor.describeValue(this.props.buff, this.props.dataVal);

        return descriptor ? <Description region={this.props.region} descriptor={descriptor} /> : "-";
    }
}

export default BuffValueDescription;
