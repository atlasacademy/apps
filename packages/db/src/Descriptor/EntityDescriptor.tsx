import { CraftEssence, Entity, Enemy, Region, Servant } from "@atlasacademy/api-connector";

import { BasicCraftEssenceDescriptor } from "./CraftEssenceDescriptor";
import EnemyDescriptor from "./EnemyDescriptor";
import { BasicServantDescriptor } from "./ServantDescriptor";

export default function EntityDescriptor(props: {
    region: Region;
    entity: Entity.EntityBasic;
    iconHeight?: number;
    tab?: string;
    overwriteName?: string;
}) {
    const entity = props.entity;
    if (entity.collectionNo !== 0) {
        if (entity.type === Entity.EntityType.SERVANT_EQUIP) {
            return (
                <BasicCraftEssenceDescriptor
                    region={props.region}
                    craftEssence={entity as CraftEssence.CraftEssenceBasic}
                    iconHeight={props.iconHeight}
                    tab={props.tab}
                    overwriteName={props.overwriteName}
                />
            );
        } else if (entity.type === Entity.EntityType.NORMAL || entity.type === Entity.EntityType.HEROINE) {
            return (
                <BasicServantDescriptor
                    region={props.region}
                    servant={entity as Servant.ServantBasic}
                    iconHeight={props.iconHeight}
                    tab={props.tab}
                    overwriteName={props.overwriteName}
                />
            );
        }
    }

    return (
        <EnemyDescriptor
            region={props.region}
            enemy={entity as Enemy.EnemyBasic}
            iconHeight={props.iconHeight}
            tab={props.tab}
            overwriteName={props.overwriteName}
        />
    );
}

export function entityDescriptorTable(region: Region, entity: Entity.EntityBasic, index: number) {
    return (
        <div key={index} style={{ marginTop: index === 0 ? 0 : "24.5px" }}>
            <EntityDescriptor region={region} entity={entity} iconHeight={25} />
        </div>
    );
}
