import { Link } from "react-router-dom";

import { CommandCode, Region } from "@atlasacademy/api-connector";

import FaceIcon from "../Component/FaceIcon";
import useApi from "../Hooks/useApi";
import { lang } from "../Setting/Manager";

import "./Descriptor.css";

export default function CommandCodeDescriptor(props: {
    region: Region;
    commandCode: CommandCode.CommandCodeBasic;
    iconHeight?: number;
}) {
    return (
        <Link to={`/${props.region}/command-code/${props.commandCode.collectionNo}`} className="descriptor-link">
            {" "}
            <FaceIcon
                rarity={props.commandCode.rarity}
                location={props.commandCode.face}
                height={props.iconHeight}
            />{" "}
            <span className="hover-text" lang={lang(props.region)}>
                {props.commandCode.name}
            </span>
        </Link>
    );
}

export function CommandCodeDescriptorId(props: { region: Region; ccId: number; iconHeight?: number }) {
    const { data: cc } = useApi("commandCodeBasic", props.ccId);
    return cc !== undefined ? (
        <CommandCodeDescriptor region={props.region} commandCode={cc} iconHeight={props.iconHeight} />
    ) : null;
}
