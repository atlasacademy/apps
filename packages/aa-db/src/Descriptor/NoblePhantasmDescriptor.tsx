import {NoblePhantasm, Region} from "@atlasacademy/api-connector";
import React from "react";
import {Link} from "react-router-dom";

interface IProps {
    region: Region;
    noblePhantasm: NoblePhantasm.NoblePhantasm;
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
