import React from "react";
import Func from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import BuffDescriptor from "../../Descriptor/BuffDescriptor";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";
import TraitDescriptor from "../../Descriptor/TraitDescriptor";

interface IProps {
    region: Region;
    func: Func;
}

class FuncMainData extends React.Component<IProps> {
    render() {
        const func = this.props.func;

        return (
            <DataTable data={{
                "Raw": <RawDataViewer data={func}/>,
                "ID": func.funcId,
                "Type": func.funcType,
                "Target": func.funcTargetType,
                "Affects Players/Enemies": func.funcTargetTeam,
                "Popup Text": func.funcPopupText,
                "Affects Traits": (
                    <div>
                        {func.traitVals?.map((trait, index) => {
                            return <TraitDescriptor key={index} region={this.props.region} trait={trait}/>;
                        })}
                    </div>
                ),
                "Buffs": (
                    <div>
                        {func.buffs.map((buff, index) => {
                            return <BuffDescriptor key={index} region={this.props.region} buff={buff}/>;
                        })}
                    </div>
                )
            }}/>
        );
    }
}

export default FuncMainData;
