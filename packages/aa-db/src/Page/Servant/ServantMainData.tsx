import React from "react";
import ServantEntity from "../../Api/Data/ServantEntity";
import ClassIcon from "../../Component/ClassIcon";
import DataTable from "../../Component/DataTable";

interface IProps {
    servant: ServantEntity;
}

class ServantMainData extends React.Component<IProps> {
    render() {
        const servant = this.props.servant;

        return (
            <div>
                <h1>
                    <ClassIcon className={servant.className} rarity={servant.rarity}/>
                    &nbsp;
                    {servant.name}
                </h1>

                <DataTable data={{
                    "ID": servant.id,
                    "Collection": servant.collectionNo,
                    "Name": servant.name,
                    "Class": servant.className,
                    "Rarity": servant.rarity,
                    "Cost": servant.cost,
                    "Max Lv.": servant.lvMax,
                    "Max Hp": servant.hpMax,
                    "Max Atk": servant.atkMax,
                    "Gender": servant.gender,
                    "Attribute": servant.attribute,
                    "Traits": servant.traits.map((trait) => {
                        return trait.name;
                    }).join(', '),
                }}/>
            </div>
        );
    }
}

export default ServantMainData;
