import { DataVal, Func, Region } from "@atlasacademy/api-connector";

import { t } from "../../i18n";
import { FuncDescriptorSections } from "./FuncDescriptorSections";

export default function handleOptionSection(
    region: Region,
    sections: FuncDescriptorSections,
    func: Func.BasicFunc,
    dataVal: DataVal.DataVal
): void {
    const section = sections.option,
        parts = section.parts;

    if (dataVal.ActSelectIndex !== undefined) parts.push(`[${t("Option")} ${dataVal.ActSelectIndex + 1}]`);
}
