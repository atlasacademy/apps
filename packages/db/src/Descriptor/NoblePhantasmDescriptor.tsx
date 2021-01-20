import {NoblePhantasm, Region} from "@atlasacademy/api-connector";
import React from "react";
import {Link} from "react-router-dom";
import getRubyText from "../Helper/StringHelper";

interface IProps {
    region: Region;
    noblePhantasm: NoblePhantasm.NoblePhantasmBasic;
}

class NoblePhantasmDescriptor extends React.Component<IProps> {
    render() {
        return (
            <Link to={`/${this.props.region}/noble-phantasm/${this.props.noblePhantasm.id}`}>
                [{getRubyText(this.props.region, this.props.noblePhantasm.name, this.props.noblePhantasm.ruby)}]
            </Link>
        );
    }
}

export default NoblePhantasmDescriptor;
