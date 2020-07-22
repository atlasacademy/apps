import React from "react";
import CraftEssence from "../../Api/Data/CraftEssence";
import Region from "../../Api/Data/Region";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import RarityDescriptor from "../../Descriptor/RarityDescriptor";

interface IProps {
    region: Region;
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
                    "Data": <RawDataViewer data={craftEssence}/>,
                    "Raw": <RawDataViewer data={`https://api.atlasacademy.io/raw/${this.props.region}/equip/${craftEssence.id}?expand=true&lore=true`}/>,
                    "ID": craftEssence.id,
                    "Collection": craftEssence.collectionNo,
                    "Name": craftEssence.name,
                    "Rarity": <RarityDescriptor rarity={craftEssence.rarity}/>,
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
