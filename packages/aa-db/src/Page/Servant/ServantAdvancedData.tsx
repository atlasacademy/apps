import React from "react";
import {Col, Row} from "react-bootstrap";
import ServantEntity from "../../Api/Data/ServantEntity";
import BuffIcon from "../../Component/BuffIcon";
import DataTable from "../../Component/DataTable";
import {asPercent} from "../../Helper";

const buffIconPath = 'https://assets.atlasacademy.io/GameData/JP/BuffIcons',
    deathChanceIcon = `${buffIconPath}/bufficon_337.png`,
    hitCountIcon = `${buffIconPath}/bufficon_349.png`,
    npGainIcon = `${buffIconPath}/bufficon_303.png`,
    starGenIcon = `${buffIconPath}/bufficon_310.png`,
    showHits = function (hits: number[] | undefined): JSX.Element | string {
        if (hits === undefined)
            return '';

        return <span>
            {hits.map((hit, index) => {
                return (index > 0 ? ', ' : '') + hit + '%';
            })}
            &nbsp;-&nbsp;
            {hits.length} Hits
        </span>
    };

interface IProps {
    servant: ServantEntity;
}

class ServantAdvancedData extends React.Component<IProps> {
    render() {
        const servant = this.props.servant;

        return (
            <div>
                <Row>
                    <Col xs={12} md={4}>
                        <DataTable
                            header={(
                                <div>
                                    <BuffIcon location={starGenIcon}/>&nbsp;Crit Stars
                                </div>
                            )}
                            data={{
                                "Star Absorb": servant.starAbsorb,
                                "Star Gen": asPercent(servant.starGen),
                            }}/>

                        <DataTable
                            header={(
                                <div>
                                    <BuffIcon location={deathChanceIcon}/>&nbsp;Instant Death
                                </div>
                            )}
                            data={{
                                "Death Chance": asPercent(servant.instantDeathChance),
                            }}/>
                    </Col>

                    <Col xs={12} md={4}>
                        <DataTable
                            header={(
                                <div>
                                    <BuffIcon location={npGainIcon}/>&nbsp;NP Gain
                                </div>
                            )}
                            data={{
                                "Buster": asPercent(servant.npGain.buster),
                                "Arts": asPercent(servant.npGain.arts),
                                "Quick": asPercent(servant.npGain.quick),
                                "Extra": asPercent(servant.npGain.extra),
                                "Defense": asPercent(servant.npGain.defence),
                            }}/>
                    </Col>

                    <Col xs={12} md={4}>
                        <DataTable
                            header={(
                                <div>
                                    <BuffIcon location={hitCountIcon}/>
                                    &nbsp;
                                    Hit Count
                                </div>
                            )}
                            data={{
                                "Buster": showHits(servant.hitsDistribution.buster),
                                "Arts": showHits(servant.hitsDistribution.arts),
                                "Quick": showHits(servant.hitsDistribution.quick),
                                "Extra": showHits(servant.hitsDistribution.extra),
                            }}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ServantAdvancedData;
