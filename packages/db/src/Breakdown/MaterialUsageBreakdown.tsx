import {Servant, Region} from "@atlasacademy/api-connector";
import React from "react";
import {Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import FaceIcon from "../Component/FaceIcon";
import {MaterialUsageData} from "../Page/Material/MaterialUsageData";

interface IProps {
    region: Region;
    usageData: MaterialUsageData[];
    servants: Servant.Servant[];
}

class MaterialUsageBreakdown extends React.Component<IProps> {
    render() {
        const servants = this.props.servants,
            region = this.props.region,
            usageData = this.props.usageData;

        return (
            <Table hover>
                <thead>
                <tr>
                    <th style={{textAlign: "center", width: '1px'}}>Thumbnail</th>
                    <th>Servant</th>
                    <th>Uses in Ascension</th>
                    <th>Uses in Skill</th>
                    <th>Uses in Costume</th>
                    <th>Total Uses</th>
                </tr>
                {usageData.map(servantUsage => {
                    const servant = servants.find(basicServant => basicServant.id === servantUsage.id);
                    if (!servant) return null;
                    const route = `/${region}/servant/${servant.id}/materials`;

                    return (
                        <tr key={servant.id}>
                            <td align={"center"}>
                                <Link to={route}>
                                    <FaceIcon location={servant.extraAssets?.faces.ascension ? servant.extraAssets?.faces.ascension[1] : ""}
                                              height={50}/>
                                </Link>
                            </td>
                            <td>
                                <Link to={route}>
                                    {servant.name}
                                </Link>
                            </td>
                            <td>{servantUsage.ascensions}</td>
                            <td>{servantUsage.skills}</td>
                            <td>{servantUsage.costumes}</td>
                            <td>{servantUsage.total}</td>
                        </tr>
                    );
                })}
                </thead>
            </Table>
        );
    }
}

export default MaterialUsageBreakdown;
