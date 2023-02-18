import React, { useEffect, useState } from "react";

import { Entity, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import EntityDescriptor from "./EntityDescriptor";

export default function EntityReferenceDescriptor(props: {
    region: Region;
    svtId: number;
    iconHeight?: number;
    tab?: string;
}) {
    const [entity, setEntity] = useState<Entity.EntityBasic | undefined>(undefined);
    useEffect(() => {
        Api.entityBasic(props.svtId).then((s) => setEntity(s));
    }, [props.region, props.svtId]);
    if (entity !== undefined) {
        return <EntityDescriptor region={props.region} entity={entity} iconHeight={props.iconHeight} tab={props.tab} />;
    } else {
        return null;
    }
}
