import React from "react";
import ClassName from "../Api/Data/ClassName";

const classTypes = new Map<number, number>([
    [1, 1],
    [2, 1],
    [3, 2],
    [4, 3],
    [5, 3],
]);
const unknownClassType = 3;
const classIds = new Map<ClassName, number>([
    [ClassName.SABER, 1],
    [ClassName.ARCHER, 2],
    [ClassName.LANCER, 3],
    [ClassName.RIDER, 4],
    [ClassName.CASTER, 5],
    [ClassName.ASSASSIN, 6],
    [ClassName.BERSERKER, 7],
    [ClassName.SHIELDER, 8],
    [ClassName.RULER, 9],
    [ClassName.ALTER_EGO, 10],
    [ClassName.AVENGER, 11],
    [ClassName.MOON_CANCER, 23],
    [ClassName.FOREIGNER, 25],
    [ClassName.BEAST_I, 20],
    [ClassName.BEAST_II, 20],
    [ClassName.BEAST_IIIL, 20],
    [ClassName.BEAST_IIIR, 20],
    [ClassName.BEAST_UNKNOWN, 20],
]);
const unknownClassId = 12;

interface IProps {
    className: ClassName;
    rarity?: number;
    height?: number;
}

class ClassIcon extends React.Component<IProps> {
    render() {
        return (
            <img alt={''} src={this.location()}
                 style={this.props.height ? {height: this.props.height} : undefined}/>
        );
    }

    private location(): string {
        let classId = classIds.has(this.props.className) ? classIds.get(this.props.className) : unknownClassId,
            rarity = this.props.rarity ?? 5,
            type = classTypes.has(rarity) ? classTypes.get(rarity) : unknownClassType;

        return `https://assets.atlasacademy.io/GameData/NA/ClassIcons/class${type}_${classId}.png`;
    }
}

export default ClassIcon;
