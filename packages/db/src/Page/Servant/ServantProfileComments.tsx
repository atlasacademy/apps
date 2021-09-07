import { Region } from "@atlasacademy/api-connector";
import { ProfileComment } from "@atlasacademy/api-connector/dist/Schema/Profile";
import React from "react";
import { Table } from "react-bootstrap";
import ProfileConditionDescriptor from "../../Descriptor/ProfileConditionDescriptor";
import { replacePUACodePoints } from "../../Helper/StringHelper";

import "../../Helper/StringHelper.css";

interface IProps {
    region: Region;
    comments: ProfileComment[];
}

class ServantProfileComments extends React.Component<IProps> {
    render() {
        return (
            <>
                <h3>Profile</h3>

                <Table responsive>
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
                                    <td>
                                        <ProfileConditionDescriptor
                                            region={this.props.region}
                                            comment={comment}
                                        />
                                    </td>
                                    <td className="newline">
                                        {replacePUACodePoints(comment.comment)}
                                    </td>
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
