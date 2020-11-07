import React from "react";
import {Servant} from "@atlasacademy/api-connector";
import {Table} from "react-bootstrap";

import "./ServantBondGrowth.css";
import {formatNumber} from "../../Helper/OutputHelper";
import BondIcon from "../../Component/BondIcon";

export default (props : { bondGrowth: Servant.Servant["bondGrowth"] }) => {
    let { bondGrowth: bond } = props;
    let rows = [(
        <>
            <thead>
                {/* indexes */}
                <tr>{Array(10).fill(0).map((_, __) => (
                    <th key={`bond_${__}`}>
                        <BondIcon level={__ + 1} />
                        &nbsp;&nbsp;
                        {__ + 1}
                    </th>
                ))}</tr>
            </thead>
            <tbody>
                <tr>{bond.slice(0, 10).map(values => <td>{formatNumber(values)}</td>)}</tr>
            </tbody>
        </>
    )];
    if (bond.length > 10)
        rows.push(
            <>
                <thead>
                {/* indexes */}
                    <tr>{Array(5).fill(0).map((_, __) => <th colSpan={2}>{__ + 11}</th>)}</tr>
                </thead>
                <tbody>
                    <tr>{bond.slice(10, 15).map(values => <td colSpan={2}>{formatNumber(values)}</td>)}</tr>
                </tbody>
            </>
        )
    return (
        <div>
            <br />
            <h3>Bond levels</h3>
            <Table striped bordered className={'servant-bond-table'}>
                {rows}
            </Table>
        </div>
    )
}