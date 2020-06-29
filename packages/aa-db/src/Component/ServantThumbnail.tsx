import React from "react";

interface IProps {
    rarity: number;
    location: string;
    height?: number;
}

class ServantThumbnail extends React.Component<IProps> {

    render() {
        return (
            <img alt={''} src={this.props.location}
                 style={this.props.height ? {height: this.props.height} : undefined}/>
        );
    }

}

export default ServantThumbnail;
