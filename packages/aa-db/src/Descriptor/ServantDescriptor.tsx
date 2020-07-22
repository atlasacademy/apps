import React from "react";
import {Link} from "react-router-dom";
import Region from "../Api/Data/Region";
import Servant from "../Api/Data/Servant";
import ClassIcon from "../Component/ClassIcon";
import FaceIcon from "../Component/FaceIcon";

interface IProps {
    region: Region;
    servant: Servant;
    iconHeight?: number;
}

class ServantDescriptor extends React.Component<IProps> {
    private faceIconLocation(): string {
        const assetBundle = this.props.servant.extraAssets.faces,
            assetMap = Object.values(assetBundle).shift();

        return (assetMap ? Object.values(assetMap).shift() : undefined) ?? '';
    }

    render() {
        return (
            <Link to={`/${this.props.region}/servant/${this.props.servant.collectionNo}`}>
                <ClassIcon className={this.props.servant.className}
                           rarity={this.props.servant.rarity}
                           height={this.props.iconHeight}/>
                {' '}
                <FaceIcon location={this.faceIconLocation()}
                          rarity={this.props.servant.rarity}
                          type={this.props.servant.type}
                          height={this.props.iconHeight}/>
                {' '}
                {this.props.servant.name}
            </Link>
        );
    }
}

export default ServantDescriptor;
