import React from "react";
import {Col, FormControl, Row, Table} from "react-bootstrap";
import Connection from "../Api/Connection";
import ServantEntity from "../Api/Data/ServantEntity";
import ServantListEntity from "../Api/Data/ServantListEntity";
import ClassIcon from "../Component/ClassIcon";
import Loading from "../Component/Loading";
import {RouteComponentProps} from "react-router-dom";

import './ServantPage.css';

interface MatchParams {
    id: string;
}

interface IProp extends RouteComponentProps<MatchParams> {
}

interface IState {
    loading: boolean;
    id: number;
    servants: ServantListEntity[];
    servant?: ServantEntity;
}

class ServantPage extends React.Component<IProp, IState> {
    constructor(props: IProp) {
        super(props);

        this.state = {
            loading: true,
            id: parseInt(this.props.match.params.id),
            servants: [],
        };
    }

    componentDidMount() {
        this.loadServant();
    }

    async loadServant() {
        let [servants, servant] = await Promise.all([
            Connection.servantList(),
            Connection.servant(this.state.id)
        ]);

        this.setState({
            loading: false,
            servants,
            servant
        });
    }

    changeServant(id: number) {
        this.props.history.push(`/servant/${id}`);

        this.setState(
            {
                loading: true,
                id: id,
                servants: [],
                servant: undefined
            },
            () => {
                this.loadServant();
            }
        );
    }

    render() {
        if (this.state.loading)
            return <Loading/>;

        return (
            <div id={'servant'}>
                {this.renderServantPicker()}
                <hr/>

                <Row>
                    <Col>
                        {this.renderServantMainData()}
                    </Col>
                    <Col>
                        {this.renderServantPortrait()}
                    </Col>
                </Row>
            </div>
        );
    }

    renderServantPicker() {
        return (
            <div>
                Jump to:
                <FormControl as={"select"} custom
                             onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                                 this.changeServant(parseInt(ev.target.value));
                             }}
                             value={this.state.id}>
                    {this.state.servants.map((servant, index) => {
                        return (
                            <option key={index} value={servant.collectionNo}>
                                {servant.name}
                            </option>
                        );
                    })}
                </FormControl>
            </div>
        );
    }

    renderServantMainData() {
        if (this.state.servant === undefined)
            return null;

        return (
            <div>
                <h1>
                    <ClassIcon className={this.state.servant.className} rarity={this.state.servant.rarity}/>
                    &nbsp;
                    {this.state.servant.name}
                </h1>

                <Table bordered hover className={'main-data'}>
                    <tbody>
                    <tr>
                        <th>ID</th>
                        <td>{this.state.servant.id}</td>
                    </tr>
                    <tr>
                        <th>Collection</th>
                        <td>{this.state.servant.collectionNo}</td>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <td>{this.state.servant.name}</td>
                    </tr>
                    <tr>
                        <th>Class</th>
                        <td>{this.state.servant.className}</td>
                    </tr>
                    <tr>
                        <th>Rarity</th>
                        <td>{this.state.servant.rarity}</td>
                    </tr>
                    <tr>
                        <th>Cost</th>
                        <td>{this.state.servant.cost}</td>
                    </tr>
                    <tr>
                        <th>Max Lv.</th>
                        <td>{this.state.servant.lvMax}</td>
                    </tr>
                    <tr>
                        <th>Gender</th>
                        <td>{this.state.servant.gender}</td>
                    </tr>
                    <tr>
                        <th>Attribute</th>
                        <td>{this.state.servant.attribute}</td>
                    </tr>
                    </tbody>
                </Table>
            </div>
        );
    }

    renderServantPortrait() {
        if (this.state.servant === undefined)
            return null;

        return (
            <div>
                <img className={'profile'} src={this.state.servant.extraAssets.charaGraph.ascension["1"]}/>
            </div>
        );
    }
}

export default ServantPage;
