import React from "react";
import {Servant} from "@atlasacademy/api-connector";
import {Table, OverlayTrigger, Tooltip} from "react-bootstrap";

import "./ServantBondGrowth.css";
import {formatNumber} from "../../Helper/OutputHelper";
import BondIcon from "../../Component/BondIcon";

function BondCell (props = { value: 0, span: 1, previous: NaN }) {
    let diff = (props.value - props.previous),
        cell = <td colSpan={props.span}>{formatNumber(props.value)}</td>;
    let diffText = diff > 0 ? `From previous level : ${formatNumber(diff)}` : '';
    return (
        diffText
        ? <OverlayTrigger
            placement="bottom"
            overlay={p => (<Tooltip id={`tooltip_bond_${props.value}`} {...p}>{diffText}</Tooltip>)}>
            {cell}
        </OverlayTrigger>
        : cell
    );

}

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
                <tr>{bond.slice(0, 10).map((value, index, a) => <BondCell value={value} span={1} previous={+bond[index - 1]} />)}</tr>
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
                    <tr>{bond.slice(10, 15).map((value, index, a) => <BondCell value={value} span={2} previous={+bond[index + 9]} />)}</tr>
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