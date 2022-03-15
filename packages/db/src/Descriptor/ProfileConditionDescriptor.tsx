import React from "react";

import { CondType, Profile, Region } from "@atlasacademy/api-connector";

import QuestDescriptor from "./QuestDescriptor";

interface IProps {
    region: Region;
    comment: Profile.ProfileComment;
}

class ProfileConditionDescriptor extends React.Component<IProps> {
    render() {
        const comment = this.props.comment;

        if (comment.condType === CondType.NONE) {
            return comment.additionalConds.length > 0 ? <></> : <>None</>;
        } else if (comment.condType === CondType.QUEST_CLEAR && comment.condValues && comment.condValues.length > 0) {
            return (
                <>
                    <QuestDescriptor
                        text={this.props.comment.condMessage}
                        region={this.props.region}
                        questId={comment.condValues[0]}
                        questPhase={Math.max(comment.condValue2, 1)}
                    />
                    {!this.props.comment.condMessage ? " Cleared" : ""}
                </>
            );
        } else if (
            comment.condType === CondType.SVT_FRIENDSHIP &&
            comment.condValues &&
            comment.condValues.length > 0
        ) {
            return <>Bond&nbsp;Lv.&nbsp;{comment.condValues[0]}</>;
        } else {
            return <>{this.props.comment.condMessage}</>;
        }
    }
}

export default ProfileConditionDescriptor;
