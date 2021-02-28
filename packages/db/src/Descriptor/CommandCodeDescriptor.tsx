import { CommandCode, Region } from "@atlasacademy/api-connector";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FaceIcon from "../Component/FaceIcon";
import Api from "../Api";

export default function CommandCodeDescriptor(props: {
    region: Region;
    commandCode: CommandCode.CommandCodeBasic;
    iconHeight?: number;
}) {
    return (
        <Link
            to={`/${props.region}/command-code/${props.commandCode.collectionNo}`}
            style={{ textDecoration: "none", whiteSpace: "nowrap" }}
        >
            {" "}
            <FaceIcon
                rarity={props.commandCode.rarity}
                location={props.commandCode.face}
                height={props.iconHeight}
            />{" "}
            <span className="hoverText" style={{ whiteSpace: "normal" }}>
                {props.commandCode.name}
            </span>
        </Link>
    );
}

export function CommandCodeDescriptorId(props: {
    region: Region;
    ccId: number;
    iconHeight?: number;
}) {
    const [cc, setCC] = useState<CommandCode.CommandCodeBasic>(null as any);
    useEffect(() => {
        Api.commandCodeBasic(props.ccId).then((s) => setCC(s));
    }, [props.ccId]);
    return cc !== null ? (
        <CommandCodeDescriptor
            region={props.region}
            commandCode={cc}
            iconHeight={props.iconHeight}
        />
    ) : null;
}
