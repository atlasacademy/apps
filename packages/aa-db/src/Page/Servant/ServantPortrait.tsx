import React from "react";
import {AssetMap} from "../../Api/Data/AssetCollection";
import Servant from "../../Api/Data/Servant";

import "./ServantPortrait.css";

const arrowImage = 'assets/img_arrow_load.png';

interface AssetReference {
    assetType: string;
    assetId: string;
}

interface IProps {
    servant: Servant;
    assetType?: string;
    assetId?: string;
    updatePortraitCallback: Function;
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

    private getAssetArray(): AssetReference[] {
        if (!this.props.servant.extraAssets.charaGraph)
            return [];

        const assetArray: AssetReference[] = [];

        Object.keys(this.props.servant.extraAssets.charaGraph).forEach(assetType => {
            const assetMap = this.props.servant.extraAssets.charaGraph[assetType];
            if (!assetMap)
                return;

            Object.keys(assetMap).forEach(assetId => {
                assetArray.push({assetType, assetId});
            });
        });

        return assetArray;
    }

    private getAssetLocation(): string | undefined {
        if (!this.props.assetType || !this.props.assetId)
            return undefined;

        const assetMap = this.props.servant.extraAssets.charaGraph[this.props.assetType];
        if (!assetMap)
            return undefined;

        return assetMap[this.props.assetId];
    }

    private getArrow(assetArray: AssetReference[], next: boolean) {
        let index: number | undefined = undefined;

        assetArray.find((assetReference, i) => {
            if (assetReference.assetType === this.props.assetType
                && assetReference.assetId === this.props.assetId) {
                index = i;

                return true;
            }

            return false;
        });

        if (index === undefined)
            return undefined;

        let targetReference: AssetReference | undefined;
        if (next && index + 1 < assetArray.length)
            targetReference = assetArray[index + 1];
        if (!next && index > 0)
            targetReference = assetArray[index - 1];

        if (targetReference === undefined)
            return undefined;

        return <img alt={''}
                    className={`arrow ${next ? '' : 'back'}`}
                    src={arrowImage}
                    onClick={() => {
                        this.props.updatePortraitCallback.call(
                            null,
                            targetReference?.assetType,
                            targetReference?.assetId
                        );
                    }}/>;
    }

    render() {
        const assetArray = this.getAssetArray();

        return (
            <div>
                <div id={'servant-portrait'}>
                    {this.getArrow(assetArray, false)}
                    {this.getArrow(assetArray, true)}
                    <img alt={this.props.servant.name}
                         id={'servant-portrait-image'}
                         src={this.getAssetLocation()}/>
                </div>
            </div>
        );
    }
}

export default ServantPortrait;
