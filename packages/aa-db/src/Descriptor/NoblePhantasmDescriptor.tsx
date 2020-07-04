import React from "react";
import {Link} from "react-router-dom";
import NoblePhantasm from "../Api/Data/NoblePhantasm";
import Region from "../Api/Data/Region";

interface IProps {
    region: Region;
    noblePhantasm: NoblePhantasm;
}

class NoblePhantasmDescriptor extends React.Component<IProps> {
    render() {
        return (
            <Link to={`/${this.props.region}/noble-phantasm/${this.props.noblePhantasm.id}`}>
                [{this.props.noblePhantasm.name}]
            </Link>
        );
    }
}

export default NoblePhantasmDescriptor;
