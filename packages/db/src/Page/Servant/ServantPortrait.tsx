import React from "react";

import { Servant } from "@atlasacademy/api-connector";

import img_arrow_load from "../../Assets/img_arrow_load.png";

import "./ServantPortrait.css";

type PortraitAssetType = "ascension" | "costume";

interface AssetReference {
    assetType: PortraitAssetType;
    assetId: number;
    assetExpand: boolean;
}

interface IProps {
    servant: Servant.Servant;
    assetType?: PortraitAssetType;
    assetId?: number;
    assetExpand?: boolean;
    updatePortraitCallback: (assetType?: PortraitAssetType, assetId?: number, expand?: boolean) => void;
}

class ServantPortrait extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);

        const assetMap =
                props.servant.extraAssets.charaGraph.ascension ??
                Object.values(props.servant.extraAssets.charaGraph).shift(),
            assetKey = assetMap === undefined ? undefined : Object.keys(assetMap).shift();

        this.state = { assetMap, assetKey };
    }

    private getAssetArray(): AssetReference[] {
        if (!this.props.servant.extraAssets.charaGraph) return [];

        const assetMap = this.props.servant.extraAssets.charaGraph;
        const assetArray: AssetReference[] = [];

        if (assetMap.ascension) {
            Object.keys(assetMap.ascension).forEach((key) => {
                assetArray.push({
                    assetType: "ascension",
                    assetId: parseInt(key),
                    assetExpand: false,
                });
            });
        }

        if (assetMap.costume) {
            Object.keys(assetMap.costume).forEach((key) => {
                assetArray.push({
                    assetType: "costume",
                    assetId: parseInt(key),
                    assetExpand: false,
                });
            });
        }

        const assetMapExpand = this.props.servant.extraAssets.charaGraphEx;

        if (assetMapExpand.ascension) {
            Object.keys(assetMapExpand.ascension).forEach((key) => {
                assetArray.push({
                    assetType: "ascension",
                    assetId: parseInt(key),
                    assetExpand: true,
                });
            });
        }

        if (assetMapExpand.costume) {
            Object.keys(assetMapExpand.costume).forEach((key) => {
                assetArray.push({
                    assetType: "costume",
                    assetId: parseInt(key),
                    assetExpand: true,
                });
            });
        }

        return assetArray;
    }

    private getAssetLocation(): string | undefined {
        if (
            this.props.assetType === undefined ||
            this.props.assetId === undefined ||
            !this.props.servant.extraAssets.charaGraph
        )
            return undefined;

        if (this.props.assetType === "ascension") {
            const assets = this.props.assetExpand
                ? this.props.servant.extraAssets.charaGraphEx.ascension
                : this.props.servant.extraAssets.charaGraph.ascension;

            return assets ? assets[this.props.assetId] : undefined;
        }

        if (this.props.assetType === "costume") {
            const assets = this.props.assetExpand
                ? this.props.servant.extraAssets.charaGraphEx.costume
                : this.props.servant.extraAssets.charaGraph.costume;

            return assets ? assets[this.props.assetId] : undefined;
        }

        return undefined;
    }

    private getArrow(assetArray: AssetReference[], next: boolean) {
        let index: number | undefined = undefined;

        assetArray.find((assetReference, i) => {
            if (
                assetReference.assetType === this.props.assetType &&
                assetReference.assetId === this.props.assetId &&
                assetReference.assetExpand === this.props.assetExpand
            ) {
                index = i;

                return true;
            }

            return false;
        });

        if (index === undefined) return undefined;

        let targetReference: AssetReference | undefined;
        if (next && index + 1 < assetArray.length) targetReference = assetArray[index + 1];
        if (!next && index > 0) targetReference = assetArray[index - 1];

        if (targetReference === undefined) return undefined;

        return (
            <img
                alt={`${next ? "Next" : "Previous"} Servant Saint Graph`}
                className={`arrow ${next ? "" : "back"}`}
                src={img_arrow_load}
                onClick={() => {
                    this.props.updatePortraitCallback(
                        targetReference?.assetType,
                        targetReference?.assetId,
                        targetReference?.assetExpand
                    );
                }}
            />
        );
    }

    render() {
        const assetArray = this.getAssetArray();

        return (
            <div>
                <div id={"servant-portrait"}>
                    {this.getArrow(assetArray, false)}
                    {this.getArrow(assetArray, true)}
                    <img
                        alt={this.props.servant.name}
                        id={"servant-portrait-image"}
                        width={512}
                        height={724}
                        src={this.getAssetLocation()}
                    />
                </div>
            </div>
        );
    }
}

export default ServantPortrait;
