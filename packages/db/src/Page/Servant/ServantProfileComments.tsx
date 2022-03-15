import React from "react";
import { Table } from "react-bootstrap";

import { Region } from "@atlasacademy/api-connector";
import { ProfileComment } from "@atlasacademy/api-connector/dist/Schema/Profile";

import ProfileCommentAddsDescriptor from "../../Descriptor/ProfileConditionAddDescriptor";
import ProfileConditionDescriptor from "../../Descriptor/ProfileConditionDescriptor";
import { replacePUACodePoints } from "../../Helper/StringHelper";

import "../../Helper/StringHelper.css";
import "./ServantProfileComments.css";

interface IProps {
    region: Region;
    comments: ProfileComment[];
}

class ServantProfileComments extends React.Component<IProps> {
    render() {
        return (
            <>
                <h3>Profile</h3>

                <Table responsive className="servant-comments">
                    <thead>
                        <tr>
                            <th>Condition</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.comments.map((comment) => {
                            return (
                                <tr key={`${comment.id}-${comment.priority}`}>
                                    <td className="profile-condition">
                                        <ProfileConditionDescriptor region={this.props.region} comment={comment} />
                                        <ProfileCommentAddsDescriptor
                                            region={this.props.region}
                                            commentAdds={comment.additionalConds}
                                        />
                                    </td>
                                    <td className="newline">{replacePUACodePoints(comment.comment)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </>
        );
    }
}

export default ServantProfileComments;
