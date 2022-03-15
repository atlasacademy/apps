import React from "react";
import { Link } from "react-router-dom";

import { Region, Servant } from "@atlasacademy/api-connector";

import ClassIcon from "../Component/ClassIcon";
import FaceIcon from "../Component/FaceIcon";

import "./Descriptor.css";

interface IPropsCommon {
    region: Region;
    servant: Omit<Servant.ServantBasic, "face" | "costume">;
    iconHeight?: number;
    tab?: string;
    overwriteName?: string;
}

function CommonServantDescriptor(props: IPropsCommon & { face?: string; tab?: string }) {
    return (
        <Link
            to={`/${props.region}/servant/${props.servant.collectionNo}` + (props.tab ? `/${props.tab}` : "")}
            className="descriptor-link"
        >
            <ClassIcon className={props.servant.className} rarity={props.servant.rarity} height={props.iconHeight} />{" "}
            {props.face && (
                <FaceIcon
                    location={props.face}
                    rarity={props.servant.rarity}
                    type={props.servant.type}
                    height={props.iconHeight}
                />
            )}{" "}
            <span className="hover-text">{props.overwriteName ?? props.servant.name}</span>
        </Link>
    );
}

interface IProps extends IPropsCommon {
    servant: Servant.Servant;
}

class ServantDescriptor extends React.Component<IProps> {
    private faceIconLocation(): string | undefined {
        const assetBundle = this.props.servant.extraAssets.faces;

        if (assetBundle.ascension) {
            const asset = Object.values(assetBundle.ascension).shift();

            if (asset) return asset;
        }

        if (assetBundle.costume) {
            const asset = Object.values(assetBundle.costume).shift();

            if (asset) return asset;
        }

        return undefined;
    }

    render() {
        return <CommonServantDescriptor {...this.props} face={this.faceIconLocation()} />;
    }
}

interface IPropsBasic extends IPropsCommon {
    servant: Servant.ServantBasic;
}

function BasicServantDescriptor(props: IPropsBasic) {
    return <CommonServantDescriptor {...props} face={props.servant.face} />;
}

export default ServantDescriptor;
export { BasicServantDescriptor };

export function ServantLink(props: {
    region: Region;
    servants: Map<number, Servant.ServantBasic>;
    id: number;
    iconHeight?: number;
    tab?: string;
}) {
    const servant = props.servants.get(props.id);
    if (servant !== undefined) {
        return (
            <BasicServantDescriptor
                region={props.region}
                servant={servant}
                iconHeight={props.iconHeight}
                tab={props.tab}
            />
        );
    } else {
        return (
            <Link to={`/${props.region}/enemy/${props.id}`} className="descriptor-link">
                [{props.id}]
            </Link>
        );
    }
}
