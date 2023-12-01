import React from "react";

import { CraftEssence } from "@atlasacademy/api-connector";

import img_arrow_load from "../../Assets/img_arrow_load.png";

import "./CraftEssencePortrait.css";

interface IState {
    assetType: "normal" | "male" | "ex";
}

interface IProps {
    craftEssence: CraftEssence.CraftEssence;
}

class CraftEssencePortrait extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = { assetType: "normal" };
    }

    private asset(): string | undefined {
        const assetMap =
            this.state.assetType === "normal"
                ? this.props.craftEssence.extraAssets.charaGraph.equip
                : this.state.assetType === "male"
                  ? this.props.craftEssence.script?.maleImage?.charaGraph?.equip
                  : this.props.craftEssence.extraAssets.charaGraphEx.equip;
        if (!assetMap) return undefined;

        return Object.values(assetMap).shift();
    }

    private hasExtraAsset(): boolean {
        return (
            this.props.craftEssence.script?.maleImage?.charaGraph !== undefined ||
            this.props.craftEssence.extraAssets.charaGraphEx.equip !== undefined
        );
    }

    private getArrow(next: boolean) {
        if (!this.hasExtraAsset()) return null;

        if (!next && this.state.assetType === "normal") return null;
        if (next && (this.state.assetType === "male" || this.state.assetType === "ex")) return null;

        return (
            <img
                alt={`${next ? "Next" : "Previous"} Craft Essence Saint Graph`}
                className={`arrow ${next ? "" : "back"}`}
                src={img_arrow_load}
                onClick={() => {
                    switch (this.state.assetType) {
                        case "normal":
                            this.setState({
                                assetType:
                                    this.props.craftEssence.script?.maleImage?.charaGraph !== undefined ? "male" : "ex",
                            });
                            break;
                        case "male":
                            this.setState({ assetType: "normal" });
                            break;
                        case "ex":
                            this.setState({ assetType: "normal" });
                            break;
                    }
                }}
            />
        );
    }

    render() {
        const asset = this.asset();

        return (
            <div id="craft-essence-portrait">
                {this.getArrow(false)}
                {this.getArrow(true)}
                <img
                    alt={this.props.craftEssence.name}
                    id={"craft-essence-portrait-image"}
                    width={512}
                    height={875}
                    src={asset}
                />
            </div>
        );
    }
}

export default CraftEssencePortrait;
