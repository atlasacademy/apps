import { Link } from "react-router-dom";

import { Region, War } from "@atlasacademy/api-connector";

import useApi from "../Hooks/useApi";
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
    const { data: war } = useApi("warBasic", props.warId);
    if (war !== undefined) {
        return <WarDescriptor region={props.region} war={war} />;
    } else {
        return <>War {props.warId}</>;
    }
}
