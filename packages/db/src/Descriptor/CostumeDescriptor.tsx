import { useEffect, useState } from "react";

import { Region, Servant } from "@atlasacademy/api-connector";

import Api from "../Api";
import ServantDescriptor from "./ServantDescriptor";

export default function CostumeDescriptor(props: {
    region: Region;
    servantId: number;
    costumeLimit: number;
    iconHeight?: number;
    tab?: string;
}) {
    const [servant, serServant] = useState<Servant.Servant>(null as any);
    useEffect(() => {
        Api.servant(props.servantId).then((s) => serServant(s));
    }, [props.servantId]);
    if (servant !== null) {
        let costume = undefined;
        if (servant.profile !== undefined) {
            costume = Object.values(servant.profile.costume).find((costume) => costume.id === props.costumeLimit);
        }
        return (
            <>
                <ServantDescriptor
                    region={props.region}
                    servant={servant}
                    iconHeight={props.iconHeight}
                    tab={props.tab ?? "lore"}
                />{" "}
                costume: {costume ? costume.name : props.costumeLimit}
            </>
        );
    } else {
        return null;
    }
}
