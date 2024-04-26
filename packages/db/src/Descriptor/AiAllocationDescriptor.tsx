import { useTranslation } from "react-i18next";

import { Ai, Quest, Region, Trait } from "@atlasacademy/api-connector";

import { doIntersect, traitIntersect } from "../Helper/ArrayHelper";
import AiDescriptor from "./AiDescriptor";

export const findOwnAiAllocation = (aiAllocation: Quest.AiAllocation[]) =>
    aiAllocation.filter(
        (ai) =>
            ai.applySvtType.length === 0 ||
            doIntersect(ai.applySvtType, [
                Quest.AiAllocationSvtFlag.ALL,
                Quest.AiAllocationSvtFlag.OWN,
                Quest.AiAllocationSvtFlag.FRIEND,
            ])
    );

export const findSupportAiAllocation = (traits: Trait.Trait[], stages: Quest.Stage[]) => {
    return stages.filter(
        (stage) =>
            stage.aiAllocations !== undefined &&
            stage.aiAllocations.some(
                (ai) =>
                    traitIntersect([ai.individuality], traits) &&
                    doIntersect(ai.applySvtType, [Quest.AiAllocationSvtFlag.ALL, Quest.AiAllocationSvtFlag.NPC])
            )
    );
};
export const AiAllocationDescriptor = ({
    region,
    traits,
    stages,
    skill1,
    skill2,
    skill3,
}: {
    region: Region;
    traits: Trait.Trait[];
    stages: Quest.Stage[];
    skill1?: number;
    skill2?: number;
    skill3?: number;
}) => {
    const { t } = useTranslation();
    const matchedStages = findSupportAiAllocation(traits, stages);

    const aiDesc = (aiAllocations: Quest.AiAllocation[]) =>
        aiAllocations
            .filter((ai) => traitIntersect([ai.individuality], traits))
            .map((ai) => ai.aiIds)
            .flat()
            .map((aiId) => (
                <AiDescriptor
                    region={region}
                    aiType={Ai.AiType.SVT}
                    id={aiId}
                    skill1={skill1}
                    skill2={skill2}
                    skill3={skill3}
                />
            ));

    if (matchedStages.length === 1)
        return (
            <>
                {t("Stage")} {matchedStages[0].wave}: {aiDesc(matchedStages[0].aiAllocations ?? [])}
            </>
        );

    return (
        <ul className="mb-0">
            {matchedStages.map((stage) => (
                <li key={stage.wave}>
                    {t("Stage")} {stage.wave}: {aiDesc(stage.aiAllocations ?? [])}
                </li>
            ))}
        </ul>
    );
};
