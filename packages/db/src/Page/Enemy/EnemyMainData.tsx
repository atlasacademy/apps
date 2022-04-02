import React from "react";
import { Col, Row } from "react-bootstrap";

import { Enemy, Region } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import { Host } from "../../Api";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import RarityDescriptor from "../../Descriptor/RarityDescriptor";
import { asPercent, formatNumber } from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    enemy: Enemy.Enemy;
}

class EnemyMainData extends React.Component<IProps> {
    render() {
        const enemy = this.props.enemy;

        return (
            <>
                <div>
                    <DataTable
                        data={{
                            ID: enemy.id,
                            Name: enemy.name,
                            Class: toTitleCase(enemy.className),
                            Rarity: <RarityDescriptor rarity={enemy.rarity} />,
                            Attribute: toTitleCase(enemy.attribute),
                            Hp: (
                                <div>
                                    Base: {formatNumber(enemy.hpBase)}
                                    &nbsp;&nbsp;&nbsp;&nbsp; Max: {formatNumber(enemy.hpMax)}
                                </div>
                            ),
                            Atk: (
                                <div>
                                    Base: {formatNumber(enemy.atkBase)}
                                    &nbsp;&nbsp;&nbsp;&nbsp; Max: {formatNumber(enemy.atkMax)}
                                </div>
                            ),
                            "Death Chance": asPercent(enemy.instantDeathChance, 1),
                            Raw: (
                                <span>
                                    <Row>
                                        <Col>
                                            <RawDataViewer text="Nice" data={enemy} />
                                        </Col>
                                        <Col>
                                            <RawDataViewer
                                                text="Raw"
                                                data={`${Host}/raw/${this.props.region}/servant/${enemy.id}?expand=true&lore=true`}
                                            />
                                        </Col>
                                    </Row>
                                </span>
                            ),
                        }}
                    />
                </div>
            </>
        );
    }
}

export default EnemyMainData;
