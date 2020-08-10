import {Servant} from "@atlasacademy/api-connector";
import React from "react";

import "./ServantPortrait.css";

const arrowImage = 'assets/img_arrow_load.png';

interface AssetReference {
    assetType: "ascension" | "costume";
    assetId: number;
}

interface IProps {
    servant: Servant;
    assetType?: "ascension" | "costume";
    assetId?: number;
    updatePortraitCallback: Function;
}

class ServantPortrait extends React.Component<IProps> {
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

        const assetMap = this.props.servant.extraAssets.charaGraph;
        const assetArray: AssetReference[] = [];

        if (assetMap.ascension) {
            Object.keys(assetMap.ascension).forEach(key => {
                assetArray.push({
                    assetType: 'ascension',
                    assetId: parseInt(key),
                });
            })
        }

        if (assetMap.costume) {
            Object.keys(assetMap.costume).forEach(key => {
                assetArray.push({
                    assetType: 'costume',
                    assetId: parseInt(key),
                });
            })
        }

        return assetArray;
    }

    private getAssetLocation(): string | undefined {
        if (
            this.props.assetType === undefined
            || this.props.assetId === undefined
            || !this.props.servant.extraAssets.charaGraph
        )
            return undefined;

        if (this.props.assetType === 'ascension') {
            const assets = this.props.servant.extraAssets.charaGraph.ascension;

            return assets ? assets[this.props.assetId] : undefined;
        }

        if (this.props.assetType === 'costume') {
            const assets = this.props.servant.extraAssets.charaGraph.costume;

            return assets ? assets[this.props.assetId] : undefined;
        }

        return undefined;
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
