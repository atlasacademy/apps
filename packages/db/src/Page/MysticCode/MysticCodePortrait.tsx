import React from "react";

import { MysticCode } from "@atlasacademy/api-connector";

import "./MysticCodePortrait.css";

interface IProps {
    mysticCode: MysticCode.MysticCode;
}

class MysticCodePortrait extends React.Component<IProps> {
    render() {
        return (
            <div id={"mystic-code-portrait-wrapper"}>
                <a
                    href={this.props.mysticCode.extraAssets.masterFigure.male}
                    className={"mystic-code-portrait"}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img alt={this.props.mysticCode.name} src={this.props.mysticCode.extraAssets.masterFigure.male} />
                </a>

                <a
                    href={this.props.mysticCode.extraAssets.masterFigure.female}
                    className={"mystic-code-portrait"}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img alt={this.props.mysticCode.name} src={this.props.mysticCode.extraAssets.masterFigure.female} />
                </a>
            </div>
        );
    }
}

export default MysticCodePortrait;
