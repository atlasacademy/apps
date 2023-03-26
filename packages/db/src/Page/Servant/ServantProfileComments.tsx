import React from "react";
import { Col, Row, Table } from "react-bootstrap";
import { WithTranslation, withTranslation } from "react-i18next";

import { Region } from "@atlasacademy/api-connector";
import { ProfileComment } from "@atlasacademy/api-connector/dist/Schema/Profile";

import ProfileCommentAddsDescriptor from "../../Descriptor/ProfileConditionAddDescriptor";
import ProfileConditionDescriptor from "../../Descriptor/ProfileConditionDescriptor";
import { FGOText } from "../../Helper/StringHelper";
import { lang } from "../../Setting/Manager";

import "../../Helper/StringHelper.css";
import "./ServantProfileComments.css";

interface IProps extends WithTranslation {
    region: Region;
    comments: ProfileComment[];
}

export class ServantProfileComments extends React.Component<IProps> {
    render() {
        const { t } = this.props;
        return (
            <>
                <h3>{t("Profile")}</h3>

                <Table responsive className="servant-comments">
                    <thead className="servant-comments-header">
                        <tr>
                            <th>
                                <Row className="m-0">
                                    <Col sm={12} md={2} className="pl-0">
                                        {t("Condition")}
                                    </Col>
                                    <Col className="pr-0">{t("Message")}</Col>
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
                                            <Col className="newline pr-0" lang={lang(this.props.region)}>
                                                <FGOText text={comment.comment} />
                                            </Col>
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

export default withTranslation()(ServantProfileComments);
