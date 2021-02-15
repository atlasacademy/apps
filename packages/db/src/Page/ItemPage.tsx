import {Region, Servant, ClassName, Entity, Item} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";
import React from "react";
import {Table, Tab, Tabs} from "react-bootstrap";
import {withRouter} from "react-router";
import {Link, RouteComponentProps} from "react-router-dom";
import Api, {Host} from "../Api";
import ItemIcon from "../Component/ItemIcon";
import FaceIcon from "../Component/FaceIcon";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import RawDataViewer from "../Component/RawDataViewer";
import Loading from "../Component/Loading";
import TraitDescription from "../Descriptor/TraitDescription";
import ItemUseDescription from "../Descriptor/ItemUseDescription";
import ServantDescriptor from "../Descriptor/ServantDescriptor";
import {handleNewLine, mergeElements} from "../Helper/OutputHelper";
import Manager from "../Setting/Manager";

import './ItemPage.css';

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    tab?: string;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    id: number;
    servants: Servant.Servant[];
    item?: Item.Item;
    isMaterial?: boolean;
}

let MATERIAL_USAGE_HEADER = <>
    <th>Total Ascension</th>
    <th>Per&nbsp;Skill (Total)</th>
    <th>Costume</th>
    <th>Total</th>
</>

interface MaterialUsageColumn {
    ascensions: number;
    skills: number;
    costumes: number;
    total: number;
}

interface MaterialUsageData extends MaterialUsageColumn{
    collectionNo: number;
    name: string;
    face: string;
}

class ItemPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            id: this.props.id,
            isMaterial: false,
            servants: [],
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadData();
    }

    private itemIsMaterial(item: Item.Item): boolean {
        return item.uses.includes(Item.ItemUse.SKILL)
            || (item.uses.includes(Item.ItemUse.ASCENSION)
                && (item.type === Item.ItemType.TD_LV_UP
                    || item.type === Item.ItemType.EVENT_ITEM))
    }

    async loadData() {
        try {
            let item = await Api.item(this.state.id);

            if (this.itemIsMaterial(item)) {
                let servants = await Api.servantListNice();
                this.setState({
                    loading: false,
                    isMaterial: true,
                    servants,
                    item
                });
            } else {
                this.setState({
                    loading: false,
                    item
                });
            }
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    private isExtra(className: ClassName): boolean {
        return !(className === ClassName.SABER
            || className === ClassName.ARCHER
            || className === ClassName.LANCER
            || className === ClassName.RIDER
            || className === ClassName.CASTER
            || className === ClassName.ASSASSIN
            || className === ClassName.BERSERKER);
    }

    private reduceMaterials(materials: Entity.EntityLevelUpMaterialProgression): number {
        if (Object.values(materials).length === 0) return 0;

        return Object.values(materials).map(stage => {
            let items = stage.items;
            for (let itemsObj of items) {
                if (itemsObj.item.id === +this.props.id) {
                    return itemsObj.amount;
                }
            }
            return 0;
        }).reduce((a,b) => a+b);
    }

    private servantProcessMaterials(servant: Servant.Servant):MaterialUsageData {
        let servantProcessed = {
            "collectionNo": servant.collectionNo,
            "name": servant.name,
            "face": servant.extraAssets?.faces.ascension ? servant.extraAssets?.faces.ascension[1] : "",
            "ascensions": 0,
            "skills": 0,
            "costumes": 0,
            "total": 0
        }

        // skip ascension for Mashu
        if (servant.id !== 800100) {
            servantProcessed.ascensions = this.reduceMaterials(servant.ascensionMaterials);
        }

        servantProcessed.skills = this.reduceMaterials(servant.skillMaterials);
        servantProcessed.costumes = this.reduceMaterials(servant.costumeMaterials);

        // add up total
        servantProcessed.total = servantProcessed.ascensions + (servantProcessed.skills * 3) + servantProcessed.costumes;

        return servantProcessed;
    }

    private getUsageData(className: ClassName) {
        let servants = this.state.servants
                .filter(servant => (servant.type !== Entity.EntityType.ENEMY_COLLECTION_DETAIL))
                .sort((a,b) => a.collectionNo - b.collectionNo);

        // Filter servants by className
        if (this.isExtra(className)) {
            servants = servants.filter(servant => this.isExtra(servant.className));
        } else {
            servants = servants.filter(servant => servant.className === className);
        }

        // Compile usageData
        const usageData = servants
            .map(servant => (this.servantProcessMaterials(servant)))
            // filter servants that don't use the material
            .filter(servant => servant.total > 1);

        return usageData
    }

    private renderUsageNumberRow(usage: MaterialUsageColumn) {
        return (
            <>
                <td>{usage.ascensions}</td>
                <td>{`${usage.skills} (${usage.skills * 3})`}</td>
                <td>{usage.costumes}</td>
                <td>{usage.total}</td>
            </>
        )
    }

    private renderBreakdownTab(className: ClassName, usageData: MaterialUsageData[]) {
        const region = this.props.region;
        return (
            <Tab key={className.toLowerCase()} eventKey={className.toLowerCase()}
                 title={className.toLowerCase().replace(/^\w/, c => c.toUpperCase())}>
                <br/>
                <Table hover responsive className={'materialUsage'}>
                    <thead>
                    <tr>
                        <th colSpan={2}>Servant</th>
                        {MATERIAL_USAGE_HEADER}
                    </tr>
                    {usageData.map(servantUsage => {
                        const route = `/${region}/servant/${servantUsage.collectionNo}/materials`;

                        return (
                            <tr key={servantUsage.collectionNo}>
                                <td align={"center"} style={{width: '1px'}}>
                                    <Link to={route}>
                                        <FaceIcon location={servantUsage.face} height={50}/>
                                    </Link>
                                </td>
                                <td style={{textAlign: "left"}}>
                                    <Link to={route}>
                                        {servantUsage.name}
                                    </Link>
                                </td>
                                {this.renderUsageNumberRow(servantUsage)}
                            </tr>
                        );
                    })}
                    </thead>
                </Table>
            </Tab>
        );
    }

    private renderMaterialBreakdown(): JSX.Element {
        let tabs = [
                ClassName.SABER,
                ClassName.LANCER,
                ClassName.ARCHER,
                ClassName.RIDER,
                ClassName.CASTER,
                ClassName.ASSASSIN,
                ClassName.BERSERKER,
                ClassName.EXTRA
            ].map(className => ({
                class: className,
                usageData: this.getUsageData(className),
            })).filter(tab => tab.usageData.length > 0);

        let allUsageData = tabs.reduce(
            (acc, tab) => acc.concat(tab.usageData), [] as MaterialUsageData[]
        ).sort((a,b) => a.collectionNo - b.collectionNo);
        tabs.unshift({
            class: ClassName.ALL,
            usageData: allUsageData,
        })

        let totalUsage = {ascensions: 0, skills: 0, costumes: 0, total: 0}
        for (let usage of allUsageData) {
            totalUsage.ascensions += usage.ascensions;
            totalUsage.skills += usage.skills;
            totalUsage.costumes += usage.costumes;
        }
        totalUsage.total = totalUsage.ascensions + totalUsage.skills * 3 + totalUsage.costumes;

        return (
            <>
                <h3>Servant Material Requirements</h3>
                <Table hover responsive className={'materialUsage'}>
                    <thead>
                    <tr>
                        <th></th>
                        {MATERIAL_USAGE_HEADER}
                    </tr>
                    <tr key="total">
                        <td style={{textAlign: "left"}}>Total</td>
                        {this.renderUsageNumberRow(totalUsage)}
                    </tr>
                    </thead>
                </Table>
                <Tabs id={'material-tabs'} defaultActiveKey={this.props.tab ?? tabs[0]?.class.toLowerCase()} mountOnEnter={true}
                onSelect={(key: string | null) => {
                    this.props.history.replace(`/${this.props.region}/item/${this.props.id}/${key}`);
                }}>
                    {tabs.map(tab => this.renderBreakdownTab(tab.class, tab.usageData))}
                </Tabs>
            </>
        );
    }

    private renderEventServantMaterial(): JSX.Element {
        let servants = this.state.servants
                .filter(servant => (servant.type !== Entity.EntityType.ENEMY_COLLECTION_DETAIL))
                .sort((a,b) => a.collectionNo - b.collectionNo);
        const region = this.props.region,
            servant = servants.find(servant => (
                this.reduceMaterials(servant.ascensionMaterials) > 0
            ));
        if (!servant) return (
            <b>Error while finding Event Servant</b>
        );

        return (
            <DataTable data={{
                "Used by": <ServantDescriptor servant={servant} region={region}/>
            }}/>
        );
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading || !this.state.item || !this.state.servants)
            return <Loading/>;

        const item = this.state.item;
        document.title = `[${this.props.region}] ${this.state.isMaterial ? "Material" : "Item"} - ${item.name} - Atlas Academy DB`;

        return (
            <div id={'item.id'}>
                <h1>
                    {item.icon ? (
                            <ItemIcon region={this.props.region}
                                      item={item}
                                      height={50}/>
                    ) : undefined}
                    {item.icon ? ' ' : undefined}
                    {item.name}
                </h1>

                <br/>

                <DataTable data={{
                    "ID": item.id,
                    "Name": item.name,
                    "Detail": handleNewLine(item.detail),
                    "Individuality": (
                        <div>
                            {mergeElements(
                                item.individuality.map(
                                    trait => <TraitDescription region={this.props.region} trait={trait}/>
                                ),
                                ' '
                            )}
                        </div>
                    ),
                    "Type": item.type,
                    "Uses": (
                        <div>
                            <ItemUseDescription region={this.props.region} item={item}/>
                        </div>
                    )
                }}/>

                <div style={{ marginBottom: '3%' }}>
                    <RawDataViewer text="Nice" data={item}/>
                    <RawDataViewer
                        text="Raw"
                        data={`${Host}/raw/${this.props.region}/item/${item.id}`}/>
                </div>

                {item.type === Item.ItemType.EVENT_ITEM
                    ? (this.state.isMaterial
                        ? this.renderEventServantMaterial()
                        : undefined)
                    : (this.state.isMaterial
                        ? this.renderMaterialBreakdown()
                        : undefined)
                }
            </div>
        );
    }
}

export default withRouter(ItemPage);
