import { CraftEssence, Region } from "@atlasacademy/api-connector";
import React from "react";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import EntityReferenceDescriptor from "../../Descriptor/EntityReferenceDescriptor";
import RarityDescriptor from "../../Descriptor/RarityDescriptor";

interface IProps {
    region: Region;
    craftEssence: CraftEssence.CraftEssence;
}

class CraftEssenceMainData extends React.Component<IProps> {
    render() {
        const craftEssence = this.props.craftEssence;

        let craftEssenceData: Record<string, string | number | JSX.Element> = {
            ID: craftEssence.id,
            Collection: craftEssence.collectionNo,
            Name: craftEssence.name,
            Rarity: <RarityDescriptor rarity={craftEssence.rarity} />,
            Cost: craftEssence.cost,
            "Max Lv.": craftEssence.lvMax,
            "Base Hp": craftEssence.hpBase,
            "Base Atk": craftEssence.atkBase,
            "Max Hp": craftEssence.hpMax,
            "Max Atk": craftEssence.atkMax,
        };

        if (craftEssence.bondEquipOwner)
            craftEssenceData["Bond CE's Owner"] = (
                <EntityReferenceDescriptor
                    region={this.props.region}
                    svtId={craftEssence.bondEquipOwner}
                />
            );

        if (craftEssence.valentineEquipOwner)
            craftEssenceData["Valentine CE's Owner"] = (
                <EntityReferenceDescriptor
                    region={this.props.region}
                    svtId={craftEssence.valentineEquipOwner}
                />
            );

        return (
            <div>
                <h1>{craftEssence.name}</h1>

                <DataTable data={craftEssenceData} />
                <span>
                    <RawDataViewer text="Nice" data={craftEssence} />
                    <RawDataViewer
                        text="Raw"
                        data={`https://api.atlasacademy.io/raw/${this.props.region}/equip/${craftEssence.id}?expand=true&lore=true`}
                    />
                </span>
            </div>
        );
    }
}

export default CraftEssenceMainData;
