import React from "react";
import {Col, Row, Tab, Tabs} from "react-bootstrap";
import Connection from "../Api/Connection";
import Region from "../Api/Data/Region";
import ServantEntity from "../Api/Data/ServantEntity";
import ServantListEntity from "../Api/Data/ServantListEntity";
import TraitMap from "../Api/Data/TraitMap";
import Loading from "../Component/Loading";
import ServantMainData from "./Servant/ServantMainData";
import ServantMiscData from "./Servant/ServantMiscData";
import ServantNoblePhantasm from "./Servant/ServantNoblePhantasm";
import ServantPicker from "./Servant/ServantPicker";
import ServantPortrait from "./Servant/ServantPortrait";
import ServantSkill from "./Servant/ServantSkill";
import ServantTraits from "./Servant/ServantTraits";

import './ServantPage.css';

interface IProp {
    region: Region;
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
        let [servants, servant] = await Promise.all<ServantListEntity[], ServantEntity, TraitMap>([
            Connection.servantList(this.props.region),
            Connection.servant(this.props.region, this.state.id),
            Connection.traitMap(this.props.region)
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
                <ServantPicker region={this.props.region} servants={this.state.servants} id={this.state.servant.collectionNo}/>
                <hr/>

                <Row>
                    <Col xs={{span: 12, order: 2}} lg={{span: 6, order: 1}}>
                        <ServantMainData servant={this.state.servant}/>
                    </Col>
                    <Col xs={{span: 12, order: 1}} lg={{span: 6, order: 2}}>
                        <ServantPortrait servant={this.state.servant}/>
                    </Col>
                </Row>

                <Tabs id={'servant-tabs'} defaultActiveKey={'skill-1'} transition={false}>
                    <Tab eventKey={'skill-1'} title={'Skill 1'}>
                        <br/>
                        {this.state.servant.skills
                            .filter(skill => skill.num === 1)
                            .map((skill, index) => {
                                return <ServantSkill region={this.props.region} key={index} skill={skill}/>;
                            })}
                    </Tab>
                    <Tab eventKey={'skill-2'} title={'Skill 2'}>
                        <br/>
                        {this.state.servant.skills
                            .filter(skill => skill.num === 2)
                            .map((skill, index) => {
                                return <ServantSkill region={this.props.region} key={index} skill={skill}/>;
                            })}
                    </Tab>
                    <Tab eventKey={'skill-3'} title={'Skill 3'}>
                        <br/>
                        {this.state.servant.skills
                            .filter(skill => skill.num === 3)
                            .map((skill, index) => {
                                return <ServantSkill region={this.props.region} key={index} skill={skill}/>;
                            })}
                    </Tab>
                    <Tab eventKey={'nps'} title={'Noble Phantasms'}>
                        <br/>
                        {this.state.servant.noblePhantasms
                            .filter(noblePhantasm => noblePhantasm.functions.length > 0)
                            .map((noblePhantasm, index) => {
                                return <ServantNoblePhantasm region={this.props.region} key={index}
                                                             noblePhantasm={noblePhantasm}/>;
                            })}
                    </Tab>
                    <Tab eventKey={'traits'} title={'Traits'}>
                        <br/>
                        <ServantTraits region={this.props.region} traits={this.state.servant.traits}/>
                    </Tab>
                    <Tab eventKey={'misc'} title={'Misc'}>
                        <br/>
                        <ServantMiscData servant={this.state.servant}/>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default ServantPage;
