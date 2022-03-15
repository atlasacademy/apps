import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Region, War } from "@atlasacademy/api-connector";

import Api from "../Api";

export default function WarDescriptor(props: { region: Region; war: War.WarBasic }) {
    const war = props.war;
    return <Link to={`/${props.region}/war/${war.id}`}>{war.longName}</Link>;
}

export function WarDescriptorId(props: { region: Region; warId: number }) {
    const [war, setWar] = useState<War.WarBasic>(null as any);
    useEffect(() => {
        Api.warBasic(props.warId).then((s) => setWar(s));
    }, [props.warId]);
    if (war !== null) {
        return <WarDescriptor region={props.region} war={war} />;
    } else {
        return <>War {props.warId}</>;
    }
}
