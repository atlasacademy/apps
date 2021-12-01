import React from "react";

interface IProp {
    location: string;
    height?: number;
    passiveFrame?: boolean;
}

class BuffIcon extends React.Component<IProp> {
    render() {
        return (
            <img
                alt={""}
                src={this.props.location}
                width={110}
                height={110}
                style={{
                    width: "auto",
                    height: this.props.height ?? 25,
                    minHeight: this.props.height ?? 25,
                    verticalAlign: "bottom",
                    border: this.props.passiveFrame ? "1px solid" : "none",
                    borderRadius: "5px",
                }}
            />
        );
    }
}

export default BuffIcon;
