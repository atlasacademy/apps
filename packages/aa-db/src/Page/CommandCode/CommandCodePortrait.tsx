import {CommandCode} from "@atlasacademy/api-connector";
import React from "react";

import "./CommandCodePortrait.css";

interface IProps {
    commandCode: CommandCode;
}

class CommandCodePortrait extends React.Component<IProps> {

    private asset(): string | undefined {
        const assetMap = this.props.commandCode.extraAssets.charaGraph.cc;

        return assetMap ? Object.values(assetMap).shift() : undefined;
    }

    render() {
        const asset = this.asset();

        return (
            <div>
                <img alt={this.props.commandCode.name}
                     id={'command-code-portrait'}
                     src={asset}/>
            </div>
        );
    }
}

export default CommandCodePortrait;
