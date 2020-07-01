import {faShare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Alert, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import {default as ServantNoblePhantasmData} from "../../Api/Data/NoblePhantasm";
import {describeFunc, describeMutators} from "../../Helper/FuncHelper";
import {describeQuestType} from "../../Helper/QuestHelper";

interface IProps {
    noblePhantasm: ServantNoblePhantasmData;
}

class ServantNoblePhantasm extends React.Component<IProps> {
    render() {
        const np = this.props.noblePhantasm;

        return (
            <div>
                <h3>
                    {np.name}
                    &nbsp;
                    <Link to={`/noble-phantasm/${np.id}`}>
                        <FontAwesomeIcon icon={faShare}/>
                    </Link>
                </h3>

                {np.condQuestId && np.condQuestPhase ? (
                    <Alert variant={'primary'}>
                        <Link to={`/quest/${np.condQuestId}/${np.condQuestPhase}`}>
                            Available after {describeQuestType(np.condQuestId, np.condQuestPhase)}
                            &nbsp;
                            <FontAwesomeIcon icon={faShare}/>
                        </Link>
                    </Alert>
                ): null}

                <p>{np.detail}</p>

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
                        let funcDescription = describeFunc(func),
                            mutatingDescriptions = describeMutators(func);

                        for (let i = 0; i < 5; i++) {
                            if (!mutatingDescriptions[i])
                                mutatingDescriptions.push('-');
                        }

                        return (
                            <tr key={index}>
                                <td>
                                    {funcDescription}
                                    &nbsp;
                                    <Link to={`/func/${func.funcId}`}>
                                        <FontAwesomeIcon icon={faShare}/>
                                    </Link>
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
