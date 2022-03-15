import React from "react";
import { Link } from "react-router-dom";

import { Func, Region } from "@atlasacademy/api-connector";

import { Host } from "../../Api";
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
            <>
                <DataTable
                    responsive
                    data={{
                        ID: func.funcId,
                        Type: <Link to={`/${this.props.region}/funcs?type=${func.funcType}`}>{func.funcType}</Link>,
                        Target: func.funcTargetType,
                        "Affects Players/Enemies": func.funcTargetTeam,
                        "Popup Text": func.funcPopupText,
                        "Target Traits": (
                            <div>
                                {func.functvals.map((trait) => {
                                    return <TraitDescription key={trait.id} region={this.props.region} trait={trait} />;
                                })}
                            </div>
                        ),
                        "Affects Traits": (
                            <div>
                                {func.traitVals?.map((trait) => {
                                    return (
                                        <TraitDescription
                                            key={trait.id}
                                            region={this.props.region}
                                            trait={trait}
                                            owner="buffs"
                                            ownerParameter="vals"
                                        />
                                    );
                                })}
                            </div>
                        ),
                        Buff: (
                            <div>
                                {func.buffs.map((buff) => {
                                    return <BuffDescription key={buff.id} region={this.props.region} buff={buff} />;
                                })}
                            </div>
                        ),
                    }}
                />
                <div style={{ marginBottom: "3%" }}>
                    <RawDataViewer text="Nice" data={func} />
                    <RawDataViewer
                        text="Raw"
                        data={`${Host}/raw/${this.props.region}/function/${func.funcId}?expand=true`}
                    />
                </div>
            </>
        );
    }
}

export default FuncMainData;
