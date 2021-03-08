import { Quest, Region } from "@atlasacademy/api-connector";
import BgmDescriptor from "../Descriptor/BgmDescriptor";

export const QuestStage = (props: { region: Region; stage: Quest.Stage }) => {
    const stage = props.stage;
    return (
        <div style={{ marginTop: "1em" }}>
            <BgmDescriptor region={props.region} bgm={stage.bgm} />
        </div>
    );
};

export default QuestStage;
