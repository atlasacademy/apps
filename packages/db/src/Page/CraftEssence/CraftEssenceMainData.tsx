import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

import { CraftEssence, Region } from "@atlasacademy/api-connector";

import { Host } from "../../Api";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import EntityReferenceDescriptor from "../../Descriptor/EntityReferenceDescriptor";
import RarityDescriptor from "../../Descriptor/RarityDescriptor";
import ScriptDescriptor from "../../Descriptor/ScriptDescriptor";
import getRubyText from "../../Helper/StringHelper";
import { lang } from "../../Setting/Manager";

interface IProps extends WithTranslation {
    region: Region;
    craftEssence: CraftEssence.CraftEssence;
}

class CraftEssenceMainData extends React.Component<IProps> {
    render() {
        const t = this.props.t;
        const craftEssence = this.props.craftEssence;

        let craftEssenceData: Record<string, string | number | JSX.Element> = {
            ID: craftEssence.id,
            Collection: craftEssence.collectionNo, //t("Collection")
            Name: <span lang={lang(this.props.region)}>{craftEssence.name}</span>, //t("Name")
            ...(craftEssence.name !== craftEssence.originalName && {
                //t("Original Name")
                "Original Name": (
                    <span lang={lang(this.props.region)}>
                        {getRubyText(this.props.region, craftEssence.originalName, craftEssence.ruby)}
                    </span>
                ),
            }),
            ...(craftEssence.name === craftEssence.originalName &&
                craftEssence.name !== craftEssence.ruby &&
                craftEssence.ruby !== "-" && { Ruby: craftEssence.ruby }),
            Rarity: <RarityDescriptor rarity={craftEssence.rarity} />, //t("Rarity")
            Cost: craftEssence.cost,
            "Max Lv.": craftEssence.lvMax,
            "Base Hp": craftEssence.hpBase,
            "Base Atk": craftEssence.atkBase,
            "Max Hp": craftEssence.hpMax,
            "Max Atk": craftEssence.atkMax,
        };

        if (craftEssence.bondEquipOwner)
            craftEssenceData[t("Bond CE's Owner")] = (
                <EntityReferenceDescriptor region={this.props.region} svtId={craftEssence.bondEquipOwner} />
            );

        if (craftEssence.valentineEquipOwner)
            craftEssenceData[t("Valentine CE's Owner")] = (
                <EntityReferenceDescriptor region={this.props.region} svtId={craftEssence.valentineEquipOwner} />
            );

        if (craftEssence.valentineScript.length > 0) {
            const valentineScript = craftEssence.valentineScript[0];
            craftEssenceData[t("Valentine Script")] = (
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
                <h1 lang={lang(this.props.region)}>{craftEssence.name}</h1>

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

export default withTranslation()(CraftEssenceMainData);
