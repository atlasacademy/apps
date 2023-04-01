import { Region, Skill } from "@atlasacademy/api-connector";

import EffectBreakdown from "../Breakdown/EffectBreakdown";
import { lang } from "../Setting/Manager";

const SkillGroupOverWrite = ({
    region,
    overwrites,
    levels,
}: {
    region: Region;
    overwrites: Skill.SkillGroupOverwrite[];
    levels?: number;
}) => {
    const overwrite = overwrites[0];
    const title = `Overwrite Effect from ${new Date(overwrite.startedAt * 1000).toLocaleString()} to ${new Date(
        overwrite.endedAt * 1000
    ).toLocaleString()}`;

    return (
        <>
            <p className="text-prewrap" lang={lang(region)}>
                {overwrite.detail}
            </p>
            <EffectBreakdown region={region} funcs={overwrite.functions} levels={levels} tableTitle={title} />
        </>
    );
};

export default SkillGroupOverWrite;
