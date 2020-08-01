import React from "react";
import {Alert, Col, Row} from "react-bootstrap";
import {default as ServantNoblePhantasmData} from "../Api/Data/NoblePhantasm";
import Region from "../Api/Data/Region";
import Servant from "../Api/Data/Servant";
import CardType from "../Component/CardType";
import CommandCard from "../Component/CommandCard";
import NoblePhantasmDescriptor from "../Descriptor/NoblePhantasmDescriptor";
import QuestDescriptor from "../Descriptor/QuestDescriptor";
import {asPercent, handleNewLine, mergeElements} from "../Helper/OutputHelper";
import EffectBreakdown from "./EffectBreakdown";

interface IProps {
    region: Region;
    servant: Servant;
    noblePhantasm: ServantNoblePhantasmData;
    assetType?: string;
    assetId?: string;
}

class NoblePhantasmBreakdown extends React.Component<IProps> {
    private npCommandCard() {
        return <CommandCard height={200}
                            card={this.props.noblePhantasm.card}
                            servant={this.props.servant}
                            npText={this.props.noblePhantasm.icon}
                            npTextBottom={this.props.servant.id === 800100 && this.props.noblePhantasm.id === 800101}
                            assetType={this.props.assetType}
                            assetId={this.props.assetId}/>;
    }

    render() {
        const np = this.props.noblePhantasm;

        return (
            <div>
                <Row>
                    <Col lg={3} className={'text-center d-block d-sm-block d-md-block d-lg-none'}>
                        {this.npCommandCard()}
                        <br/>
                    </Col>

                    <Col xs={12} lg={9}>
                        <h3>
                            <NoblePhantasmDescriptor region={this.props.region} noblePhantasm={np}/>
                        </h3>

                        {np.condQuestId && np.condQuestPhase ? (
                            <Alert variant={'primary'}>
                                Available after <QuestDescriptor region={this.props.region}
                                                                 questId={np.condQuestId}
                                                                 questPhase={np.condQuestPhase}/>
                            </Alert>
                        ) : null}

                        <p>{handleNewLine(np.detail)}</p>

                        <p>
                            Card: <CardType card={np.card} height={60}/><br/>
                            Hits: {np.npDistribution.length} Hits
                            - {mergeElements(np.npDistribution.map(hit => asPercent(hit, 0)), ', ')}
                        </p>
                    </Col>

                    <Col lg={3} className={'text-right d-none d-lg-block d-xl-block'}>
                        {this.npCommandCard()}
                        <br/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <EffectBreakdown region={this.props.region}
                                         funcs={np.functions}
                                         gain={np.npGain}
                                         levels={5}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default NoblePhantasmBreakdown;
