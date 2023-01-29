import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Region, War } from "@atlasacademy/api-connector";

import Api from "../Api";
import { lang } from "../Setting/Manager";

export const getWarName = (war: War.WarBasic) =>
    war.flags.indexOf(War.WarFlag.SUB_FOLDER) === -1 ? war.longName : war.name;

export default function WarDescriptor({ region, war }: { region: Region; war: War.WarBasic }) {
    return (
        <Link to={`/${region}/war/${war.id}`} lang={lang(region)}>
            {getWarName(war)}
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
