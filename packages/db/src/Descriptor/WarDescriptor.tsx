import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Region, War } from "@atlasacademy/api-connector";

import Api from "../Api";
import { lang } from "../Setting/Manager";

export default function WarDescriptor(props: { region: Region; war: War.WarBasic }) {
    const war = props.war;
    const name = war.flags.indexOf(War.WarFlag.SUB_FOLDER) === -1 ? war.longName : war.name;
    return (
        <Link to={`/${props.region}/war/${war.id}`} lang={lang(props.region)}>
            {name}
        </Link>
    );
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
