import { faLink, faLinkSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DataVal, Func, Region } from "@atlasacademy/api-connector";

import { FuncDescriptorSections } from "./FuncDescriptorSections";

export default function handleLinkageSection(
    region: Region,
    sections: FuncDescriptorSections,
    func: Func.BasicFunc,
    dataVal: DataVal.DataVal
): void {
    const section = sections.linkage,
        parts = section.parts;

    if (dataVal.CheckDuplicate === 1) {
        parts.push("[This function instance can only be executed once]");
    }

    if (dataVal.AddLinkageTargetIndividualty !== undefined && dataVal.BehaveAsFamilyBuff === 1) {
        parts.push(
            <>
                [<FontAwesomeIcon icon={faLink} title="Linkage Trait" />
                {dataVal.UnSubStateWhileLinkedToOthers === 1 ? (
                    <FontAwesomeIcon icon={faLinkSlash} title="Remove this buff if the linked trait is removed" />
                ) : null}
                {dataVal.AddLinkageTargetIndividualty}]
            </>
        );
    }
}
