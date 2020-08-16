import {Func, Region} from "@atlasacademy/api-connector";
import React from "react";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import BuffDescription from "../../Descriptor/BuffDescription";
import TraitDescription from "../../Descriptor/TraitDescription";

interface IProps {
    region: Region;
    func: Func.Func;
}

class FuncMainData extends React.Component<IProps> {
    render() {
        const func = this.props.func;

        return (
            <DataTable data={{
                "Data": <RawDataViewer data={func}/>,
                "Raw": <RawDataViewer
                    data={`https://api.atlasacademy.io/raw/${this.props.region}/function/${func.funcId}?expand=true`}/>,
                "ID": func.funcId,
                "Type": func.funcType,
                "Target": func.funcTargetType,
                "Affects Players/Enemies": func.funcTargetTeam,
                "Popup Text": func.funcPopupText,
                "Target Traits": (
                    <div>
                        {func.functvals.map((trait, index) => {
                            return <TraitDescription key={index} region={this.props.region} trait={trait}/>;
                        })}
                    </div>
                ),
                "Affects Traits": (
                    <div>
                        {func.traitVals?.map((trait, index) => {
                            return <TraitDescription key={index} region={this.props.region} trait={trait}/>;
                        })}
                    </div>
                ),
                "Buffs": (
                    <div>
                        {func.buffs.map((buff, index) => {
                            return <BuffDescription key={index} region={this.props.region} buff={buff}/>;
                        })}
                    </div>
                )
            }}/>
        );
    }
}

export default FuncMainData;
