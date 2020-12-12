import {Enemy, Region} from "@atlasacademy/api-connector";
import React from "react";
import {Link} from "react-router-dom";
import ClassIcon from "../Component/ClassIcon";
import './Descriptor.css';

interface IProps {
    region: Region;
    enemy: Enemy.Enemy;
    iconHeight?: number;
}

class EnemyDescriptor extends React.Component<IProps> {
    render() {
        return (
            <Link
                to={`/${this.props.region}/enemy/${this.props.enemy.id}`}
                style={{textDecoration: "none", whiteSpace: "nowrap"}}
            >
                <ClassIcon className={this.props.enemy.className}
                           rarity={this.props.enemy.rarity}
                           height={this.props.iconHeight}/>
                {' '}
                <span className="hoverText" style={{whiteSpace: "normal"}}>
                    [{this.props.enemy.name}]
                </span>
            </Link>
        );
    }
}

export default EnemyDescriptor;
