import React from "react";
import CraftEssence from "../../Api/Data/CraftEssence";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";

interface IProps {
    craftEssence: CraftEssence;
}

class CraftEssenceMainData extends React.Component<IProps> {
    render() {
        const craftEssence = this.props.craftEssence;

        return (
            <div>
                <h1>
                    {craftEssence.name}
                </h1>

                <DataTable data={{
                    "Raw": <RawDataViewer data={craftEssence}/>,
                    "ID": craftEssence.id,
                    "Collection": craftEssence.collectionNo,
                    "Name": craftEssence.name,
                    "Rarity": craftEssence.rarity,
                    "Cost": craftEssence.cost,
                    "Max Lv.": craftEssence.lvMax,
                    "Base Hp": craftEssence.hpBase,
                    "Base Atk": craftEssence.atkBase,
                    "Max Hp": craftEssence.hpMax,
                    "Max Atk": craftEssence.atkMax,
                }}/>
            </div>
        );
    }
}

export default CraftEssenceMainData;
