import React from "react";

interface IProp {
    location: string;
    height?: number;
}

class BuffIcon extends React.Component<IProp> {

    render() {
        return (
            <img alt={''} src={this.props.location} style={{
                height: this.props.height ?? 25,
                minHeight: this.props.height ?? 25,
                verticalAlign: "bottom",
            }}/>
        );
    }

}

export default BuffIcon;
