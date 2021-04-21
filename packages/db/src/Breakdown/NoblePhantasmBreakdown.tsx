import {NoblePhantasm, Region, Servant} from "@atlasacademy/api-connector";
import React from "react";
import {Alert, Col, Row} from "react-bootstrap";
import CardType from "../Component/CardType";
import CommandCard from "../Component/CommandCard";
import NoblePhantasmDescriptor from "../Descriptor/NoblePhantasmDescriptor";
import QuestDescriptor from "../Descriptor/QuestDescriptor";
import {asPercent, handleNewLine, mergeElements} from "../Helper/OutputHelper";
import EffectBreakdown from "./EffectBreakdown";

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
    private getOverwriteData(ascensionAddField: "overWriteTDName" | "overWriteTDRuby" | "overWriteTDFileName") {
        const overWriteTD = this.props.servant.ascensionAdd[ascensionAddField];
        if (this.props.assetId) {
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
        }
    }

    private npCommandCard() {
        return <CommandCard height={200}
                            card={this.props.noblePhantasm.card}
                            servant={this.props.servant}
                            npText={this.getOverwriteData("overWriteTDFileName")}
                            npTextBottom={this.props.servant.id === 800100 && this.props.noblePhantasm.id === 800101}
                            assetType={this.props.assetType}
                            assetId={this.props.assetId}/>;
    }

    render() {
        const np = this.props.noblePhantasm;
        let categories = [
            np.rank && `Rank : ${np.rank}`,
            np.type && `Type : ${np.type}`
        ]
        return (
            <div>
                <Row>
                    <Col lg={3} className={'text-center d-block d-sm-block d-md-block d-lg-none'}>
                        {this.npCommandCard()}
                        <br/>
                    </Col>

                    <Col xs={12} lg={9}>
                        <h3>
                            <NoblePhantasmDescriptor
                                region={this.props.region}
                                noblePhantasm={np}
                                overwriteName={this.getOverwriteData("overWriteTDName")}
                                overwriteRuby={this.getOverwriteData("overWriteTDRuby")}
                            />
                        </h3>

                        {np.condQuestId && np.condQuestPhase ? (
                            <Alert variant={'primary'}>
                                Available after <QuestDescriptor text=""
                                                                 region={this.props.region}
                                                                 questId={np.condQuestId}
                                                                 questPhase={np.condQuestPhase}/>
                            </Alert>
                        ) : null}

                        <p>{handleNewLine(np.detail)}</p>

                        <p>
                            {categories.filter(Boolean).join(' – ')}<br />
                            Card: <CardType card={np.card} height={60}/><br/>
                            Hits: {np.npDistribution.length} Hits
                            - {mergeElements(np.npDistribution.map(hit => asPercent(hit, 0)), ', ')}
                        </p>
                    </Col>

                    <Col lg={3} className={'text-right d-none d-lg-block d-xl-block'}>
                        {this.props.hideCard ? null : this.npCommandCard()}
                        <br/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <EffectBreakdown region={this.props.region}
                                         funcs={np.functions}
                                         gain={this.props.hideGain ? undefined : np.npGain}
                                         levels={5}
                                         scripts={np.script}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default NoblePhantasmBreakdown;
