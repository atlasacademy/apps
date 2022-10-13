import { Region, Servant } from "@atlasacademy/api-connector";

import EntityReferenceDescriptor from "./EntityReferenceDescriptor";
import { ServantDescriptorMap } from "./ServantDescriptor";

export default function ServantDescriptorId(props: {
    region: Region;
    id: number;
    servants?: Map<number, Servant.ServantBasic>;
    iconHeight?: number;
    tab?: string;
}) {
    if (props.servants !== undefined) {
        return (
            <ServantDescriptorMap
                region={props.region}
                id={props.id}
                servants={props.servants}
                iconHeight={props.iconHeight}
                tab={props.tab}
            />
        );
    } else {
        return (
            <EntityReferenceDescriptor
                region={props.region}
                svtId={props.id}
                iconHeight={props.iconHeight}
                tab={props.tab}
            />
        );
    }
}
