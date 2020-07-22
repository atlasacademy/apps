import {AxiosError} from "axios";
import React from "react";
import {Table} from "react-bootstrap";
import Connection from "../Api/Connection";
import Buff from "../Api/Data/Buff";
import Region from "../Api/Data/Region";
import BuffIcon from "../Component/BuffIcon";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import FuncDescriptor from "../Descriptor/FuncDescriptor";
import TraitDescriptor from "../Descriptor/TraitDescriptor";
import {mergeElements} from "../Helper/OutputHelper";

interface IProps {
    region: Region;
    id: number;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    buff?: Buff;
}

class BuffPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
        };
    }

    componentDidMount() {
        this.loadBuff();
    }

    async loadBuff() {
        try {
            const buff = await Connection.buff(this.props.region, this.props.id);

            this.setState({
                loading: false,
                buff: buff,
            });
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading || !this.state.buff)
            return <Loading/>;

        const buff = this.state.buff;

        return (
            <div>
                <h1>
                    <BuffIcon location={buff.icon} height={48}/>
                    &nbsp;
                    {buff.name}
                </h1>

                <br/>

                <DataTable data={{
                    "Data": <RawDataViewer data={buff}/>,
                    "Raw": <RawDataViewer
                        data={`https://api.atlasacademy.io/raw/${this.props.region}/buff/${buff.id}`}/>,
                    "ID": buff.id,
                    "Name": buff.name,
                    "Detail": buff.detail,
                    "Type": buff.type,
                    "Buff Traits": (
                        <div>
                            {mergeElements(
                                buff.vals.map(
                                    trait => <TraitDescriptor region={this.props.region} trait={trait}/>
                                ),
                                ' '
                            )}
                        </div>
                    ),
                    "Target Traits": (
                        <div>
                            {mergeElements(
                                buff.tvals.map(
                                    trait => <TraitDescriptor region={this.props.region} trait={trait}/>
                                ),
                                ' '
                            )}
                        </div>
                    ),
                    "Required Self Traits": (
                        <div>
                            {mergeElements(
                                buff.ckSelfIndv.map(
                                    trait => <TraitDescriptor region={this.props.region} trait={trait}/>
                                ),
                                ' '
                            )}
                        </div>
                    ),
                    "Required Opponent Traits": (
                        <div>
                            {mergeElements(
                                buff.ckOpIndv.map(
                                    trait => <TraitDescriptor region={this.props.region} trait={trait}/>
                                ),
                                ' '
                            )}
                        </div>
                    )
                }}/>

                <h3>Related Functions</h3>
                <Table>
                    <thead>
                    <tr>
                        <th>Function</th>
                        <th>Usage Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {buff.reverseFunctions.map((func, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    <FuncDescriptor region={this.props.region} func={func}/>
                                </td>
                                <td>
                                    {func.reverseTds.length + func.reverseSkills.length}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default BuffPage;
