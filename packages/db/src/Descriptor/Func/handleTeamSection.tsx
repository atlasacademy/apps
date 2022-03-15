import { faDragon, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DataVal, Func, Region } from "@atlasacademy/api-connector";

import { FuncDescriptorSections } from "./FuncDescriptorSections";

export default function handleTeamSection(
    region: Region,
    sections: FuncDescriptorSections,
    func: Func.BasicFunc,
    dataVal: DataVal.DataVal
): void {
    const section = sections.team,
        parts = section.parts;

    if (func.funcTargetTeam === Func.FuncTargetTeam.PLAYER)
        parts.push(<FontAwesomeIcon icon={faUser} title="Can be applied to player-controlled servants" />);
    else if (func.funcTargetTeam === Func.FuncTargetTeam.ENEMY)
        parts.push(<FontAwesomeIcon icon={faDragon} title="Can be applied to computer-controlled opponents" />);
    else section.showing = false;
}
