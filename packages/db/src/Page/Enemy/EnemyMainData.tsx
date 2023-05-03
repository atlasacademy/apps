import React from "react";
import { Col, Row } from "react-bootstrap";

import { Enemy, Region } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import Api from "../../Api";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import RarityDescriptor from "../../Descriptor/RarityDescriptor";
import { asPercent, formatNumber } from "../../Helper/OutputHelper";
import { FGOText, Ruby } from "../../Helper/StringHelper";
import { lang } from "../../Setting/Manager";

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
                        data={[
                            { label: "ID", value: enemy.id },
                            {
                                label: "Name",
                                value: (
                                    <span lang={lang(this.props.region)}>
                                        <FGOText text={enemy.name} />
                                    </span>
                                ),
                            },
                            {
                                label: "Original Name",
                                value: (
                                    <span lang={lang(this.props.region)}>
                                        <Ruby region={this.props.region} text={enemy.originalName} ruby={enemy.ruby} />
                                    </span>
                                ),
                                hidden: enemy.name === enemy.originalName,
                            },
                            { label: "Class", value: toTitleCase(enemy.className) },
                            { label: "Rarity", value: <RarityDescriptor rarity={enemy.rarity} /> },
                            { label: "Attribute", value: toTitleCase(enemy.attribute) },
                            {
                                label: "HP",
                                value: (
                                    <div>
                                        Base: {formatNumber(enemy.hpBase)}
                                        &nbsp;&nbsp;&nbsp;&nbsp; Max: {formatNumber(enemy.hpMax)}
                                    </div>
                                ),
                            },
                            {
                                label: "ATK",
                                value: (
                                    <div>
                                        Base: {formatNumber(enemy.atkBase)}
                                        &nbsp;&nbsp;&nbsp;&nbsp; Max: {formatNumber(enemy.atkMax)}
                                    </div>
                                ),
                            },
                            { label: "Death Chance", value: asPercent(enemy.instantDeathChance, 1) },
                            {
                                label: "Raw",
                                value: (
                                    <span>
                                        <Row>
                                            <Col>
                                                <RawDataViewer
                                                    text="Nice"
                                                    data={enemy}
                                                    url={Api.getUrl("nice", "servant", enemy.id, {
                                                        expand: true,
                                                        lore: true,
                                                    })}
                                                />
                                            </Col>
                                            <Col>
                                                <RawDataViewer
                                                    text="Raw"
                                                    data={Api.getUrl("raw", "servant", enemy.id, {
                                                        expand: true,
                                                        lore: true,
                                                    })}
                                                />
                                            </Col>
                                        </Row>
                                    </span>
                                ),
                            },
                        ]}
                    />
                </div>
            </>
        );
    }
}

export default EnemyMainData;
