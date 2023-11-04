import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

import { CondType, Profile, Region } from "@atlasacademy/api-connector";

import QuestDescriptor from "./QuestDescriptor";

interface IProps extends WithTranslation {
    region: Region;
    comment: Profile.ProfileComment;
}

class ProfileConditionDescriptor extends React.Component<IProps> {
    render() {
        const { comment, t } = this.props;

        if (comment.condType === CondType.NONE) {
            return comment.additionalConds.length > 0 ? <></> : <>{t("None")}</>;
        } else if (comment.condType === CondType.QUEST_CLEAR && comment.condValues && comment.condValues.length > 0) {
            return (
                <>
                    <QuestDescriptor
                        text={this.props.comment.condMessage}
                        region={this.props.region}
                        questId={comment.condValues[0]}
                        questPhase={Math.max(comment.condValue2, 1)}
                    />
                    {!this.props.comment.condMessage ? ` ${t("Cleared")}` : ""}
                </>
            );
        } else if (
            comment.condType === CondType.SVT_FRIENDSHIP &&
            comment.condValues &&
            comment.condValues.length > 0
        ) {
            return <span className="text-nowrap">{t("Bond Level", { level: comment.condValues[0] })}</span>;
        } else {
            return <>{this.props.comment.condMessage}</>;
        }
    }
}

export default withTranslation()(ProfileConditionDescriptor);
