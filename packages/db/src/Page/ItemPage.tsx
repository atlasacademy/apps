import {Region, Servant, ClassName, Entity, Item} from "@atlasacademy/api-connector";
import {AxiosError} from "axios";
import React from "react";
import {Table, Tab, Tabs} from "react-bootstrap";
import {withRouter} from "react-router";
import {Link, RouteComponentProps} from "react-router-dom";
import Api from "../Api";
import ItemIcon from "../Component/ItemIcon";
import FaceIcon from "../Component/FaceIcon";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import RawDataViewer from "../Component/RawDataViewer";
import Loading from "../Component/Loading";
import TraitDescription from "../Descriptor/TraitDescription";
import {mergeElements} from "../Helper/OutputHelper";
import Manager from "../Setting/Manager";

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

interface MaterialUsageData {
    id: number;
    ascensions: number;
    skills: number;
    costumes: number;
    total: number;
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
        if (item.type === Item.ItemType.SKILL_LV_UP || item.type === Item.ItemType.TD_LV_UP) {
            return ((item.id > 6000 && item.id < 6208) // Matches Gems
                || (item.id > 6500 && item.id < 6600) // Matches Mats
                || (item.id > 7000 && item.id < 7108)); // Matches Statues
        }
        return false;
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
            "id": servant.id,
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

    private renderBreakdownTabContent(className: ClassName) {
        let servants = this.state.servants
                .filter(servant => (servant.type !== Entity.EntityType.ENEMY_COLLECTION_DETAIL))
                .sort((a,b) => a.collectionNo - b.collectionNo);
        const region = this.props.region;

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

        return (
            <Table hover>
                <thead>
                <tr>
                    <th style={{textAlign: "center", width: '1px'}}>Thumbnail</th>
                    <th>Servant</th>
                    <th>Uses in Ascension</th>
                    <th>Uses in Skill</th>
                    <th>Uses in Costume</th>
                    <th>Total Uses</th>
                </tr>
                {usageData.map(servantUsage => {
                    const servant = servants.find(basicServant => basicServant.id === servantUsage.id);
                    if (!servant) return null;
                    const route = `/${region}/servant/${servant.id}/materials`;

                    return (
                        <tr key={servant.id}>
                            <td align={"center"}>
                                <Link to={route}>
                                    <FaceIcon location={servant.extraAssets?.faces.ascension
                                                        ? servant.extraAssets?.faces.ascension[1]
                                                        : ""}
                                              height={50}/>
                                </Link>
                            </td>
                            <td>
                                <Link to={route}>
                                    {servant.name}
                                </Link>
                            </td>
                            <td>{servantUsage.ascensions}</td>
                            <td>{servantUsage.skills}</td>
                            <td>{servantUsage.costumes}</td>
                            <td>{servantUsage.total}</td>
                        </tr>
                    );
                })}
                </thead>
            </Table>
        );
    }

    private renderMaterialBreakdown() {
        return (
            <Tabs id={'material-tabs'} defaultActiveKey={this.props.tab ?? 'saber'} mountOnEnter={true}
              onSelect={(key: string | null) => {
                  this.props.history.replace(`/${this.props.region}/item/${this.props.id}/${key}`);
              }}>
                {
                    [
                        ClassName.SABER,
                        ClassName.LANCER,
                        ClassName.ARCHER,
                        ClassName.RIDER,
                        ClassName.CASTER,
                        ClassName.ASSASSIN,
                        ClassName.BERSERKER,
                        ClassName.EXTRA
                    ].map(className => (
                        <Tab key={className.toLowerCase()} eventKey={className.toLowerCase()}
                             title={className.toLowerCase().replace(/^\w/, c => c.toUpperCase())}>
                            <br/>
                            {this.renderBreakdownTabContent(className)}
                        </Tab>
                    ))
                }
            </Tabs>
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
                    "Detail": item.detail,
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
                    "Type": item.type
                }}/>

                <div style={{ marginBottom: '3%' }}>
                    <RawDataViewer text="Nice" data={item}/>
                    <RawDataViewer
                        text="Raw"
                        data={`https://api.atlasacademy.io/raw/${this.props.region}/item/${item.id}`}/>
                </div>

                {this.state.isMaterial
                    ? this.renderMaterialBreakdown()
                    : undefined}
            </div>
        );
    }
}

export default withRouter(ItemPage);
