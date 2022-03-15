import React from "react";
import { Table } from "react-bootstrap";

import { Renderable } from "../Helper/OutputHelper";

import "./DataTable.css";

interface IProp {
    header?: JSX.Element | string;
    responsive?: boolean;
    data: {
        [key: string]: Renderable | object;
    };
}

class DataTable extends React.Component<IProp> {
    private static dumpValue(value: Renderable | object): Renderable {
        if (typeof value === "object") {
            const element = value as JSX.Element;
            if (element.key !== undefined && element.props !== undefined && element.type !== undefined) {
                return element;
            } else {
                return JSON.stringify(value);
            }
        }

        return value;
    }

    render() {
        return (
            <div>
                {this.props.header ? <div className={"data-header"}>{this.props.header}</div> : null}

                <Table bordered hover className={"data-table"} responsive={this.props.responsive}>
                    <tbody>
                        {Object.keys(this.props.data).map((key, index) => {
                            return (
                                <tr key={index}>
                                    <th>{key}</th>
                                    <td>{DataTable.dumpValue(this.props.data[key])}</td>
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
