import React from "react";
import {Table} from "react-bootstrap";
import Func from "../../Api/Data/Func";
import {default as ServantNoblePhantasmData} from "../../Api/Data/ServantNoblePhantasm";
import {describeFunc, describeMutators} from "../../Helper/FuncHelper";

interface IProps {
    noblePhantasm: ServantNoblePhantasmData;
}

function ServantNoblePhantasmEffect(props: { func: Func }) {
    const func = props.func;

    let funcDescription = describeFunc(func),
        mutatingDescriptions = describeMutators(func);

    for (let i = 0; i < 5; i++) {
        if (!mutatingDescriptions[i])
            mutatingDescriptions.push('-');
    }

    return (
        <tr>
            <td>{funcDescription}</td>
            {mutatingDescriptions.map((description, index) => {
                return (
                    <td key={index}>{description}</td>
                );
            })}
        </tr>
    )
}

class ServantNoblePhantasm extends React.Component<IProps> {
    render() {
        const np = this.props.noblePhantasm;

        return (
            <div>
                <h3>{np.name}</h3>
                <p>{np.detail}</p>

                <Table>
                    <thead>
                    <tr>
                        <th>Effect</th>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>5</th>
                    </tr>
                    </thead>
                    <tbody>
                    {np.functions.map((func, index) => {
                        return <ServantNoblePhantasmEffect key={index} func={func}/>;
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default ServantNoblePhantasm;
