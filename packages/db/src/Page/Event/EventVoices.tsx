import React from "react";

import { Region, Profile, Servant, Event } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import renderCollapsibleContent from "../../Component/CollapsibleContent";
import { VoiceLinesTable } from "../Servant/ServantVoiceLines";

const EventVoices = ({
    region,
    voiceGroups,
    servants,
    eventRewardScenes,
}: {
    region: Region;
    voiceGroups: Profile.VoiceGroup[];
    servants: Map<number, Servant.ServantBasic>;
    eventRewardScenes: Event.EventRewardScene[];
}) => {
    return (
        <>
            {voiceGroups.map((voiceGroup) => {
                let guideName = `Guide ${voiceGroup.svtId}`;

                for (const rewardScene of eventRewardScenes) {
                    for (const guide of rewardScene.guides) {
                        if (guide.imageId === voiceGroup.svtId && guide.displayName) {
                            guideName = guide.displayName;
                        }
                    }
                }

                if (servants.has(voiceGroup.svtId)) {
                    guideName = servants.get(voiceGroup.svtId)!.name;
                }

                const title = guideName + " " + toTitleCase(voiceGroup.type);

                const voiceLineTable = (
                    <VoiceLinesTable
                        region={region}
                        voice={voiceGroup}
                        mergedDownloadNamePrefix={title}
                        servants={servants}
                        costumes={{}}
                    />
                );

                const voiceGroupKey = `${voiceGroup.svtId}-${voiceGroup.voicePrefix}-${voiceGroup.type}`;

                return (
                    <React.Fragment key={voiceGroupKey}>
                        {renderCollapsibleContent({
                            title,
                            content: voiceLineTable,
                            subheader: false,
                            accordionKey: voiceGroupKey,
                        })}
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default EventVoices;
