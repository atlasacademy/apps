import {CraftEssence, Entity, Enemy, Region, Servant} from "@atlasacademy/api-connector";
import React from "react";
import CraftEssenceDescriptor from "./CraftEssenceDescriptor";
import ServantDescriptor from "./ServantDescriptor";
import EnemyDescriptor from "./EnemyDescriptor";


export default function entityDescriptor(region: Region, entity: Entity.Entity, iconHeight?: number) {
    if (entity.collectionNo !== 0) {
        if (entity.type === Entity.EntityType.SERVANT_EQUIP) {
            return <CraftEssenceDescriptor region={region} craftEssence={entity as CraftEssence.CraftEssence}/>;
        } else if (entity.type === Entity.EntityType.NORMAL || entity.type === Entity.EntityType.HEROINE) {
            return <ServantDescriptor region={region} servant={entity as Servant.Servant} iconHeight={iconHeight}/>;
        }
    }

    return <EnemyDescriptor region={region} enemy={entity as Enemy.Enemy} iconHeight={iconHeight}/>;
}
