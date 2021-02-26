import {Region} from "@atlasacademy/api-connector";
import {ProfileComment} from "@atlasacademy/api-connector/dist/Schema/Profile";
import React from "react";
import {Table} from "react-bootstrap";
import ProfileConditionDescriptor from "../../Descriptor/ProfileConditionDescriptor";
import {handleNewLine} from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    comments: ProfileComment[];
}

class ServantProfileComments extends React.Component<IProps> {
    render() {
        return (
            <div>
                <h3>Profile</h3>

                <Table>
                    <thead>
                    <tr>
                        <th>Condition</th>
                        <th>Message</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.comments.map((comment) => {
                        return (
                            <tr key={comment.id}>
                                <td>
                                    <ProfileConditionDescriptor region={this.props.region} comment={comment}/>
                                </td>
                                <td>{handleNewLine(comment.comment)}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default ServantProfileComments;
