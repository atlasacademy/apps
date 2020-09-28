import {Item, Region} from "@atlasacademy/api-connector";
import {EntityLevelUpMaterialProgression} from "@atlasacademy/api-connector/dist/Schema/BaseEntity";
import React from "react";
import {Table} from "react-bootstrap";
import ItemIcon from "../../Component/ItemIcon";

const qpItem: Item.Item = {
    id: 1,
    name: "QP",
    type: Item.ItemType.QP,
    icon: "https://assets.atlasacademy.io/GameData/NA/Items/5.png",
    background: Item.ItemBackgroundType.ZERO
};

const iconHeight = 75;

interface IProps {
    region: Region;
    materials: EntityLevelUpMaterialProgression;
    title: string;
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

                <Table>
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
                            <td style={{verticalAlign: 'middle'}}>{key}</td>
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
                                        <ItemIcon region={this.props.region}
                                                  item={itemAndQuantity.item}
                                                  quantity={itemAndQuantity.amount}
                                                  height={iconHeight}
                                                  quantityHeight={18}/>
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
