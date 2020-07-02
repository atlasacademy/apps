import React from "react";
import {Table} from "react-bootstrap";

import "./DataTable.css";
import {Renderable} from "../Helper/OutputHelper";

interface IProp {
    header?: JSX.Element | string,
    data: {
        [key: string]: Renderable;
    }
}

class DataTable extends React.Component<IProp> {
    render() {
        return (
            <div>
                {this.props.header ? (
                    <div className={'data-header'}>
                        {this.props.header}
                    </div>
                ) : null}

                <Table bordered hover className={'data-table'}>
                    <tbody>
                    {Object.keys(this.props.data).map((key, index) => {
                        return (
                            <tr key={index}>
                                <th>{key}</th>
                                <td>{this.props.data[key]}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default DataTable;
