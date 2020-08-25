import {Enemy, Region} from "@atlasacademy/api-connector";
import React from "react";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import RarityDescriptor from "../../Descriptor/RarityDescriptor";
import {asPercent, formatNumber} from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    enemy: Enemy.Enemy;
}

class EnemyMainData extends React.Component<IProps> {
    render() {
        const enemy = this.props.enemy;

        return (
            <>  
                <div>
                    <DataTable data={{
                        "ID": enemy.id,
                        "Name": enemy.name,
                        "Class": enemy.className,
                        "Rarity": <RarityDescriptor rarity={enemy.rarity}/>,
                        "Attribute": enemy.attribute,
                        "Hp": <div>
                            Base: {formatNumber(enemy.hpBase)}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            Max: {formatNumber(enemy.hpMax)}
                        </div>,
                        "Atk": <div>
                            Base: {formatNumber(enemy.atkBase)}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            Max: {formatNumber(enemy.atkMax)}
                        </div>,
                        "Death Chance": asPercent(enemy.instantDeathChance, 1),
                    }}/>
                </div>
                <span>
                    <RawDataViewer text="Nice" data={enemy}/>
                    <RawDataViewer
                        text="Raw"
                        data={`https://api.atlasacademy.io/raw/${this.props.region}/servant/${enemy.id}?expand=true&lore=true`}/>,
                </span>
            </>
        );
    }
}

export default EnemyMainData;
