import {Region, Servant} from "@atlasacademy/api-connector";
import React from "react";
import {Link} from "react-router-dom";
import ClassIcon from "../Component/ClassIcon";
import FaceIcon from "../Component/FaceIcon";

interface IProps {
    region: Region;
    servant: Servant;
    iconHeight?: number;
}

class ServantDescriptor extends React.Component<IProps> {
    private faceIconLocation(): string | undefined {
        const assetBundle = this.props.servant.extraAssets.faces;

        if (assetBundle.ascension) {
            const asset = Object.values(assetBundle.ascension).shift();

            if (asset)
                return asset;
        }

        if (assetBundle.costume) {
            const asset = Object.values(assetBundle.costume).shift();

            if (asset)
                return asset;
        }

        return undefined;
    }

    render() {
        const faceIconLocation = this.faceIconLocation();

        return (
            <Link to={`/${this.props.region}/servant/${this.props.servant.collectionNo}`}>
                <ClassIcon className={this.props.servant.className}
                           rarity={this.props.servant.rarity}
                           height={this.props.iconHeight}/>
                {' '}
                {faceIconLocation ? (
                    <FaceIcon location={faceIconLocation}
                              rarity={this.props.servant.rarity}
                              type={this.props.servant.type}
                              height={this.props.iconHeight}/>
                ) : undefined}
                {faceIconLocation ? ' ' : undefined}
                {this.props.servant.name}
            </Link>
        );
    }
}

export default ServantDescriptor;
