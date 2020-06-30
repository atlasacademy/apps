import React from "react";
import {Col, Row} from "react-bootstrap";
import Connection from "../Api/Connection";
import ServantEntity from "../Api/Data/ServantEntity";
import ServantListEntity from "../Api/Data/ServantListEntity";
import Loading from "../Component/Loading";
import ServantAdvancedData from "./Servant/ServantAdvancedData";
import ServantMainData from "./Servant/ServantMainData";
import ServantNoblePhantasm from "./Servant/ServantNoblePhantasm";
import ServantPicker from "./Servant/ServantPicker";
import ServantPortrait from "./Servant/ServantPortrait";

import './ServantPage.css';

interface IProp {
    id: string;
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
            id: parseInt(this.props.id),
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

    render() {
        if (this.state.loading || !this.state.servant)
            return <Loading/>;

        return (
            <div id={'servant'}>
                <ServantPicker servants={this.state.servants} id={this.state.servant.collectionNo}/>
                <hr/>

                <Row>
                    <Col xs={{span: 12, order: 2}} md={{span: 6, order: 1}}>
                        <ServantMainData servant={this.state.servant}/>
                    </Col>
                    <Col xs={{span: 12, order: 1}} md={{span: 6, order: 2}}>
                        <ServantPortrait servant={this.state.servant}/>
                    </Col>
                </Row>

                <br/>

                <ServantAdvancedData servant={this.state.servant}/>

                {this.state.servant.noblePhantasms.map((noblePhantasm, index) => {
                    return <ServantNoblePhantasm key={index} noblePhantasm={noblePhantasm}/>;
                })}
            </div>
        );
    }
}

export default ServantPage;
