import React from "react";

import { CraftEssence, Region } from "@atlasacademy/api-connector";

import { Host } from "../../Api";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import EntityReferenceDescriptor from "../../Descriptor/EntityReferenceDescriptor";
import RarityDescriptor from "../../Descriptor/RarityDescriptor";
import ScriptDescriptor from "../../Descriptor/ScriptDescriptor";

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
                <EntityReferenceDescriptor region={this.props.region} svtId={craftEssence.bondEquipOwner} />
            );

        if (craftEssence.valentineEquipOwner)
            craftEssenceData["Valentine CE's Owner"] = (
                <EntityReferenceDescriptor region={this.props.region} svtId={craftEssence.valentineEquipOwner} />
            );

        if (craftEssence.valentineScript.length > 0) {
            const valentineScript = craftEssence.valentineScript[0];
            craftEssenceData["Valentine Script"] = (
                <ScriptDescriptor
                    region={this.props.region}
                    scriptId={valentineScript.scriptId}
                    scriptName={valentineScript.scriptName}
                    scriptType=""
                />
            );
        }

        return (
            <div>
                <h1>{craftEssence.name}</h1>

                <DataTable data={craftEssenceData} />
                <span>
                    <RawDataViewer text="Nice" data={craftEssence} />
                    <RawDataViewer
                        text="Raw"
                        data={`${Host}/raw/${this.props.region}/equip/${craftEssence.id}?expand=true&lore=true`}
                    />
                </span>
            </div>
        );
    }
}

export default CraftEssenceMainData;
