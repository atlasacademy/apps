import React from "react";
import { Link } from "react-router-dom";

import { Enemy, Region } from "@atlasacademy/api-connector";

import ClassIcon from "../Component/ClassIcon";
import FaceIcon from "../Component/FaceIcon";

import "./Descriptor.css";

interface IProps {
    region: Region;
    enemy: Enemy.EnemyBasic;
    iconHeight?: number;
    tab?: string;
    overwriteName?: string;
}

class EnemyDescriptor extends React.Component<IProps> {
    render() {
        return (
            <Link
                to={`/${this.props.region}/enemy/${this.props.enemy.id}` + (this.props.tab ? `/${this.props.tab}` : "")}
                className="descriptor-link"
            >
                <ClassIcon
                    className={this.props.enemy.className}
                    rarity={this.props.enemy.rarity}
                    height={this.props.iconHeight}
                />{" "}
                <FaceIcon
                    type={this.props.enemy.type}
                    rarity={this.props.enemy.rarity}
                    location={this.props.enemy.face}
                    height={this.props.iconHeight}
                    mightNotExist={true}
                />{" "}
                <span className="hover-text">[{this.props.overwriteName ?? this.props.enemy.name}]</span>
            </Link>
        );
    }
}

export default EnemyDescriptor;
