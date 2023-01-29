import React from "react";
import { ConnectedProps, connect } from "react-redux";

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

const BattleEventDisplay: React.FC<Props> = (props) => {
    return <div>{props.event.description}</div>;
};

export default connector(BattleEventDisplay);
