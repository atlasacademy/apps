import React from "react";
import MysticCode, {MysticCodeAssetMap} from "../../Api/Data/MysticCode";

import "./MysticCodePortrait.css";

interface IProps {
    mysticCode: MysticCode;
}

interface IState {
    assetMap: MysticCodeAssetMap;
    assetKey?: string;
}

class MysticCodePortrait extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const assetMap = props.mysticCode.extraAssets.masterFace,
            assetKey = assetMap === undefined ? undefined : Object.keys(assetMap).shift();

        this.state = {assetMap, assetKey};
    }

    render() {
        return (
            <div id={'mystic-code-portrait-wrapper'}>
                <img alt={this.props.mysticCode.name}
                     id={'mystic-code-portrait'}
                     src={(
                         this.state.assetMap && this.state.assetKey
                             ? this.state.assetMap[this.state.assetKey]
                             : undefined
                     )}/>
            </div>
        );
    }
}

export default MysticCodePortrait;
