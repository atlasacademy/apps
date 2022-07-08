import React from "react";
import { Alert } from "react-bootstrap";
import { withTranslation, WithTranslation } from "react-i18next";

import { Entity, Region, Servant } from "@atlasacademy/api-connector";

import renderCollapsibleContent from "../../Component/CollapsibleContent";
import IllustratorDescriptor from "../../Descriptor/IllustratorDescriptor";
import ServantLimitImage from "./ServantLimitImage";
import ServantModelViewer from "./ServantModelViewer";

import "./ServantAssets.css";

interface IProps extends WithTranslation {
    region: Region;
    servant: Servant.Servant;
}

class ServantAssets extends React.Component<IProps> {
    private flattenAssets(assetMap: Entity.EntityAssetMap | undefined): string[] {
        if (!assetMap) return [];

        const assets = [];

        if (assetMap.ascension) assets.push(...Object.values(assetMap.ascension));

        if (assetMap.costume) assets.push(...Object.values(assetMap.costume));

        return assets;
    }

    private flattenStoryAssets(assetMap: Entity.EntityAssetMap | undefined): string[] {
        if (!assetMap) return [];

        const assets = [];

        if (assetMap.story) assets.push(...Object.values(assetMap.story));

        return assets;
    }

    private displayAssets(
        assetMap: Entity.EntityAssetMap | undefined,
        size: { width: number; height: number } | undefined = undefined,
        story = false
    ) {
        const assets = story ? this.flattenStoryAssets(assetMap) : this.flattenAssets(assetMap);
        const getImg =
            size !== undefined
                ? (asset: string) => (
                      <img
                          alt=""
                          src={asset}
                          width={size.width}
                          height={size.height}
                          className="servant-asset-images"
                      />
                  )
                : (asset: string) => <img alt="" src={asset} className="servant-asset-images" />;

        return (
            <>
                {assets.map((asset) => (
                    <a key={asset} href={asset} target="_blank" rel="noopener noreferrer">
                        {getImg(asset)}
                    </a>
                ))}
            </>
        );
    }

    render() {
        const t = this.props.t;
        const charaFigure = (
            <>
                {this.displayAssets(this.props.servant.extraAssets.charaFigure)}
                <br />
                {Object.entries(this.props.servant.extraAssets.charaFigureForm).map(([form, assetMap]) => (
                    <div key={form}>
                        {renderCollapsibleContent({
                            title: `${t("Form")} ${form}`,
                            content: this.displayAssets(assetMap),
                            subheader: true,
                        })}
                    </div>
                ))}
                <br />
                {Object.entries(this.props.servant.extraAssets.charaFigureMulti).map(([idx, assetMap]) => (
                    <div key={idx}>
                        {renderCollapsibleContent({
                            title: `${t("Character")} ${idx}`,
                            content: this.displayAssets(assetMap),
                            subheader: true,
                        })}
                    </div>
                ))}
            </>
        );

        const charaGraphSize = { width: 512, height: 724 };
        const narrowFigureSize = { width: 148, height: 375 };
        const faceSize = { width: 128, height: 128 };

        const content = [
            {
                title: t("Portraits"),
                content: (
                    <>
                        {this.displayAssets(this.props.servant.extraAssets.charaGraph, charaGraphSize)}
                        {this.displayAssets(this.props.servant.extraAssets.charaGraphEx, charaGraphSize)}
                        {this.displayAssets(this.props.servant.extraAssets.charaGraphChange, charaGraphSize)}
                    </>
                ),
            },
            {
                title: t("Status"),
                content: this.displayAssets(this.props.servant.extraAssets.status, { width: 256, height: 256 }),
            },
            {
                title: t("Command"),
                content: this.displayAssets(this.props.servant.extraAssets.commands, { width: 256, height: 256 }),
            },
            {
                title: t("Formation"),
                content: (
                    <>
                        {this.displayAssets(this.props.servant.extraAssets.narrowFigure, narrowFigureSize)}
                        {this.displayAssets(this.props.servant.extraAssets.narrowFigureChange, narrowFigureSize)}
                    </>
                ),
            },
            {
                title: t("Thumbnail"),
                content: (
                    <>
                        {this.displayAssets(this.props.servant.extraAssets.faces, faceSize)}
                        {this.displayAssets(this.props.servant.extraAssets.facesChange, faceSize)}
                    </>
                ),
            },
            { title: t("Figure"), content: charaFigure },
        ].map((a) => Object.assign({}, a, { subheader: false }));
        return (
            <div>
                <Alert variant="success">
                    <IllustratorDescriptor
                        region={this.props.region}
                        illustrator={this.props.servant.profile?.illustrator}
                    />
                </Alert>
                <ServantModelViewer servant={this.props.servant} />
                <ServantLimitImage region={this.props.region} servant={this.props.servant} />
                {content.map((content) => (
                    <div key={content.title}>{renderCollapsibleContent(content)}</div>
                ))}
                {this.props.servant.extraAssets.charaFigure.story
                    ? renderCollapsibleContent({
                          title: `${t("Story Figure")} (${t("May contain spoilers")})`,
                          content: (
                              <>
                                  {this.displayAssets(this.props.servant.extraAssets.charaFigure, undefined, true)}
                                  {this.displayAssets(this.props.servant.extraAssets.image, undefined, true)}
                              </>
                          ),
                          subheader: false,
                          initialOpen: false,
                      })
                    : ""}
                <br />
                {Object.entries(this.props.servant.extraAssets.charaFigureForm).map(([form, assetMap]) => (
                    <div key={form}>
                        {assetMap.story
                            ? renderCollapsibleContent({
                                  title: `${t("Story Figure")} ${t("Form")} ${form}`,
                                  content: this.displayAssets(assetMap, undefined, true),
                                  subheader: true,
                                  initialOpen: false,
                              })
                            : null}
                    </div>
                ))}
            </div>
        );
    }
}

export default withTranslation()(ServantAssets);
