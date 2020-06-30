import {faSearchPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Modal, Table} from "react-bootstrap";
import ReactJson from "react-json-view";
import Func from "../../Api/Data/Func";
import {default as ServantNoblePhantasmData} from "../../Api/Data/ServantNoblePhantasm";
import {describeFunc, describeMutators} from "../../Helper/FuncHelper";

interface IProps {
    noblePhantasm: ServantNoblePhantasmData;
}

interface IState {
    showFunc: boolean;
    func?: Func;
}

class ServantNoblePhantasm extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            showFunc: false
        };
    }

    private showFunc(func: Func) {
        this.setState({
            showFunc: true,
            func: func
        });
    }

    private hideFunc() {
        this.setState({
            showFunc: false,
            func: undefined
        });
    }

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
                                    <span className={'text-primary'}
                                          style={{cursor: "pointer"}}
                                          onClick={() => {
                                              this.showFunc(func);
                                          }}>
                                        <FontAwesomeIcon icon={faSearchPlus}/>
                                    </span>
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

                <Modal show={this.state.showFunc} onHide={() => this.hideFunc()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Raw Function</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ReactJson src={this.state.func ?? {}}/>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default ServantNoblePhantasm;
