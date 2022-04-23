import { Region } from "@atlasacademy/api-connector";

import QuestDescriptor from "../../Descriptor/QuestDescriptor";

const ServantRelatedQuests = (props: { region: Region; questIds: number[]; title?: string }) => {
    if (props.questIds.length > 0) {
        return (
            <>
                <h3>{props.title ?? "Servant Quest"}</h3>
                <ul>
                    {props.questIds.map((questId) => (
                        <li key={questId}>
                            <QuestDescriptor region={props.region} questId={questId} />
                        </li>
                    ))}
                </ul>
            </>
        );
    } else {
        return null;
    }
};

export default ServantRelatedQuests;
