import { Region, Profile, CondType } from "@atlasacademy/api-connector";

import EntityReferenceDescriptor from "./EntityReferenceDescriptor";
import QuestDescriptor from "./QuestDescriptor";

const ProfileCommentAddDescriptor = ({
    region,
    commentAdd,
}: {
    region: Region;
    commentAdd: Profile.ProfileCommentAdd;
}) => {
    const condValue = commentAdd.condValues[0];
    switch (commentAdd.condType) {
        case CondType.QUEST_CLEAR:
            return (
                <>
                    <QuestDescriptor region={region} questId={condValue} /> Cleared
                </>
            );
        case CondType.SVT_LIMIT:
            return <>Ascension&nbsp;Lv.&nbsp;{condValue}</>;
        case CondType.SVT_GET:
            return (
                <>
                    Summoned <EntityReferenceDescriptor region={region} svtId={condValue} />{" "}
                </>
            );
        case CondType.SVT_FRIENDSHIP:
            return <>Bond&nbsp;Lv.&nbsp;{condValue}</>;
        case CondType.NONE:
            return <></>;
        default:
            return (
                <>
                    condType {commentAdd.condType} condValues {commentAdd.condValues}
                </>
            );
    }
};

const ProfileCommentAddsDescriptor = ({
    region,
    commentAdds,
}: {
    region: Region;
    commentAdds: Profile.ProfileCommentAdd[];
}) => {
    return (
        <>
            {commentAdds.map((commentAdd) => (
                <div key={commentAdd.idx}>
                    <ProfileCommentAddDescriptor region={region} commentAdd={commentAdd} />
                    <br />
                </div>
            ))}
        </>
    );
};

export default ProfileCommentAddsDescriptor;
