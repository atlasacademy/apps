import {CraftEssence, Entity, Enemy, Region, Servant} from "@atlasacademy/api-connector";
import React from "react";
import {BasicCraftEssenceDescriptor} from "./CraftEssenceDescriptor";
import {BasicServantDescriptor} from "./ServantDescriptor";
import EnemyDescriptor from "./EnemyDescriptor";


export default function entityDescriptor(region: Region, entity: Entity.EntityBasic, iconHeight?: number, tab?: string) {
    if (entity.collectionNo !== 0) {
        if (entity.type === Entity.EntityType.SERVANT_EQUIP) {
            return (
                <BasicCraftEssenceDescriptor
                    region={region}
                    craftEssence={entity as CraftEssence.CraftEssenceBasic}
                    iconHeight={iconHeight}
                    tab={tab}
                />
            );
        } else if (entity.type === Entity.EntityType.NORMAL || entity.type === Entity.EntityType.HEROINE) {
            return <BasicServantDescriptor
                        region={region}
                        servant={entity as Servant.ServantBasic}
                        iconHeight={iconHeight}
                        tab={tab}
                    />;
        }
    }

    return <EnemyDescriptor region={region} enemy={entity as Enemy.EnemyBasic} iconHeight={iconHeight} tab={tab}/>;
}
