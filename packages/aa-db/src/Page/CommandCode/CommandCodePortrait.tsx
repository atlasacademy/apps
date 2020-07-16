import React from "react";
import {AssetMap} from "../../Api/Data/AssetCollection";
import CommandCode from "../../Api/Data/CommandCode";

import "./CommandCodePortrait.css";

interface IProps {
    commandCode: CommandCode;
}

interface IState {
    assetMap?: AssetMap;
    assetKey?: string;
}

class CommandCodePortrait extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const assetMap = (
                props.commandCode.extraAssets.charaGraph.ascension
                ?? Object.values(props.commandCode.extraAssets.charaGraph).shift()
            ),
            assetKey = assetMap === undefined ? undefined : Object.keys(assetMap).shift();

        this.state = {assetMap, assetKey};
    }

    render() {
        return (
            <div>
                <img alt={this.props.commandCode.name}
                     id={'command-code-portrait'}
                     src={(
                         this.state.assetMap && this.state.assetKey
                             ? this.state.assetMap[this.state.assetKey]
                             : undefined
                     )}/>
            </div>
        );
    }
}

export default CommandCodePortrait;
