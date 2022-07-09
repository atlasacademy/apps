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

        const craftEssenceData = [
            { label: t("ID"), value: craftEssence.id },
            { label: t("Collection"), value: craftEssence.collectionNo },
            { label: t("Name"), value: <span lang={lang(this.props.region)}>{craftEssence.name}</span> },
            {
                label: t("Original Name"),
                value: (
                    <span lang={lang(this.props.region)}>
                        {getRubyText(this.props.region, craftEssence.originalName, craftEssence.ruby)}
                    </span>
                ),
                hidden: craftEssence.name === craftEssence.originalName,
            },
            {
                label: t("Ruby"),
                value: craftEssence.ruby,
                hidden:
                    craftEssence.name !== craftEssence.originalName ||
                    craftEssence.name === craftEssence.ruby ||
                    craftEssence.ruby === "-",
            },
            { label: "Rarity", value: <RarityDescriptor rarity={craftEssence.rarity} /> }, //t("Rarity")
            { label: "Cost", value: craftEssence.cost },
            { label: "Max Lv.", value: craftEssence.lvMax },
            { label: "Base Hp", value: craftEssence.hpBase },
            { label: "Base Atk", value: craftEssence.atkBase },
            { label: "Max Hp", value: craftEssence.hpMax },
            { label: "Max Atk", value: craftEssence.atkMax },
        ];

        if (craftEssence.bondEquipOwner)
            craftEssenceData.push({
                label: t("Bond CE's Owner"),
                value: <EntityReferenceDescriptor region={this.props.region} svtId={craftEssence.bondEquipOwner} />,
            });
        if (craftEssence.valentineEquipOwner)
            craftEssenceData.push({
                label: t("Valentine CE's Owner"),
                value: (
                    <EntityReferenceDescriptor region={this.props.region} svtId={craftEssence.valentineEquipOwner} />
                ),
            });

        if (craftEssence.valentineScript.length > 0) {
            const valentineScript = craftEssence.valentineScript[0];
            craftEssenceData.push({
                label: t("Valentine Script"),
                value: (
                    <ScriptDescriptor
                        region={this.props.region}
                        scriptId={valentineScript.scriptId}
                        scriptName={valentineScript.scriptName}
                        scriptType=""
                    />
                ),
            });
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
