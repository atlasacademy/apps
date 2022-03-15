import React from "react";
import { connect, ConnectedProps } from "react-redux";

import { BattleEvent } from "../../app/battle/types";
import { RootState } from "../../app/store";

interface ExternalProps {
    event: BattleEvent;
}

const mapStateToProps = (state: RootState, props: ExternalProps) => ({
        ...props,
    }),
    mapDispatchToProps = {
        //
    },
    connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

class BattleEventDisplay extends React.Component<Props> {
    render() {
        return <div>{this.props.event.description}</div>;
    }
}

export default connector(BattleEventDisplay);
