import React from "react";
import { Alert, Col, Row } from "react-bootstrap";

import { NoblePhantasm, Region, Servant } from "@atlasacademy/api-connector";

import CardType from "../Component/CardType";
import CommandCard from "../Component/CommandCard";
import NoblePhantasmDescriptor from "../Descriptor/NoblePhantasmDescriptor";
import QuestDescriptor from "../Descriptor/QuestDescriptor";
import TraitDescription from "../Descriptor/TraitDescription";
import { asPercent, mergeElements } from "../Helper/OutputHelper";
import EffectBreakdown from "./EffectBreakdown";

import "../Helper/StringHelper.css";

interface IProps {
    region: Region;
    servant: Servant.Servant;
    noblePhantasm: NoblePhantasm.NoblePhantasm;
    assetType?: "ascension" | "costume";
    assetId?: number;
    hideCard?: boolean;
    hideGain?: boolean;
}

class NoblePhantasmBreakdown extends React.Component<IProps> {
    private getOverwriteData(
        ascensionAddField:
            | "overWriteTDName"
            | "overWriteTDRuby"
            | "overWriteTDFileName"
            | "overWriteTDRank"
            | "overWriteTDTypeText"
    ) {
        const overWriteTD = this.props.servant.ascensionAdd[ascensionAddField];
        if (this.props.assetId !== undefined && overWriteTD !== undefined) {
            const limit = this.props.assetId === 1 ? 0 : this.props.assetId;
            if (limit in overWriteTD.ascension) {
                return overWriteTD.ascension[limit];
            } else if (limit in overWriteTD.costume) {
                return overWriteTD.costume[limit];
            }
        }
        switch (ascensionAddField) {
            case "overWriteTDName":
                return this.props.noblePhantasm.name;
            case "overWriteTDRuby":
                return this.props.noblePhantasm.ruby;
            case "overWriteTDFileName":
                return this.props.noblePhantasm.icon;
            case "overWriteTDRank":
                return this.props.noblePhantasm.rank;
            case "overWriteTDTypeText":
                return this.props.noblePhantasm.type;
        }
    }

    private npCommandCard() {
        return (
            <CommandCard
                height={200}
                card={this.props.noblePhantasm.card}
                servant={this.props.servant}
                npText={this.getOverwriteData("overWriteTDFileName")}
                npTextBottom={this.props.servant.id === 800100 && this.props.noblePhantasm.id === 800101}
                assetType={this.props.assetType}
                assetId={this.props.assetId}
            />
        );
    }

    render() {
        const np = this.props.noblePhantasm,
            npRank = this.getOverwriteData("overWriteTDRank") ?? "",
            npType = this.getOverwriteData("overWriteTDTypeText") ?? "";
        return (
            <div>
                <Row>
                    {this.props.hideCard ? null : (
                        <Col
                            lg={{ span: 3, order: 2 }}
                            style={{ textAlign: "center", marginBottom: "2em" }}
                            className={"text-lg-right d-lg-block d-xl-block"}
                        >
                            {this.npCommandCard()}
                        </Col>
                    )}
                    <Col lg={{ span: this.props.hideCard ? 12 : 9, order: 1 }}>
                        <h3>
                            <NoblePhantasmDescriptor
                                region={this.props.region}
                                noblePhantasm={np}
                                overwriteName={this.getOverwriteData("overWriteTDName")}
                                overwriteRuby={this.getOverwriteData("overWriteTDRuby")}
                            />
                        </h3>

                        {np.condQuestId && np.condQuestPhase ? (
                            <Alert variant={"primary"}>
                                Available after{" "}
                                <QuestDescriptor
                                    region={this.props.region}
                                    questId={np.condQuestId}
                                    questPhase={
                                        ["91", "94"].includes(np.condQuestId.toString().slice(0, 2))
                                            ? 1
                                            : np.condQuestPhase
                                    }
                                />
                            </Alert>
                        ) : null}

                        <p className="newline">{np.detail}</p>

                        <p style={{ lineHeight: "2em" }}>
                            {npRank !== "" ? (
                                <span>
                                    <b>Rank:</b> {npRank}
                                    <br />
                                </span>
                            ) : null}
                            {npType !== "" ? (
                                <span>
                                    <b>Type:</b> {npType}
                                    <br />
                                </span>
                            ) : null}
                            {this.props.hideCard ? (
                                <span>
                                    <b>Card:</b> <CardType card={np.card} height={60} />
                                    <br />
                                </span>
                            ) : null}
                            <b>Hits:</b> {np.npDistribution.length} Hits –{" "}
                            {mergeElements(
                                np.npDistribution.map((hit) => asPercent(hit, 0)),
                                ", "
                            )}
                            <br />
                            <b>Traits:</b>{" "}
                            {mergeElements(
                                np.individuality.map((trait) => (
                                    <TraitDescription
                                        region={this.props.region}
                                        trait={trait}
                                        owner="noble-phantasms"
                                        ownerParameter="individuality"
                                    />
                                )),
                                ", "
                            )}
                        </p>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <EffectBreakdown
                            region={this.props.region}
                            funcs={np.functions}
                            gain={this.props.hideGain ? undefined : np.npGain}
                            levels={5}
                            scripts={np.script}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default NoblePhantasmBreakdown;
