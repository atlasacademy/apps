import React from "react";

import { ClassName } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import { AssetHost } from "../Api";
import { SvtClassDescriptor } from "../Descriptor/SvtClassDestriptor";

const classTypes = new Map<number, number>([
    [0, 0],
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
    [ClassName.GRAND_CASTER, 5],
    [ClassName.BEAST_I, 21],
    [ClassName.BEAST_II, 20],
    [ClassName.BEAST_IIIL, 24],
    [ClassName.BEAST_IIIR, 24],
    [ClassName.BEAST_UNKNOWN, 26],
    [ClassName.PRETENDER, 28],
    [ClassName.BEAST_IV, 29],
    [ClassName.BEAST_I_LOST, 30],
    [ClassName.U_OLGA_MARIE_ALIEN_GOD, 31],
    [ClassName.U_OLGA_MARIE, 32],
    [ClassName.BEAST, 33],
    [ClassName.BEAST_VI, 34],
    [ClassName.BEAST_VI_BOSS, 35],
    [ClassName.CCC_FINALE_EMIYA_ALTER, 124],

    [ClassName.ALL, 1001],
    [ClassName.EXTRA, 1002],
    [ClassName.EXTRA_I, 1004],
    [ClassName.EXTRA_II, 1005],
    [ClassName.UNKNOWN, 97],
]);
const unknownClassId = 12;

interface IProps {
    className: ClassName;
    rarity?: number;
    height?: number;
    textFallback?: boolean;
}

class ClassIcon extends React.Component<IProps> {
    render() {
        if (!classIds.has(this.props.className) && this.props.textFallback) {
            return <SvtClassDescriptor svtClass={this.props.className} />;
        }
        return (
            <img
                alt={`${this.props.className} class icon`}
                title={`${toTitleCase(this.props.className)}`}
                src={this.location()}
                width={this.props.height ?? 24}
                height={this.props.height ?? 24}
            />
        );
    }

    private location(): string {
        let classId = classIds.has(this.props.className) ? classIds.get(this.props.className) : unknownClassId,
            rarity = this.props.rarity ?? 5,
            type = classTypes.has(rarity) ? classTypes.get(rarity) : unknownClassType;

        return `${AssetHost}/JP/ClassIcons/class${type}_${classId}.png`;
    }
}

export default ClassIcon;
export { classIds };
