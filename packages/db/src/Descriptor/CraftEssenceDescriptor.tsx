import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

import { CraftEssence, Entity, Region } from "@atlasacademy/api-connector";

import FaceIcon from "../Component/FaceIcon";

import "./Descriptor.css";

interface IPropsCommon {
    region: Region;
    craftEssence: Omit<CraftEssence.CraftEssenceBasic, "face" | "costume">;
    iconHeight?: number;
    tab?: string;
    overwriteName?: string;
}

function CommonCraftEssenceDescriptor(props: IPropsCommon & { face?: string; tab?: string }) {
    return (
        <Link
            to={
                `/${props.region}/craft-essence/${props.craftEssence.collectionNo}` + (props.tab ? `/${props.tab}` : "")
            }
            className="descriptor-link"
        >
            {props.face ? (
                <FaceIcon
                    type={Entity.EntityType.SERVANT_EQUIP}
                    rarity={props.craftEssence.rarity}
                    location={props.face}
                    height={props.iconHeight ?? "2em"}
                />
            ) : undefined}
            {props.face ? " " : undefined}
            <span className="hover-text">{props.overwriteName ?? props.craftEssence.name}</span>{" "}
            <FontAwesomeIcon icon={faShare} />
        </Link>
    );
}

interface IProps extends IPropsCommon {
    craftEssence: CraftEssence.CraftEssence;
}

class CraftEssenceDescriptor extends React.Component<IProps> {
    render() {
        const assetMap = this.props.craftEssence.extraAssets.faces.equip,
            asset = assetMap ? assetMap[this.props.craftEssence.id] : undefined;

        return <CommonCraftEssenceDescriptor {...this.props} face={asset} />;
    }
}

interface IPropsBasic extends IPropsCommon {
    craftEssence: CraftEssence.CraftEssenceBasic;
}

function BasicCraftEssenceDescriptor(props: IPropsBasic) {
    return <CommonCraftEssenceDescriptor {...props} face={props.craftEssence.face} />;
}

export { BasicCraftEssenceDescriptor };
export default CraftEssenceDescriptor;
