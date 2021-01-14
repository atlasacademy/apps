import {Servant, Region} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";
import React from "react";
import {Table} from "react-bootstrap";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import {Link} from "react-router-dom";
import FaceIcon from "../Component/FaceIcon";
import {MaterialUsageData} from "../Page/Material/MaterialUsageData";
import Api from "../Api";
import Manager from "../Setting/Manager";

interface IProps {
    region: Region;
    usageData: MaterialUsageData[];
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    servants: Servant.ServantBasic[];
}

class MaterialUsageBreakdown extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            servants: [],
        };
    }

    componentDidMount() {
        try {
            Manager.setRegion(this.props.region);
            Api.servantList().then(servantList => {
                this.setState({
                    loading: false,
                    servants: servantList,
                });
            });
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    private servants(): Servant.ServantBasic[] {
        return this.state.servants;
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading)
            return <Loading/>;

        const servants = this.servants(),
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
                    const servantBasic = servants.find(basicServant => basicServant.id === servantUsage.id);
                    if (!servantBasic) return null;
                    const route = `/${region}/servant/${servantBasic.id}/materials`;

                    return (
                        <tr key={servantBasic.id}>
                            <td align={"center"}>
                                <Link to={route}>
                                    <FaceIcon location={servantBasic.face}
                                              height={50}/>
                                </Link>
                            </td>
                            <td>
                                <Link to={route}>
                                    {servantBasic.name}
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
