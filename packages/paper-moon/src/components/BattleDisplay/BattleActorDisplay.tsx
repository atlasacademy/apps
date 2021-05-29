import {BattleTeam} from "@atlasacademy/battle";
import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {BattleStateActor} from "../../app/battle/types";
import {RootState} from "../../app/store";

interface ExternalProps {
    actor: BattleStateActor,
    team: BattleTeam,
}

const mapStateToProps = (state: RootState, props: ExternalProps) => ({
        ...props,
    }),
    mapDispatchToProps = {
        //
    },
    connector = connect(mapStateToProps, mapDispatchToProps);

type BattleActorDisplayProps = ConnectedProps<typeof connector>;

class BattleActorDisplay extends React.Component<BattleActorDisplayProps> {

    render() {
        return (
            <div>
                <img src={this.props.actor.face} alt={this.props.actor.name}/>
                {this.props.actor.name}
            </div>
        );
    }

}

export default connector(BattleActorDisplay);
