import React from "react";
import {Alert} from "react-bootstrap";
import {default as ServantNoblePhantasmData} from "../Api/Data/NoblePhantasm";
import Region from "../Api/Data/Region";
import CardType from "../Component/CardType";
import NoblePhantasmDescriptor from "../Descriptor/NoblePhantasmDescriptor";
import QuestDescriptor from "../Descriptor/QuestDescriptor";
import {asPercent, handleNewLine, mergeElements} from "../Helper/OutputHelper";
import EffectBreakdown from "./EffectBreakdown";

interface IProps {
    region: Region;
    noblePhantasm: ServantNoblePhantasmData;
}

class NoblePhantasmBreakdown extends React.Component<IProps> {
    render() {
        const np = this.props.noblePhantasm;

        return (
            <div>
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

                <EffectBreakdown region={this.props.region}
                                 funcs={np.functions}
                                 gain={np.npGain}
                                 levels={5}/>
            </div>
        );
    }
}

export default NoblePhantasmBreakdown;
