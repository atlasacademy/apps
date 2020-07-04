import React from "react";
import {Table} from "react-bootstrap";
import {ProfileComment} from "../../Api/Data/Profile";
import Region from "../../Api/Data/Region";
import ProfileConditionDescriptor from "../../Descriptor/ProfileConditionDescriptor";
import {joinElements} from "../../Helper/OutputHelper";

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
                    {this.props.comments.map((comment, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    <ProfileConditionDescriptor region={this.props.region} comment={comment}/>
                                </td>
                                <td>
                                    {joinElements(
                                        comment.comment.split("\n"),
                                        <br/>
                                    ).map((element, index) => {
                                        return <React.Fragment key={index}>{element}</React.Fragment>;
                                    })}
                                </td>
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
