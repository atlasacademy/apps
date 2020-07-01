import React from "react";
import {Col, Row} from "react-bootstrap";
import Servant from "../../Api/Data/Servant";
import BuffIcon from "../../Component/BuffIcon";
import DataTable from "../../Component/DataTable";
import {asPercent} from "../../Helper/OutputHelper";

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
                return (index > 0 ? ', ' : '') + asPercent(hit, 0);
            })}
            &nbsp;-&nbsp;
            {hits.length} Hits
        </span>
    };

interface IProps {
    servant: Servant;
}

class ServantMiscData extends React.Component<IProps> {
    private hitsColumn() {
        return (
            <Col xs={12} md={12} lg={4}>
                <DataTable
                    header={(
                        <div>
                            <BuffIcon location={hitCountIcon}/>
                            &nbsp;
                            Hit Count
                        </div>
                    )}
                    data={{
                        "Buster": showHits(this.props.servant.hitsDistribution.buster),
                        "Arts": showHits(this.props.servant.hitsDistribution.arts),
                        "Quick": showHits(this.props.servant.hitsDistribution.quick),
                        "Extra": showHits(this.props.servant.hitsDistribution.extra),
                    }}/>
            </Col>
        );
    }

    private miscColumn() {
        return (
            <Col xs={12} md={12} lg={4}>
                <DataTable
                    header={(
                        <div>
                            <BuffIcon location={starGenIcon}/>&nbsp;Crit Stars
                        </div>
                    )}
                    data={{
                        "Star Absorb": this.props.servant.starAbsorb,
                        "Star Gen": asPercent(this.props.servant.starGen, 1),
                    }}/>

                <DataTable
                    header={(
                        <div>
                            <BuffIcon location={deathChanceIcon}/>&nbsp;Instant Death
                        </div>
                    )}
                    data={{
                        "Death Chance": asPercent(this.props.servant.instantDeathChance, 1),
                    }}/>
            </Col>
        );
    }

    private npGainColumn() {
        return (
            <Col xs={12} md={12} lg={4}>
                <DataTable
                    header={(
                        <div>
                            <BuffIcon location={npGainIcon}/>&nbsp;NP Gain
                        </div>
                    )}
                    data={{
                        "Buster": asPercent(this.props.servant.npGain.buster, 2),
                        "Arts": asPercent(this.props.servant.npGain.arts, 2),
                        "Quick": asPercent(this.props.servant.npGain.quick, 2),
                        "Extra": asPercent(this.props.servant.npGain.extra, 2),
                        "Defense": asPercent(this.props.servant.npGain.defence, 2),
                    }}/>
            </Col>
        );
    }

    render() {
        return (
            <div>
                <Row>
                    {this.hitsColumn()}
                    {this.npGainColumn()}
                    {this.miscColumn()}
                </Row>
            </div>
        );
    }
}

export default ServantMiscData;
