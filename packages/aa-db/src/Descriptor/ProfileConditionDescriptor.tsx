import React from "react";
import {CommentConditionType, ProfileComment} from "../Api/Data/Profile";
import Region from "../Api/Data/Region";
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
            if (comment.condType === CommentConditionType.NONE) {
                condition = "None";
            } else if (
                comment.condType === CommentConditionType.QUEST_CLEAR
                && comment.condValues.length > 0
            ) {
                condition = <React.Fragment>
                    <QuestDescriptor region={this.props.region}
                                     questId={comment.condValues[0]}
                                     questPhase={comment.condValue2}/>
                    &nbsp;Cleared
                </React.Fragment>;
            } else if (
                comment.condType === CommentConditionType.SVT_FRIENDSHIP
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
