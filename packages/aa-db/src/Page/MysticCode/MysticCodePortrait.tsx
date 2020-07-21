import React from "react";
import MysticCode, {MysticCodeAssetMap} from "../../Api/Data/MysticCode";

import "./MysticCodePortrait.css";

interface IProps {
    mysticCode: MysticCode;
}

interface IState {
    assetMap: MysticCodeAssetMap;
}

class MysticCodePortrait extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const assetMap = props.mysticCode.extraAssets.masterFigure;

        this.state = {assetMap};
    }

    render() {
        return (
            <div id={'mystic-code-portrait-wrapper'}>
                <a href={this.state.assetMap.male}
                   className={'mystic-code-portrait'}
                   target='_blank' rel="noopener noreferrer">
                    <img alt={this.props.mysticCode.name}
                         src={this.state.assetMap.male}/>
                </a>

                <a href={this.state.assetMap.female}
                   className={'mystic-code-portrait'}
                   target='_blank' rel="noopener noreferrer">
                    <img alt={this.props.mysticCode.name}
                         src={this.state.assetMap.female}/>
                </a>
            </div>
        );
    }
}

export default MysticCodePortrait;
