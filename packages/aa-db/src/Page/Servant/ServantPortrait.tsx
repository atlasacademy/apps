import React from "react";
import {AssetMap} from "../../Api/Data/ServantAsset";
import ServantEntity from "../../Api/Data/ServantEntity";

interface IProps {
    servant: ServantEntity;
}

interface IState {
    assetMap?: AssetMap;
    assetKey?: string;
}

class ServantPortrait extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const assetMap = (
                props.servant.extraAssets.charaGraph.ascension
                ?? Object.values(props.servant.extraAssets.charaGraph).shift()
            ),
            assetKey = assetMap === undefined ? undefined : Object.keys(assetMap).shift();

        this.state = {assetMap, assetKey};
    }

    render() {
        return (
            <div>
                <img alt={this.props.servant.name}
                     className={'profile'}
                     src={(
                         this.state.assetMap && this.state.assetKey
                             ? this.state.assetMap[this.state.assetKey]
                             : undefined
                     )}/>
            </div>
        );
    }
}

export default ServantPortrait;
