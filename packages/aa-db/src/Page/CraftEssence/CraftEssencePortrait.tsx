import React from "react";
import {AssetMap} from "../../Api/Data/AssetCollection";
import CraftEssence from "../../Api/Data/CraftEssence";

import "./CraftEssencePortrait.css";

interface IProps {
    craftEssence: CraftEssence;
}

interface IState {
    assetMap?: AssetMap;
    assetKey?: string;
}

class CraftEssencePortrait extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const assetMap = (
                props.craftEssence.extraAssets.charaGraph.ascension
                ?? Object.values(props.craftEssence.extraAssets.charaGraph).shift()
            ),
            assetKey = assetMap === undefined ? undefined : Object.keys(assetMap).shift();

        this.state = {assetMap, assetKey};
    }

    render() {
        return (
            <div>
                <img alt={this.props.craftEssence.name}
                     id={'craft-essence-portrait'}
                     src={(
                         this.state.assetMap && this.state.assetKey
                             ? this.state.assetMap[this.state.assetKey]
                             : undefined
                     )}/>
            </div>
        );
    }
}

export default CraftEssencePortrait;
