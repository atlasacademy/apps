import React from "react";
import Servant from "../../Api/Data/Servant";
import ClassIcon from "../../Component/ClassIcon";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import RarityDescriptor from "../../Descriptor/RarityDescriptor";

interface IProps {
    servant: Servant;
}

class ServantMainData extends React.Component<IProps> {
    render() {
        const servant = this.props.servant;

        return (
            <div>
                <h1>
                    <ClassIcon className={servant.className} rarity={servant.rarity}/>
                    &nbsp;
                    {servant.name}
                </h1>

                <DataTable data={{
                    "Raw": <RawDataViewer data={servant}/>,
                    "ID": servant.id,
                    "Collection": servant.collectionNo,
                    "Name": servant.name,
                    "Class": servant.className,
                    "Rarity": <RarityDescriptor rarity={servant.rarity}/>,
                    "Cost": servant.cost,
                    "Gender": servant.gender,
                    "Attribute": servant.attribute,
                    "Max Lv.": servant.lvMax,
                    "Base Hp": servant.hpBase,
                    "Base Atk": servant.atkBase,
                    "Max Hp": servant.hpMax,
                    "Max Atk": servant.atkMax,
                }}/>
            </div>
        );
    }
}

export default ServantMainData;
