import Func, {DataVal, FuncTargetTeam} from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export default function (region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal): void {
    const section = sections.team,
        parts = section.parts;

    if (func.funcTargetTeam === FuncTargetTeam.PLAYER)
        parts.push('[Player]');
    else if (func.funcTargetTeam === FuncTargetTeam.ENEMY)
        parts.push('[Enemy]');
    else
        section.showing = false;
}
