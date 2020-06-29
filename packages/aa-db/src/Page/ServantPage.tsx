import React from "react";
import {Col, FormControl, Row} from "react-bootstrap";
import {withRouter} from 'react-router';
import {RouteComponentProps} from "react-router-dom";
import Connection from "../Api/Connection";
import ServantEntity from "../Api/Data/ServantEntity";
import ServantListEntity from "../Api/Data/ServantListEntity";
import BuffIcon from "../Component/BuffIcon";
import ClassIcon from "../Component/ClassIcon";
import DataTable from "../Component/DataTable";
import Loading from "../Component/Loading";
import {asPercent} from "../Helper";

import './ServantPage.css';

const buffIconPath = 'https://assets.atlasacademy.io/GameData/JP/BuffIcons',
    deathChanceIcon = `${buffIconPath}/bufficon_337.png`,
    hitCountIcon = `${buffIconPath}/bufficon_349.png`,
    npGainIcon = `${buffIconPath}/bufficon_303.png`,
    starGenIcon = `${buffIconPath}/bufficon_310.png`;

interface IProp extends RouteComponentProps {
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

    changeServant(id: number) {
        this.props.history.push(`/servant/${id}`);
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

                <br/>

                {this.renderServantAdvancedData()}
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

                <DataTable data={{
                    "ID": this.state.servant.id,
                    "Collection": this.state.servant.collectionNo,
                    "Name": this.state.servant.name,
                    "Class": this.state.servant.className,
                    "Rarity": this.state.servant.rarity,
                    "Cost": this.state.servant.cost,
                    "Max Lv.": this.state.servant.lvMax,
                    "Max Hp": this.state.servant.hpMax,
                    "Max Atk": this.state.servant.atkMax,
                    "Gender": this.state.servant.gender,
                    "Attribute": this.state.servant.attribute,
                    "Traits": this.state.servant.traits.map((trait) => {
                        return trait.name;
                    }).join(', '),
                }}/>
            </div>
        );
    }

    renderServantPortrait() {
        if (this.state.servant === undefined)
            return null;

        return (
            <div>
                <img alt={this.state.servant.name}
                     className={'profile'}
                     src={this.state.servant.extraAssets.charaGraph.ascension["1"]}/>
            </div>
        );
    }

    renderServantAdvancedData() {
        if (this.state.servant === undefined)
            return null;

        const servant = this.state.servant;

        return (
            <div>
                <Row>
                    <Col>
                        <DataTable
                            header={(
                                <div>
                                    <BuffIcon location={starGenIcon}/>&nbsp;Crit Stars
                                </div>
                            )}
                            data={{
                                "Star Absorb": servant.starAbsorb,
                                "Star Gen": asPercent(servant.starGen),
                            }}/>

                        <DataTable
                            header={(
                                <div>
                                    <BuffIcon location={deathChanceIcon}/>&nbsp;Instant Death
                                </div>
                            )}
                            data={{
                                "Death Chance": asPercent(servant.instantDeathChance),
                            }}/>
                    </Col>

                    <Col>
                        <DataTable
                            header={(
                                <div>
                                    <BuffIcon location={npGainIcon}/>&nbsp;NP Gain
                                </div>
                            )}
                            data={{
                                "Buster": asPercent(servant.npGain.buster),
                                "Arts": asPercent(servant.npGain.arts),
                                "Quick": asPercent(servant.npGain.quick),
                                "Extra": asPercent(servant.npGain.extra),
                                "Defense": asPercent(servant.npGain.defence),
                            }}/>
                    </Col>

                    <Col>
                        <DataTable
                            header={(
                                <div>
                                    <BuffIcon location={hitCountIcon}/>
                                    &nbsp;
                                    Hit Count
                                </div>
                            )}
                            data={{
                                "Buster": ServantPage.showHits(servant.hitsDistribution.buster),
                                "Arts": ServantPage.showHits(servant.hitsDistribution.arts),
                                "Quick": ServantPage.showHits(servant.hitsDistribution.quick),
                                "Extra": ServantPage.showHits(servant.hitsDistribution.extra),
                            }}/>
                    </Col>
                </Row>
            </div>
        );
    }

    private static showHits(hits: number[]): JSX.Element {
        return <span>
            {hits.map((hit, index) => {
                return (index > 0 ? ', ' : '') + hit + '%';
            })}
            &nbsp;-&nbsp;
            {hits.length} Hits
        </span>
    }
}

export default withRouter(ServantPage);
