import { faSortNumericDown, faSortNumericDownAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import React from "react";
import { Button, Table, Tab, Tabs } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link, RouteComponentProps } from "react-router-dom";

import { Region, Servant, ClassName, Entity, Item } from "@atlasacademy/api-connector";

import Api, { Host } from "../Api";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import FaceIcon from "../Component/FaceIcon";
import ItemIcon from "../Component/ItemIcon";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import ItemUseDescription from "../Descriptor/ItemUseDescription";
import ServantDescriptor from "../Descriptor/ServantDescriptor";
import TraitDescription from "../Descriptor/TraitDescription";
import { mergeElements } from "../Helper/OutputHelper";
import Manager from "../Setting/Manager";

import "../Helper/StringHelper.css";
import "./ItemPage.css";

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    tab?: string;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    servants: Servant.Servant[];
    item?: Item.Item;
    blacklistedColumnIndexes: number[];
}

interface MaterialUsageColumn {
    ascensions: number;
    skills: number;
    appendSkills: number;
    costumes: number;
}

interface MaterialUsageData extends MaterialUsageColumn {
    collectionNo: number;
    name: string;
    face: string;
}

const getTotalUsage = (material: MaterialUsageColumn, blacklistedColumnIndexes?: number[]) => {
    if (blacklistedColumnIndexes !== undefined) {
        return (
            (blacklistedColumnIndexes.includes(0) ? 0 : material.ascensions) +
            (blacklistedColumnIndexes.includes(1) ? 0 : 3 * material.skills) +
            (blacklistedColumnIndexes.includes(2) ? 0 : 3 * material.appendSkills) +
            (blacklistedColumnIndexes.includes(3) ? 0 : material.costumes)
        );
    }

    return material.ascensions + 3 * (material.skills + material.appendSkills) + material.costumes;
};

let usageDataColumns: {
    extractor: (material: MaterialUsageColumn, blacklistedColumnIndexes?: number[]) => number;
    title: string;
    colspan?: number;
    displayExtractor?: (usage: MaterialUsageColumn) => string;
}[] = [
    { extractor: (usage: MaterialUsageColumn) => usage.ascensions, title: "Total Ascension" },
    {
        extractor: (usage: MaterialUsageColumn) => usage.skills * 3,
        displayExtractor: (usage: MaterialUsageColumn) =>
            `${usage.skills.toLocaleString()} (${(usage.skills * 3).toLocaleString()})`,
        title: "Per Skill (Total)",
    },
    {
        extractor: (usage: MaterialUsageColumn) => usage.appendSkills * 3,
        displayExtractor: (usage: MaterialUsageColumn) =>
            `${usage.appendSkills.toLocaleString()} (${(usage.appendSkills * 3).toLocaleString()})`,
        title: "Per Append Skill (Total)",
    },
    { extractor: (usage: MaterialUsageColumn) => usage.costumes, title: "Costume" },
    {
        extractor: (usage: MaterialUsageColumn, blacklistedColumnIndexes?: number[]) =>
            getTotalUsage(usage, blacklistedColumnIndexes),
        title: "Total",
    },
];

function MaterialListingTable(props: {
    region: Region;
    usageData: MaterialUsageData[];
    blacklistedColumnIndexes?: number[];
}) {
    let { region, usageData, blacklistedColumnIndexes } = props;
    blacklistedColumnIndexes = blacklistedColumnIndexes ?? [];

    const NO_SORT = -1;
    enum SortingOrder {
        ASC = 1,
        DESC = -1,
    }

    let [currentSortingKey, setSortingKey] = React.useState<number>(NO_SORT);
    let [currentSortingOrder, setSortingOrder] = React.useState<SortingOrder>(SortingOrder.DESC);

    let usageDataColumnsWithServantColumn = [
        {
            extractor: (usage: MaterialUsageColumn) => (usage as MaterialUsageData).collectionNo,
            title: "Servant",
            colspan: 2,
        },
        ...usageDataColumns,
    ];

    let header = usageDataColumnsWithServantColumn
        .map((field, index) => {
            if (index === currentSortingKey)
                return (
                    <Button
                        variant=""
                        style={{ outline: "none" }}
                        onClick={() =>
                            setSortingOrder(
                                currentSortingOrder === SortingOrder.ASC ? SortingOrder.DESC : SortingOrder.ASC
                            )
                        }
                    >
                        {field.title}
                        {currentSortingKey !== NO_SORT ? (
                            currentSortingOrder === SortingOrder.ASC ? (
                                <>
                                    &nbsp;
                                    <FontAwesomeIcon icon={faSortNumericDown} />
                                </>
                            ) : (
                                <>
                                    &nbsp;
                                    <FontAwesomeIcon icon={faSortNumericDownAlt} />
                                </>
                            )
                        ) : null}
                    </Button>
                );
            return (
                <Button
                    variant=""
                    style={{ outline: "none" }}
                    onClick={() => {
                        setSortingOrder(SortingOrder.DESC);
                        setSortingKey(index);
                    }}
                >
                    {field.title}
                </Button>
            );
        })
        .map((element, index) => (
            <th key={index} colSpan={usageDataColumnsWithServantColumn[index].colspan}>
                {element}
            </th>
        ))
        // we concated above, shift everything by one
        .filter((_, index) => !blacklistedColumnIndexes!.includes(index - 1));

    if (currentSortingKey !== NO_SORT)
        usageData = usageData.slice().sort((a, b) => {
            let sortingInformation = usageDataColumnsWithServantColumn[currentSortingKey];
            let [value1, value2] = [sortingInformation.extractor(a), sortingInformation.extractor(b)];
            return (value1 - value2) * currentSortingOrder;
        });

    return (
        <Table hover responsive className={"materialUsage"}>
            <thead>
                <tr>{header}</tr>
                {usageData
                    .filter((servantUsage) => getTotalUsage(servantUsage, blacklistedColumnIndexes) > 0)
                    .map((servantUsage) => {
                        const route = `/${region}/servant/${servantUsage.collectionNo}/materials`;

                        return (
                            <tr key={servantUsage.collectionNo}>
                                <td className="faceIcon">
                                    <Link to={route}>
                                        <FaceIcon location={servantUsage.face} height={50} />
                                    </Link>
                                </td>
                                <td className="materialOwner">
                                    <Link to={route}>{servantUsage.name}</Link>
                                </td>
                                {usageDataColumns
                                    .map((field) => (
                                        <td key={field.title}>
                                            {field?.displayExtractor?.(servantUsage) ??
                                                field?.extractor(servantUsage, blacklistedColumnIndexes)}
                                        </td>
                                    ))
                                    .filter((_, index) => !blacklistedColumnIndexes!.includes(index))}
                            </tr>
                        );
                    })}
            </thead>
        </Table>
    );
}

const itemIsMaterial = (item: Item.Item) => {
    return (
        item.uses.includes(Item.ItemUse.SKILL) ||
        (item.uses.includes(Item.ItemUse.ASCENSION) &&
            (item.type === Item.ItemType.TD_LV_UP || item.type === Item.ItemType.EVENT_ITEM))
    );
};

class ItemPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: true,
            servants: [],
            blacklistedColumnIndexes: [],
        };
    }

    componentDidMount() {
        Manager.setRegion(this.props.region);
        this.loadData();
    }

    loadData() {
        Api.item(this.props.id)
            .then((item) => {
                this.setState({ item, loading: false });
                if (itemIsMaterial(item)) {
                    Api.servantListNice()
                        .then((servants) => this.setState({ servants }))
                        .catch((error) => this.setState({ error }));
                }
            })
            .catch((error) => this.setState({ error }));
    }

    private isExtra(className: ClassName): boolean {
        return !(
            className === ClassName.SABER ||
            className === ClassName.ARCHER ||
            className === ClassName.LANCER ||
            className === ClassName.RIDER ||
            className === ClassName.CASTER ||
            className === ClassName.ASSASSIN ||
            className === ClassName.BERSERKER
        );
    }

    private reduceMaterials(materials: Entity.EntityLevelUpMaterialProgression): number {
        if (Object.values(materials).length === 0) return 0;

        return Object.values(materials)
            .map((stage) => {
                let items = stage.items;
                for (let itemsObj of items) {
                    if (itemsObj.item.id === +this.props.id) {
                        return itemsObj.amount;
                    }
                }
                return 0;
            })
            .reduce((a, b) => a + b);
    }

    private servantProcessMaterials(servant: Servant.Servant): MaterialUsageData {
        let servantProcessed = {
            collectionNo: servant.collectionNo,
            name: servant.ascensionAdd.overWriteServantName.ascension[0] ?? servant.name,
            face: servant.extraAssets?.faces.ascension ? servant.extraAssets?.faces.ascension[1] : "",
            ascensions: 0,
            skills: 0,
            appendSkills: 0,
            costumes: 0,
            total: 0,
        };

        // skip ascension for Mashu
        if (servant.id !== 800100) {
            servantProcessed.ascensions = this.reduceMaterials(servant.ascensionMaterials);
        }

        servantProcessed.skills = this.reduceMaterials(servant.skillMaterials);
        servantProcessed.appendSkills = this.reduceMaterials(servant.appendSkillMaterials);
        servantProcessed.costumes = this.reduceMaterials(servant.costumeMaterials);

        // add up total
        servantProcessed.total =
            servantProcessed.ascensions +
            servantProcessed.skills * 3 +
            servantProcessed.appendSkills * 3 +
            servantProcessed.costumes;

        return servantProcessed;
    }

    private getUsageData(className: ClassName) {
        let servants = this.state.servants
            .filter((servant) => servant.type !== Entity.EntityType.ENEMY_COLLECTION_DETAIL)
            .sort((a, b) => a.collectionNo - b.collectionNo);

        // Filter servants by className
        if (this.isExtra(className)) {
            servants = servants.filter((servant) => this.isExtra(servant.className));
        } else {
            servants = servants.filter((servant) => servant.className === className);
        }

        // Compile usageData
        const usageData = servants
            .map((servant) => this.servantProcessMaterials(servant))
            // filter servants that don't use the material
            .filter((usage) => getTotalUsage(usage) > 0);

        return usageData;
    }

    private renderBreakdownTab(className: ClassName, usageData: MaterialUsageData[]) {
        const region = this.props.region;
        return (
            <Tab
                key={className.toLowerCase()}
                eventKey={className.toLowerCase()}
                title={className.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
            >
                <br />
                <MaterialListingTable
                    region={region}
                    usageData={usageData}
                    blacklistedColumnIndexes={this.state.blacklistedColumnIndexes}
                />
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
            ClassName.EXTRA,
        ]
            .map((className) => ({
                class: className,
                usageData: this.getUsageData(className),
            }))
            .filter((tab) => tab.usageData.length > 0);

        let allUsageData = tabs
            .reduce((acc, tab) => acc.concat(tab.usageData), [] as MaterialUsageData[])
            .sort((a, b) => a.collectionNo - b.collectionNo);
        tabs.unshift({
            class: ClassName.ALL,
            usageData: allUsageData,
        });

        let totalUsage = { ascensions: 0, skills: 0, appendSkills: 0, costumes: 0, total: 0 };
        for (let usage of allUsageData) {
            totalUsage.ascensions += usage.ascensions;
            totalUsage.skills += usage.skills;
            totalUsage.appendSkills += usage.appendSkills;
            totalUsage.costumes += usage.costumes;
        }
        totalUsage.total =
            totalUsage.ascensions + totalUsage.skills * 3 + totalUsage.appendSkills * 3 + totalUsage.costumes;

        return (
            <>
                <h3>Servant Material Requirements</h3>
                <Table hover responsive className={"materialUsage"}>
                    <thead>
                        <tr>
                            <th></th>
                            {usageDataColumns.map((field) => (
                                <th key={field.title}>{field.title}</th>
                            ))}
                        </tr>
                        <tr key="total">
                            <td className="materialOwner">Total</td>
                            {usageDataColumns.map((field) => (
                                <td key={field.title}>
                                    {field?.displayExtractor?.(totalUsage) ??
                                        field?.extractor(totalUsage as MaterialUsageColumn).toLocaleString()}
                                </td>
                            ))}
                        </tr>
                        <tr key="switches">
                            <td className="materialOwner">Show below?</td>
                            {usageDataColumns.map((_, index) => {
                                let blacklisted = this.state.blacklistedColumnIndexes.includes(index);
                                return (
                                    <td key={_.title}>
                                        <Button
                                            variant={blacklisted ? "danger" : "success"}
                                            onClick={() => {
                                                let out = new Set(this.state.blacklistedColumnIndexes);
                                                out[blacklisted ? "delete" : "add"](index);
                                                this.setState({ blacklistedColumnIndexes: [...out] });
                                            }}
                                        >
                                            {blacklisted ? "No" : "Yes"}
                                        </Button>
                                    </td>
                                );
                            })}
                        </tr>
                    </thead>
                </Table>
                <Tabs
                    id={"material-tabs"}
                    defaultActiveKey={this.props.tab ?? tabs[0]?.class.toLowerCase()}
                    mountOnEnter={true}
                    onSelect={(key: string | null) => {
                        this.props.history.replace(`/${this.props.region}/item/${this.props.id}/${key}`);
                    }}
                >
                    {tabs.map((tab) => this.renderBreakdownTab(tab.class, tab.usageData))}
                </Tabs>
            </>
        );
    }

    private renderEventServantMaterial(): JSX.Element {
        let servants = this.state.servants
            .filter((servant) => servant.type !== Entity.EntityType.ENEMY_COLLECTION_DETAIL)
            .sort((a, b) => a.collectionNo - b.collectionNo);
        const region = this.props.region,
            servant = servants.find((servant) => this.reduceMaterials(servant.ascensionMaterials) > 0);
        if (!servant) return <b>Error while finding Event Servant</b>;

        return (
            <DataTable
                data={{
                    "Used by": <ServantDescriptor servant={servant} region={region} />,
                }}
            />
        );
    }

    render() {
        if (this.state.error) return <ErrorStatus error={this.state.error} />;

        if (this.state.loading || !this.state.item) return <Loading />;

        const item = this.state.item;
        document.title = `[${this.props.region}] ${itemIsMaterial(item) ? "Material" : "Item"} - ${
            item.name
        } - Atlas Academy DB`;

        const itemUsageTable =
            item.type === Item.ItemType.EVENT_ITEM ? this.renderEventServantMaterial() : this.renderMaterialBreakdown();

        return (
            <div id={"item.id"}>
                <h1>
                    {item.icon ? <ItemIcon region={this.props.region} item={item} height={50} /> : undefined}
                    {item.icon ? " " : undefined}
                    {item.name}
                </h1>

                <br />

                <DataTable
                    data={{
                        ID: item.id,
                        Name: item.name,
                        Detail: <span className="newline">{item.detail}</span>,
                        Individuality: (
                            <div>
                                {mergeElements(
                                    item.individuality.map((trait) => (
                                        <TraitDescription region={this.props.region} trait={trait} />
                                    )),
                                    " "
                                )}
                            </div>
                        ),
                        Type: item.type,
                        Uses: (
                            <div>
                                <ItemUseDescription region={this.props.region} item={item} />
                            </div>
                        ),
                    }}
                />

                <div style={{ marginBottom: "3%" }}>
                    <RawDataViewer text="Nice" data={item} />
                    <RawDataViewer text="Raw" data={`${Host}/raw/${this.props.region}/item/${item.id}`} />
                </div>

                {itemIsMaterial(item) ? (
                    this.state.servants.length === 0 ? (
                        <>Loading servants data</>
                    ) : (
                        itemUsageTable
                    )
                ) : null}
            </div>
        );
    }
}

export default withRouter(ItemPage);
