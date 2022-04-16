import React from "react";
import { Row, Col, Table } from "react-bootstrap";

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
                    <thead className="servant-comments-header">
                        <tr>
                            <th>
                                <Row className="m-0">
                                    <Col sm={12} md={2} className="pl-0">
                                        Condition
                                    </Col>
                                    <Col className="pr-0">Message</Col>
                                </Row>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.comments.map((comment) => {
                            return (
                                <tr key={`${comment.id}-${comment.priority}`}>
                                    <td>
                                        <Row className="m-0">
                                            <Col sm={12} md={2} className="pl-0">
                                                <b>
                                                    <ProfileConditionDescriptor
                                                        region={this.props.region}
                                                        comment={comment}
                                                    />
                                                    <ProfileCommentAddsDescriptor
                                                        region={this.props.region}
                                                        commentAdds={comment.additionalConds}
                                                    />
                                                </b>
                                            </Col>
                                            <Col className="newline pr-0">{replacePUACodePoints(comment.comment)}</Col>
                                        </Row>
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
