import {Entity, Item, Region} from "@atlasacademy/api-connector";
import React from "react";
import {Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import ItemIcon from "../../Component/ItemIcon";

const qpItem: Item.Item = {
    id: 1,
    name: "QP",
    type: Item.ItemType.QP,
    detail: "\"Synthesis Resource\"\nA Quantum Particle.\nA fluctuation in the spiritron that grants many possibilities.\nUsed as fuels to conduct all sorts of magecraft.",
    individuality: [],
    icon: "https://assets.atlasacademy.io/GameData/NA/Items/5.png",
    background: Item.ItemBackgroundType.ZERO
};

const iconHeight = 75;

interface IProps {
    region: Region;
    materials: Entity.EntityLevelUpMaterialProgression;
    title: string;
    idMinWidth?: string;
}

class ServantMaterialBreakdown extends React.Component<IProps> {
    private getMaxMaterialCount(): number {
        const counts = Object.values(this.props.materials).map(materials => {
            return materials.items.length;
        });

        return counts.length ? Math.max(...counts) : 0;
    }

    private populateRemainingCells(max: number, count: number) {
        if (count >= max) {
            return [];
        }

        return [
            ...Array(max - count)
        ].map((_, index) => <td key={index}></td>);
    }

    render() {
        const count = this.getMaxMaterialCount();

        return (
            <div>
                <h3>{this.props.title}</h3>

                <Table responsive>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>QP</th>
                        {this.populateRemainingCells(count, 0)}
                    </tr>
                    </thead>
                    <tbody>
                    {Object.keys(this.props.materials).map(key => {
                        return <tr key={key}>
                            <td style={{verticalAlign: 'middle', minWidth: this.props.idMinWidth}}>{key}</td>
                            <td>
                                <ItemIcon region={this.props.region}
                                          item={qpItem}
                                          quantity={this.props.materials[key].qp}
                                          height={iconHeight}
                                          quantityHeight={11}/>
                            </td>
                            {this.props.materials[key].items.map(
                                (itemAndQuantity, index) => {
                                    return <td key={index}>
                                        <Link to={`/${this.props.region}/item/${itemAndQuantity.item.id}`}>
                                            <ItemIcon region={this.props.region}
                                                      item={itemAndQuantity.item}
                                                      quantity={itemAndQuantity.amount}
                                                      height={iconHeight}
                                                      quantityHeight={18}/>
                                        </Link>
                                    </td>
                                }
                            )}
                            {this.populateRemainingCells(count, this.props.materials[key].items.length)}
                        </tr>;
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default ServantMaterialBreakdown;
