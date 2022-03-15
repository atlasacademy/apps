import { Table } from "react-bootstrap";

import { MysticCode } from "@atlasacademy/api-connector";

const MysticCodeExp = (props: { mysticCode: MysticCode.MysticCode }) => {
    const expTable = (
        <Table style={{ textAlign: "center" }}>
            <thead>
                <tr>
                    <th>Level</th>
                    <th>Next Level</th>
                    <th>Total EXP</th>
                </tr>
            </thead>
            <tbody>
                {[0].concat(props.mysticCode.expRequired).map((exp, i, expRequired) => (
                    <tr key={i}>
                        <th scope="row">{i + 1}</th>
                        <td>{(i + 1 < expRequired.length ? expRequired[i + 1] - exp : 0).toLocaleString()}</td>
                        <td>{exp.toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
    return expTable;
};

export default MysticCodeExp;
