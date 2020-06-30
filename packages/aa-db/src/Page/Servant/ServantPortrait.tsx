import React from "react";
import ServantEntity from "../../Api/Data/ServantEntity";

interface IProps {
    servant: ServantEntity;
}

class ServantPortrait extends React.Component<IProps> {
    render() {
        return (
            <div>
                <img alt={this.props.servant.name}
                     className={'profile'}
                     src={this.props.servant.extraAssets.charaGraph.ascension["1"]}/>
            </div>
        );
    }
}

export default ServantPortrait;
