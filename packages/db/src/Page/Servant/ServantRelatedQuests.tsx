import { Region } from "@atlasacademy/api-connector";
import QuestDescriptor from "../../Descriptor/QuestDescriptor";

const ServantRelatedQuests = (props: {
    region: Region;
    questIds: number[];
}) => {
    if (props.questIds.length > 0) {
        return (
            <div style={{ marginBottom: "2em" }}>
                <h3>Servant Quest</h3>
                <ul>
                    {props.questIds.map((questId) => (
                        <li key={questId}>
                            <QuestDescriptor
                                text=""
                                region={props.region}
                                questId={questId}
                                questPhase={1}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        );
    } else {
        return null;
    }
};

export default ServantRelatedQuests;
