import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Entity, Item, Region } from "@atlasacademy/api-connector";

import { AssetHost } from "../../Api";
import ItemIcon from "../../Component/ItemIcon";

import "./ServantMaterialBreakdown.css";

const qpItem: Item.Item = {
    id: 1,
    name: "QP",
    type: Item.ItemType.QP,
    uses: [],
    detail: '"Synthesis Resource"\nA Quantum Particle.\nA fluctuation in the spiritron that grants many possibilities.\nUsed as fuels to conduct all sorts of magecraft.',
    individuality: [],
    icon: `${AssetHost}/NA/Items/5.png`,
    background: Item.ItemBackgroundType.ZERO,
    priority: 10,
    dropPriority: 510,
};

const iconHeight = 75;

interface IProps {
    region: Region;
    materials: Entity.EntityLevelUpMaterialProgression;
    title: string;
    idMinWidth?: string;
    showNextLevelInDescription?: boolean;
}

class ServantMaterialBreakdown extends React.Component<IProps> {
    private getMaxMaterialCount(): number {
        const counts = Object.values(this.props.materials).map((materials) => {
            return materials.items.length;
        });

        return counts.length ? Math.max(...counts) : 0;
    }

    private populateRemainingCells(max: number, count: number) {
        if (count >= max) {
            return [];
        }

        return [...Array(max - count)].map((_, index) => <th key={index}></th>);
    }

    private doesntCostQP() {
        for (const material of Object.values(this.props.materials)) {
            if (material.qp > 0) {
                return false;
            }
        }
        return true;
    }

    render() {
        const count = this.getMaxMaterialCount();

        return (
            <div>
                <h3>{this.props.title}</h3>

                <Table responsive className="material-breakdown">
                    <thead>
                        <tr>
                            <th style={this.props.showNextLevelInDescription ? { textAlign: "center" } : {}}>#</th>
                            {this.doesntCostQP() ? null : <th style={{ textAlign: "center" }}>QP</th>}
                            {this.populateRemainingCells(count, 0)}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(this.props.materials).map((key) => {
                            return (
                                <tr key={key}>
                                    <td
                                        style={{
                                            minWidth: this.props.idMinWidth,
                                            textAlign: this.props.showNextLevelInDescription ? "center" : "left",
                                        }}
                                    >
                                        {this.props.showNextLevelInDescription ? (
                                            <>
                                                {parseInt(key)}→{parseInt(key) + 1}
                                            </>
                                        ) : (
                                            key
                                        )}
                                    </td>
                                    {this.doesntCostQP() ? null : (
                                        <td>
                                            <ItemIcon
                                                region={this.props.region}
                                                item={qpItem}
                                                quantity={this.props.materials[key].qp}
                                                height={iconHeight}
                                                quantityHeight={11}
                                            />
                                        </td>
                                    )}
                                    {this.props.materials[key].items.map((itemAndQuantity) => {
                                        return (
                                            <td key={itemAndQuantity.item.id}>
                                                <Link to={`/${this.props.region}/item/${itemAndQuantity.item.id}`}>
                                                    <ItemIcon
                                                        region={this.props.region}
                                                        item={itemAndQuantity.item}
                                                        quantity={itemAndQuantity.amount}
                                                        height={iconHeight}
                                                        quantityHeight={18}
                                                    />
                                                </Link>
                                            </td>
                                        );
                                    })}
                                    {this.populateRemainingCells(count, this.props.materials[key].items.length)}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default ServantMaterialBreakdown;
