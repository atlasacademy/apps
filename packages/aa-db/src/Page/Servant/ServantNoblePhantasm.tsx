import React from "react";
import {Alert, Table} from "react-bootstrap";
import {default as ServantNoblePhantasmData} from "../../Api/Data/NoblePhantasm";
import Region from "../../Api/Data/Region";
import FuncDescriptor from "../../Descriptor/FuncDescriptor";
import NoblePhantasmDescriptor from "../../Descriptor/NoblePhantasmDescriptor";
import QuestDescriptor from "../../Descriptor/QuestDescriptor";
import {describeMutators} from "../../Helper/FuncHelper";
import {handleNewLine} from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    noblePhantasm: ServantNoblePhantasmData;
}

class ServantNoblePhantasm extends React.Component<IProps> {
    render() {
        const np = this.props.noblePhantasm;

        return (
            <div>
                <h3>
                    <NoblePhantasmDescriptor region={this.props.region} noblePhantasm={np}/>
                </h3>

                {np.condQuestId && np.condQuestPhase ? (
                    <Alert variant={'primary'}>
                        Available after <QuestDescriptor region={this.props.region}
                                                         questId={np.condQuestId}
                                                         questPhase={np.condQuestPhase}/>
                    </Alert>
                ) : null}

                <p>{handleNewLine(np.detail)}</p>

                <Table responsive>
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
                        let mutatingDescriptions = describeMutators(this.props.region, func);

                        for (let i = 0; i < 5; i++) {
                            if (!mutatingDescriptions[i])
                                mutatingDescriptions.push('-');
                        }

                        return (
                            <tr key={index}>
                                <td>
                                    <FuncDescriptor region={this.props.region} func={func}/>
                                </td>
                                {mutatingDescriptions.map((description, index) => {
                                    return (
                                        <td key={index}>{description}</td>
                                    );
                                })}
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default ServantNoblePhantasm;
