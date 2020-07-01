import React from "react";
import Func from "../../Api/Data/Func";
import BuffDescription from "../../Component/BuffDescription";
import DataTable from "../../Component/DataTable";
import RawDataViewer from "../../Component/RawDataViewer";

interface IProps {
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
                "Buffs": (
                    <div>
                        {func.buffs.map(
                            (buff, index) => <BuffDescription key={index} buff={buff}/>
                        )}
                    </div>
                )
            }}/>
        );
    }
}

export default FuncMainData;
