import { Entity, Region } from "@atlasacademy/api-connector";

import useApi from "../Hooks/useApi";
import EntityDescriptor from "./EntityDescriptor";

export default function EntityReferenceDescriptor(props: {
    region: Region;
    svtId: number;
    iconHeight?: number;
    tab?: string;
    forceType?: Entity.EntityType;
}) {
    const { data: entity } = useApi("entityBasic", props.svtId);
    if (entity !== undefined) {
        return (
            <EntityDescriptor
                region={props.region}
                entity={entity}
                iconHeight={props.iconHeight}
                tab={props.tab}
                forceType={props.forceType}
            />
        );
    } else {
        return null;
    }
}
