import { Table, OverlayTrigger, Tooltip } from "react-bootstrap";

import { Servant } from "@atlasacademy/api-connector";

import BondIcon from "../../Component/BondIcon";
import { formatNumber } from "../../Helper/OutputHelper";

import "./ServantBondGrowth.css";

function BondCell(props = { value: 0, span: 1, previous: NaN }) {
    let diff = props.value - props.previous,
        cell = <td colSpan={props.span}>{formatNumber(props.value)}</td>;
    let diffText = diff > 0 ? `From previous level : ${formatNumber(diff)}` : "";
    return diffText ? (
        <OverlayTrigger
            placement="bottom"
            overlay={(p) => (
                <Tooltip id={`tooltip_bond_${props.value}`} {...p}>
                    {diffText}
                </Tooltip>
            )}
        >
            {cell}
        </OverlayTrigger>
    ) : (
        cell
    );
}

let ServantBondGrowth = (props: { bondGrowth: Servant.Servant["bondGrowth"] }) => {
    let { bondGrowth: bond } = props;
    const first10bonds = (
        <>
            <thead>
                {/* indexes */}
                <tr>
                    {Array(Math.min(10, props.bondGrowth.length))
                        .fill(0)
                        .map((_, __) => (
                            <th key={`bond_${__}`}>
                                <BondIcon level={__ + 1} />
                                &nbsp;
                                {__ + 1}
                            </th>
                        ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {bond.slice(0, 10).map((value, index) => (
                        <BondCell key={index} value={value} span={1} previous={+bond[index - 1]} />
                    ))}
                </tr>
            </tbody>
        </>
    );
    const last5bonds =
        bond.length > 10 ? (
            <>
                <thead>
                    {/* indexes */}
                    <tr>
                        {Array(5)
                            .fill(0)
                            .map((_, __) => (
                                <th key={__} colSpan={2}>
                                    {__ + 11}
                                </th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {bond.slice(10, 15).map((value, index) => (
                            <BondCell key={index} value={value} span={2} previous={+bond[index + 9]} />
                        ))}
                    </tr>
                </tbody>
            </>
        ) : null;
    return (
        <>
            <h3>Bond levels</h3>
            <Table responsive striped bordered className={"servant-bond-table"}>
                {first10bonds}
                {last5bonds}
            </Table>
        </>
    );
};

export default ServantBondGrowth;
