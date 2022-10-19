import React from "react";

import "./BuffIcon.css";

interface IProp {
    location: string;
    alt?: string;
    height?: number;
    passiveFrame?: boolean;
    hideState?: boolean;
}

class BuffIcon extends React.Component<IProp> {
    render() {
        const classNames = ["buff-icon"];
        if (this.props.passiveFrame) classNames.push("passive-frame");
        if (this.props.hideState) classNames.push("hide-state");

        return (
            <img
                alt={this.props.alt ?? ""}
                src={this.props.location}
                width={110}
                height={110}
                className={classNames.join(" ")}
                style={{
                    height: this.props.height ?? 25,
                    minHeight: this.props.height ?? 25,
                }}
            />
        );
    }
}

export default BuffIcon;
