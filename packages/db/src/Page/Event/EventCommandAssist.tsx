import { useTranslation } from "react-i18next";

import { Event, Mission, Region } from "@atlasacademy/api-connector";

import EffectBreakdown from "../../Breakdown/EffectBreakdown";
import CondTargetValueDescriptor from "../../Descriptor/CondTargetValueDescriptor";
import { flatten } from "../../Helper/PolyFill";
import { lang } from "../../Setting/Manager";

const EventCommandAssist = ({
    region,
    commandAssists,
    missions,
    missionGroups,
}: {
    region: Region;
    commandAssists: Event.EventCommandAssist[];
    missions?: Map<number, Mission.Mission>;
    missionGroups?: Event.EventMissionGroup[];
}) => {
    const { t } = useTranslation();

    const assistIds = Array.from(new Set(commandAssists.map((assist) => assist.id))).sort((a, b) => a - b);

    return (
        <div className="mt-3">
            {assistIds.map((assistId, i) => {
                const assists = commandAssists.filter((assist) => assist.id === assistId);
                const assist = assists[0];
                const skillMaxLv = assists.map((assist) => assist.skillLv).reduce((a, b) => Math.max(a, b), 0);

                return (
                    <div key={assistId} className="mb-4">
                        <h3 lang={lang(region)}>
                            <img src={assist.image} alt={`Assist ${assist.name} icon`} height={50} className="mr-1" />
                            {assist.name}
                        </h3>
                        <div className="mb-3">
                            <b>{t("Release Conditions")}:</b>
                            <ol>
                                {flatten(assists.map((assist) => assist.releaseConditions)).map((cond, index) => (
                                    <li key={index}>
                                        <CondTargetValueDescriptor
                                            region={region}
                                            cond={cond.condType}
                                            target={cond.condId}
                                            value={cond.condNum}
                                            missions={missions}
                                            missionGroups={missionGroups}
                                        />
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <EffectBreakdown
                            region={region}
                            cooldowns={assist.skill.coolDown}
                            funcs={assist.skill.functions}
                            triggerSkillIdStack={[assist.skill.id]}
                            levels={skillMaxLv}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default EventCommandAssist;
