import {ProfileCommentConditionType, Region} from "@atlasacademy/api-connector";
import {ProfileComment} from "@atlasacademy/api-connector/dist/Schema/Profile";
import React from "react";
import QuestDescriptor from "./QuestDescriptor";

interface IProps {
    region: Region;
    comment: ProfileComment;
}

class ProfileConditionDescriptor extends React.Component<IProps> {
    render() {
        const comment = this.props.comment;

        let condition: JSX.Element | string = this.props.comment.condMessage;

        if (!condition) {
            if (comment.condType === ProfileCommentConditionType.NONE) {
                condition = "None";
            } else if (
                comment.condType === ProfileCommentConditionType.QUEST_CLEAR
                && comment.condValues
                && comment.condValues.length > 0
            ) {
                condition = <React.Fragment>
                    <QuestDescriptor region={this.props.region}
                                     questId={comment.condValues[0]}
                                     questPhase={comment.condValue2}/>
                    &nbsp;Cleared
                </React.Fragment>;
            } else if (
                comment.condType === ProfileCommentConditionType.SVT_FRIENDSHIP
                && comment.condValues
                && comment.condValues.length > 0
            ) {
                condition = `Bond Level ${comment.condValues[0]}`;
            }
        }

        return (
            <span>{condition}</span>
        );
    }
}

export default ProfileConditionDescriptor;
