import React from "react";
import { Table } from "react-bootstrap";
import { WithTranslation, withTranslation } from "react-i18next";

import { Region, Servant } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import CommandCard from "../../Component/CommandCard";
import CraftEssenceReferenceDescriptor from "../../Descriptor/CraftEssenceReferenceDescriptor";
import RarityDescriptor from "../../Descriptor/RarityDescriptor";
import { Renderable, asPercent } from "../../Helper/OutputHelper";
import { formatNumber, mergeElements } from "../../Helper/OutputHelper";
import { Ruby } from "../../Helper/StringHelper";
import { lang } from "../../Setting/Manager";

import "./ServantMainData.css";

interface IProps extends WithTranslation {
    region: Region;
    servant: Servant.Servant;
    servantName?: string;
    originalServantName?: string;
    assetType?: "ascension" | "costume";
    assetId?: number;
}

type RenderableRow = {
    title: Renderable;
    content: Renderable;
};

class ServantMainData extends React.Component<IProps> {
    private renderDoubleRow(content: [RenderableRow, RenderableRow]): Renderable {
        return (
            <tr>
                <th style={{ width: "25%" }}>{content[0].title}</th>
                <td style={{ width: "25%" }}>{content[0].content}</td>
                <th style={{ width: "25%" }}>{content[1].title}</th>
                <td style={{ width: "25%" }}>{content[1].content}</td>
            </tr>
        );
    }

    private renderSpanningRow(content: RenderableRow): Renderable {
        return (
            <tr>
                <th style={{ width: "25%" }}>{content.title}</th>
                <td colSpan={3} style={{ width: "75%" }}>
                    {content.content}
                </td>
            </tr>
        );
    }

    private showHits(hits: number[] | undefined): JSX.Element | string {
        if (hits === undefined) return "";

        return (
            <span>
                {hits.map((hit, index) => {
                    return (index > 0 ? ", " : "") + asPercent(hit, 0);
                })}
                &nbsp;-&nbsp;
                {hits.length} Hits
            </span>
        );
    }

    render() {
        const { servant, servantName, originalServantName, t } = this.props;
        const { buster, arts, quick, extra } = servant.hitsDistribution;
        return (
            <Table bordered responsive className="servant-data-table">
                <tbody>
                    {this.renderDoubleRow([
                        { title: t("ID"), content: servant.id },
                        { title: t("Collection"), content: servant.collectionNo },
                    ])}
                    {this.renderDoubleRow([
                        { title: t("Class"), content: toTitleCase(servant.className) },
                        { title: t("Attribute"), content: toTitleCase(servant.attribute) },
                    ])}
                    {this.renderDoubleRow([
                        { title: t("Rarity"), content: <RarityDescriptor rarity={servant.rarity} /> },
                        { title: "Cost", content: servant.cost },
                    ])}
                    {originalServantName !== undefined &&
                        servantName !== originalServantName &&
                        this.renderSpanningRow({
                            title: t("Original Name"),
                            content: (
                                <span lang={lang(this.props.region)}>
                                    <Ruby region={this.props.region} text={originalServantName} ruby={servant.ruby} />
                                </span>
                            ),
                        })}
                    {this.renderSpanningRow({
                        title: "HP",
                        content: (
                            <div>
                                Base: {formatNumber(servant.hpBase)}
                                &nbsp;&nbsp;&nbsp;&nbsp; Max: {formatNumber(servant.hpMax)}
                            </div>
                        ),
                    })}
                    {this.renderSpanningRow({
                        title: "ATK",
                        content: (
                            <div>
                                Base: {formatNumber(servant.atkBase)}
                                &nbsp;&nbsp;&nbsp;&nbsp; Max: {formatNumber(servant.atkMax)}
                            </div>
                        ),
                    })}
                    {this.renderSpanningRow({
                        title: t("Deck"),
                        content: (
                            <div>
                                {servant.cards.map((card, index) => {
                                    return (
                                        <CommandCard
                                            key={index}
                                            height={60}
                                            card={card}
                                            servant={servant}
                                            assetType={this.props.assetType}
                                            assetId={this.props.assetId}
                                        />
                                    );
                                })}
                            </div>
                        ),
                    })}
                    {this.renderSpanningRow({ title: "Buster", content: this.showHits(buster) })}
                    {this.renderSpanningRow({ title: "Arts", content: this.showHits(arts) })}
                    {this.renderSpanningRow({ title: "Quick", content: this.showHits(quick) })}
                    {this.renderSpanningRow({ title: "Extra", content: this.showHits(extra) })}
                    {this.renderDoubleRow([
                        { title: t("Star Weight"), content: servant.starAbsorb },
                        { title: t("Star Gen"), content: asPercent(servant.starGen, 1) },
                    ])}
                    {this.renderSpanningRow({
                        title: t("Death Chance"),
                        content: asPercent(this.props.servant.instantDeathChance, 1),
                    })}
                    {this.renderSpanningRow({
                        title: t("Bond CE"),
                        content: servant.bondEquip ? (
                            <CraftEssenceReferenceDescriptor region={this.props.region} id={servant.bondEquip} />
                        ) : (
                            ""
                        ),
                    })}
                    {this.renderSpanningRow({
                        title: t("Valentine CE") + (servant.valentineEquip.length > 1 ? "s" : ""),
                        content:
                            servant.valentineEquip.length > 0
                                ? mergeElements(
                                      servant.valentineEquip.map((equipId) => (
                                          <CraftEssenceReferenceDescriptor
                                              key={equipId}
                                              region={this.props.region}
                                              id={equipId}
                                          />
                                      )),
                                      <br></br>
                                  )
                                : t("To Be Released"),
                    })}
                </tbody>
            </Table>
        );
    }
}

export default withTranslation()(ServantMainData);
