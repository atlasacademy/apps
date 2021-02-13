import {Profile, Region, CondType} from "@atlasacademy/api-connector";
import React from "react";
import QuestDescriptor from "./QuestDescriptor";

interface IProps {
    region: Region;
    comment: Profile.ProfileComment;
}

class ProfileConditionDescriptor extends React.Component<IProps> {
    render() {
        const comment = this.props.comment;

        let condition: JSX.Element | string;

        if (comment.condType === CondType.NONE) {
            condition = "None";
        } else if (
            comment.condType === CondType.QUEST_CLEAR
            && comment.condValues
            && comment.condValues.length > 0
        ) {
            condition = <React.Fragment>
                <QuestDescriptor text={this.props.comment.condMessage}
                                 region={this.props.region}
                                 questId={comment.condValues[0]}
                                 questPhase={Math.max(comment.condValue2, 1)}/>
                {!this.props.comment.condMessage? "Cleared": ""}
            </React.Fragment>;
        } else if (
            comment.condType === CondType.SVT_FRIENDSHIP
            && comment.condValues
            && comment.condValues.length > 0
        ) {
            condition = `Bond Level ${comment.condValues[0]}`;
        } else {
            condition = this.props.comment.condMessage;
        }

        return (
            <span>{condition}</span>
        );
    }
}

export default ProfileConditionDescriptor;
