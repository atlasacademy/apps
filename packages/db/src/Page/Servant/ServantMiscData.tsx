import {Servant} from "@atlasacademy/api-connector";
import React from "react";
import DataTable from "../../Component/DataTable";
import {asPercent} from "../../Helper/OutputHelper";

const showHits = function (hits: number[] | undefined): JSX.Element | string {
        if (hits === undefined)
            return '';

        return <span>
            {hits.map((hit, index) => {
                return (index > 0 ? ', ' : '') + asPercent(hit, 0);
            })}
            &nbsp;-&nbsp;
            {hits.length} Hits
        </span>
    };

interface IProps {
    servant: Servant.Servant;
}

class ServantMiscData extends React.Component<IProps> {
    private hitsColumn() {
        const { buster, arts, quick, extra } = this.props.servant.hitsDistribution;
        return (
            <DataTable
                data={{
                    "Buster": showHits(buster),
                    "Arts": showHits(arts),
                    "Quick": showHits(quick),
                    "Extra": showHits(extra),
                }}/>
        );
    }

    private miscColumn() {
        return (
            <DataTable
                data={{
                    "Star Absorb": this.props.servant.starAbsorb,
                    "Star Gen": asPercent(this.props.servant.starGen, 1),
                    "Death Chance": asPercent(this.props.servant.instantDeathChance, 1)
                }}/>
        );
    }

    render() {
        return (
            <>
                {this.miscColumn()}
                {this.hitsColumn()}
            </>
        );
    }
}

export default ServantMiscData;
