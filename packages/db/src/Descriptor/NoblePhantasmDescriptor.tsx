import {NoblePhantasm, Region} from "@atlasacademy/api-connector";
import React from "react";
import {Link} from "react-router-dom";
import getRubyText from "../Helper/StringHelper";

interface IProps {
    region: Region;
    noblePhantasm: NoblePhantasm.NoblePhantasmBasic;
    overwriteName?: string;
    overwriteRuby?: string;
}

class NoblePhantasmDescriptor extends React.Component<IProps> {
    render() {
        const name = this.props.overwriteName ? this.props.overwriteName : this.props.noblePhantasm.name;
        const ruby = this.props.overwriteRuby ? this.props.overwriteRuby : this.props.noblePhantasm.ruby;
        return (
            <Link to={`/${this.props.region}/noble-phantasm/${this.props.noblePhantasm.id}`}>
                [{getRubyText(this.props.region, name, ruby)}]
            </Link>
        );
    }
}

export default NoblePhantasmDescriptor;
