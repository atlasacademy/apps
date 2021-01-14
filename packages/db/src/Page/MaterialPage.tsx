import {Region, Servant, ClassName, Item, Entity} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";
import React from "react";
import {Tab, Tabs} from "react-bootstrap";// Col, Row,
import {withRouter} from "react-router";
import {RouteComponentProps} from "react-router-dom";
import Api from "../Api";
import MaterialUsageBreakdown from "../Breakdown/MaterialUsageBreakdown";
import ItemIcon from "../Component/ItemIcon";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import RawDataViewer from "../Component/RawDataViewer";
import Loading from "../Component/Loading";
import Manager from "../Setting/Manager";
import {MaterialUsageData} from "./Material/MaterialUsageData";

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
    material?: Item.Item;
}

class MaterialPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            id: this.props.id,
            servants: [],
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadData();
    }

    private itemIsMaterial(material: Item.Item) {
        if (material.type === Item.ItemType.SKILL_LV_UP || material.type === Item.ItemType.TD_LV_UP) {
            if ((material.id > 6000 && material.id < 6208) || // Matches Gems
                (material.id > 6500 && material.id < 6600) || // Matches Mats
                (material.id > 7000 && material.id < 7108)) return true; // Matches Statues
        }
        return false;
    }

    async loadData() {
        try {
            let [servants, material] = await Promise.all<Servant.Servant[], Item.Item>([
                Api.servantListNice(),
                Api.item(this.state.id)
            ]);

            if (!this.itemIsMaterial(material)) {
                throw Error(`Item ${this.state.id} is not a non-event Skill or Ascension Material.`);
            }

            this.setState({
                loading: false,
                servants,
                material
            });
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    private reduceMaterials(materials: Entity.EntityLevelUpMaterialProgression) {
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
            "id": servant.id,
            "className": this.isExtra(servant.className) ? ClassName.EXTRA : servant.className,
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

    private isExtra(className: ClassName): boolean {
        return !(className === ClassName.SABER
            || className === ClassName.ARCHER
            || className === ClassName.LANCER
            || className === ClassName.RIDER
            || className === ClassName.CASTER
            || className === ClassName.ASSASSIN
            || className === ClassName.BERSERKER);
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading || !this.state.material)
            return <Loading/>;

        const material = this.state.material;
        document.title = `[${this.props.region}] Material - ${material.name} - Atlas Academy DB`;

        const servants = this.state.servants
                .filter(servant => (servant.type !== Entity.EntityType.ENEMY_COLLECTION_DETAIL))
                .sort((a,b) => a.collectionNo - b.collectionNo), // sort by collectionNo
            // process data
            servantMaterialUsage = servants
                .map(servant => (this.servantProcessMaterials(servant)))
                // filter servants that don't use the material
                .filter(servant => servant.total > 1);

        return (
            <div id={'material'}>
                <h1>
                    {material.icon ? (
                            <ItemIcon region={this.props.region}
                                      item={material}
                                      height={50}/>
                    ) : undefined}
                    {material.icon ? ' ' : undefined}
                    {material.name}
                </h1>

                <br/>

                <DataTable data={{
                    "ID": material.id,
                    "Name": material.name,
                    "Detail": material.detail,
                    "Type": material.type
                }}/>

                <div style={{ marginBottom: '3%' }}>
                    <RawDataViewer text="Nice" data={material}/>
                    <RawDataViewer
                        text="Raw"
                        data={`https://api.atlasacademy.io/raw/${this.props.region}/item/${material.id}`}/>
                </div>

                <Tabs id={'material-tabs'} defaultActiveKey={this.props.tab ?? 'saber'} mountOnEnter={true}
                      onSelect={(key: string | null) => {
                          this.props.history.replace(`/${this.props.region}/material/${this.props.id}/${key}`);
                      }}>
                    {
                        [
                            ClassName.SABER,
                            ClassName.LANCER,
                            ClassName.ARCHER,
                            ClassName.RIDER,
                            ClassName.CASTER,
                            ClassName.ASSASSIN,
                            ClassName.BERSERKER
                        ].map(i => (
                            <Tab key={i} eventKey={i} title={i.replace(/^\w/, c => c.toUpperCase())}>
                                <br/>
                                <MaterialUsageBreakdown
                                    usageData={servantMaterialUsage.filter(servant => servant.className === i)}
                                    region={this.props.region}
                                    servants={this.state.servants}/>
                            </Tab>
                        ))
                    }
                    <Tab key={ClassName.EXTRA.toLowerCase()} eventKey={ClassName.EXTRA.toLowerCase()} title={'Extra'}>
                        <br/>
                        <MaterialUsageBreakdown
                            usageData={servantMaterialUsage.filter(servant => this.isExtra(servant.className))}
                            region={this.props.region}
                            servants={this.state.servants}/>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(MaterialPage);
