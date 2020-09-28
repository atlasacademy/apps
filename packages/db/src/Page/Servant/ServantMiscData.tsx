import {Servant} from "@atlasacademy/api-connector";
import React from "react";
import {Col, Row} from "react-bootstrap";
import BuffIcon from "../../Component/BuffIcon";
import DataTable from "../../Component/DataTable";
import {asPercent} from "../../Helper/OutputHelper";

const buffIconPath = 'https://assets.atlasacademy.io/GameData/JP/BuffIcons',
    deathChanceIcon = `${buffIconPath}/bufficon_337.png`,
    hitCountIcon = `${buffIconPath}/bufficon_349.png`,
    starGenIcon = `${buffIconPath}/bufficon_320.png`,
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
    servant: Servant.Servant;
}

class ServantMiscData extends React.Component<IProps> {
    private hitsColumn() {
        return (
            <Col xs={12} md={12} lg={6}>
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
            <Col xs={12} md={12} lg={6}>
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

    render() {
        return (
            <div>
                <Row>
                    {this.hitsColumn()}
                    {this.miscColumn()}
                </Row>
            </div>
        );
    }
}

export default ServantMiscData;
